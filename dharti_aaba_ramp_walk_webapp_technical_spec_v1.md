# Dharti Aaba Veer Birsa Munda Jayanti 2026 --- Ramp Walk Registration Web App

## Technical Architecture, Database Schema, Registration & Payment State Flow, Security, Features and Implementation Specification

**Document status:** Architecture Freeze Draft v1.0\
**Purpose:** Freeze the technical architecture, database schema,
registration/payment state machine, exact application features,
validation rules, webhook architecture, storage strategy, and
integration boundaries before implementation.

------------------------------------------------------------------------

## 1. Project Overview

The application is an online registration platform for the **Dharti Aaba
Veer Birsa Munda Jayanti 2026 -- Ramp Walk Competition**.

The supplied registration form contains participant bio-data,
identification, address/contact details, educational and occupation
information, Instagram handle, competition category, age category,
attire information, cultural significance, optional talent/introduction,
photograph, declaration, and organizer-use fields.

The poster/reference material indicates a **₹500 registration fee** for
the Miss & Mr Rourkela 2026 / associated audition promotion and
describes multiple audition/final rounds. The exact final event
configuration should be stored as event settings rather than hard-coded
into application code.

### Primary goals

1.  Professional, responsive registration experience.
2.  Fixed registration fee controlled server-side.
3.  Registration becomes confirmed only after verified successful
    payment.
4.  Razorpay integration using Orders API + Checkout + server-side
    signature verification + webhook processing.
5.  PostgreSQL as the primary source of truth.
6.  Supabase Storage for participant photographs.
7.  Google Sheets as an operational/reporting mirror, not the primary
    database.
8.  Every successful registration becomes a **Delegate**.
9.  Delegates can log in using:
    -   Registration Number
    -   Mobile Number
10. Delegates can view their complete registration details and
    registration/payment status.
11. No registration-capacity hard limit.
12. Photo upload limit: **1 MB**.
13. Photo dimensions are displayed/recommended in the form, but
    **dimensions are not technically enforced**.
14. Strong input validation, uniqueness constraints, secure
    authentication, authorization, auditability, idempotency, and error
    recovery.
15. Check-in functionality is intentionally **out of scope for the first
    architecture freeze** and will be designed later.

------------------------------------------------------------------------

# 2. Frozen Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + React +       Web application
                          TypeScript              

  Routing                 Next.js App Router      Pages and server
                                                  endpoints

  Styling                 Tailwind CSS            Responsive UI

  UI primitives           shadcn/ui + Radix-based Accessible interface
                          components              

  Forms                   React Hook Form         Form state

  Validation              Zod                     Client + server
                                                  validation

  Database                Supabase PostgreSQL     Primary application
                                                  database

  File storage            Supabase Storage        Participant photos

  Authentication          Supabase Auth           Delegate/admin
                                                  authentication

  Hosting                 Vercel                  Next.js deployment

  Payment gateway         Razorpay                Registration payment

  Payment integration     Razorpay Orders API +   Secure payment
                          Checkout + Webhooks     lifecycle

  Reporting               Google Sheets API       Registration/payment
                                                  reporting mirror

  QR                      `qrcode` or equivalent  Registration pass QR

  PDF                     React/server-side PDF   Optional registration
                          library                 pass

  Icons                   Lucide                  UI icons

  Date handling           `date-fns` or           Date/time handling
                          equivalent              

  IDs                     PostgreSQL UUID +       Internal/public
                          human-readable          identifiers
                          registration number     
  -----------------------------------------------------------------------

### Architecture principle

**PostgreSQL is the source of truth.**

Google Sheets is a reporting/operations mirror.

Supabase Storage stores files.

Razorpay is the payment processor and payment-status authority for
payment events.

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
                         PUBLIC INTERNET
                               |
                               v
                    +----------------------+
                    |       VERCEL         |
                    |      Next.js         |
                    | App Router / APIs    |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        +-----------+   +-------------+   +------------+
        | Razorpay  |   |  Supabase   |   |  Google    |
        | Payments  |   | PostgreSQL  |   |  Sheets    |
        | Checkout  |   | Auth + RLS  |   | Reporting  |
        | Webhooks  |   +------+------+   +------------+
        +-----------+          |
                               v
                       +---------------+
                       |   Supabase    |
                       |    Storage    |
                       | Participant   |
                       |    Photos     |
                       +---------------+
```

------------------------------------------------------------------------

# 4. System-of-Record Rules

## 4.1 PostgreSQL

PostgreSQL is authoritative for:

-   Registration identity
-   Participant data
-   Registration number
-   Registration status
-   Payment records
-   Razorpay order/payment identifiers
-   Delegate access relationship
-   Photo metadata/path
-   Google Sheets synchronization state
-   Audit records

## 4.2 Razorpay

Razorpay is authoritative for:

-   Razorpay order
-   Payment identifier
-   Payment state
-   Captured/authorized/failed/refunded status
-   Gateway-side payment metadata

The application must still maintain a local payment record for
reconciliation and application logic.

## 4.3 Google Sheets

Google Sheets is a **secondary operational mirror**.

It must never be the dependency that determines whether a registration
succeeds.

If Google Sheets is temporarily unavailable:

``` text
Payment verified
      |
      v
PostgreSQL confirmed
      |
      v
Google Sheets sync pending
```

The registration remains valid.

------------------------------------------------------------------------

# 5. Event Configuration

Do not hard-code event-specific values throughout the application.

Create an `event_settings` record containing:

``` text
event_name
event_short_name
event_year
registration_fee
currency
registration_open_at
registration_close_at
support_phone
support_email
venue_information
registration_terms_version
privacy_policy_version
```

Example:

``` text
event_name = Dharti Aaba Veer Birsa Munda Jayanti 2026
registration_fee = 50000
currency = INR
```

Razorpay amount is represented in the currency's smallest unit, so ₹500
becomes `50000` paise.

The frontend must never be trusted to determine the payment amount.

------------------------------------------------------------------------

# 6. Registration Form --- Frozen Field Inventory

The supplied registration form contains the following information.

## Section I --- Participant Bio-Data & Identification

### 1. Full Name

Field:

``` text
full_name
```

Rules:

-   Required
-   Trim whitespace
-   Reasonable maximum length
-   No HTML
-   Unicode letters/spaces allowed

------------------------------------------------------------------------

### 2. Father / Mother / Guardian Name

``` text
guardian_name
```

Rules:

-   Required unless organizer changes this rule
-   Trim whitespace
-   Reasonable maximum length

------------------------------------------------------------------------

### 3. Date of Birth

``` text
date_of_birth
```

Rules:

-   Valid date
-   Cannot be in the future
-   Age calculated server-side
-   Age should not be accepted as an authoritative user-entered value

------------------------------------------------------------------------

### 4. Age

The source form contains an age field.

Recommended implementation:

``` text
age
```

should be **derived from Date of Birth** rather than trusted from user
input.

If displayed, it should be read-only.

------------------------------------------------------------------------

### 5. Gender

``` text
gender
```

Options from source:

``` text
Male
Female
Other
```

------------------------------------------------------------------------

### 6. Tribal Community / Tribe

``` text
tribal_community
```

Required status should be finalized by the organizer.

------------------------------------------------------------------------

### 7. Identity Proof

Source form contains:

``` text
identity_proof_type
identity_proof_number
identity_proof_file
```

Identity proof type options shown in the source:

``` text
Aadhaar
Voter ID
```

Because identity documents are sensitive personal information, access
must be restricted and the final retention policy must be explicitly
approved by the organizer.

------------------------------------------------------------------------

### 8. State / District

``` text
state
district
```

------------------------------------------------------------------------

### 9. Village / Town / City

``` text
city_or_village
```

------------------------------------------------------------------------

### 10. Full Address

``` text
full_address
```

------------------------------------------------------------------------

### 11. PIN Code

``` text
pincode
```

Recommended validation:

``` text
6 numeric digits
```

------------------------------------------------------------------------

### 12. Mobile Number

``` text
mobile_number
```

Business rules:

-   Required
-   Indian 10-digit mobile number
-   Digits only after normalization
-   Unique
-   Database unique constraint
-   Duplicate registration must be rejected

Recommended normalization:

``` text
+91XXXXXXXXXX
```

Store one canonical representation.

------------------------------------------------------------------------

### 13. WhatsApp Number

``` text
whatsapp_number
```

Can be the same as mobile number.

Validation:

-   Valid Indian mobile format
-   Normalize before comparison

------------------------------------------------------------------------

### 14. Email ID

``` text
email
```

Rules:

-   Valid email syntax
-   Normalize to lowercase
-   Unique
-   Database unique constraint

------------------------------------------------------------------------

### 15. Educational Qualification

``` text
educational_qualification
```

------------------------------------------------------------------------

### 16. Occupation / Profession

``` text
occupation
```

------------------------------------------------------------------------

### 17. Instagram Profile / Handle

``` text
instagram_handle
```

Example:

``` text
@username
```

Optional unless organizer makes it mandatory.

------------------------------------------------------------------------

# 7. Competition Details

## Category

Source form lists:

``` text
Traditional Tribal Attire
Modern Fusion
Cultural / Heritage Theme
```

Database enum:

``` text
TRADITIONAL_TRIBAL_ATTIRE
MODERN_FUSION
CULTURAL_HERITAGE_THEME
```

Display labels can remain human-readable.

------------------------------------------------------------------------

## Age Category

The supplied form lists:

``` text
Junior — Under 15
Youth — 15–25
Adult — 26 & Above
```

The poster/reference material separately states an eligibility age range
of **15 to 35 years**.

This is a **business-rule conflict that must be resolved before
production**.

Do not silently merge these rules.

Recommended implementation:

-   Calculate age from DOB.
-   Configure allowed minimum/maximum age in `event_settings`.
-   Configure age-category labels separately.
-   Reject registrations outside the final organizer-approved
    eligibility rule.

------------------------------------------------------------------------

## Name of Tribal Attire / Traditional Dress

``` text
attire_name
```

------------------------------------------------------------------------

## State / Tribe Represented Through Attire

``` text
attire_representation
```

------------------------------------------------------------------------

## Brief Description of Attire and Cultural Significance

``` text
attire_description
```

Recommended:

-   Required for attire-based categories
-   Text length limit
-   Plain text only

------------------------------------------------------------------------

## Special Talent / Introduction

``` text
special_talent
```

Optional.

------------------------------------------------------------------------

# 8. Participant Photograph

The application must support participant photograph upload.

### Frozen rules

``` text
Maximum file size: 1 MB
```

No dimension enforcement.

The form should display recommended photo guidance without rejecting
files based on dimensions.

Example UI:

``` text
Upload Recent Passport-Size Colour Photograph

Maximum file size: 1 MB

Recommended:
- Passport-size portrait photo
- Clear face
- Recent colour photograph
- Good lighting
- Plain/clean background where possible

Dimensions are recommended only and are not technically enforced.
```

### Allowed file types

Recommended:

``` text
image/jpeg
image/png
image/webp
```

The final production policy should explicitly decide whether WebP is
accepted.

SVG should not be accepted.

### Storage

Do not store image binary data in PostgreSQL.

Store the object in Supabase Storage and store only metadata/path in
PostgreSQL.

Example:

``` text
participant-photos/
  registrations/
    <registration_uuid>/
      profile.<extension>
```

Use generated paths rather than user-provided filenames.

------------------------------------------------------------------------

# 9. Registration Status Model

The application must distinguish registration state from payment state.

## Registration status

``` text
DRAFT
PAYMENT_PENDING
CONFIRMED
CANCELLED
```

Meaning:

### DRAFT

Registration data has been started but is not yet ready for payment.

### PAYMENT_PENDING

A registration exists and a Razorpay order has been created, but payment
is not yet confirmed.

### CONFIRMED

Payment has been successfully verified/captured according to the
application's payment rules.

A delegate is created/activated.

### CANCELLED

Registration was cancelled by an authorized administrator or by a
defined business process.

------------------------------------------------------------------------

# 10. Payment Status Model

``` text
CREATED
AUTHORIZED
CAPTURED
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

The exact set can be expanded as Razorpay event coverage is implemented.

The critical business rule is:

``` text
Registration = CONFIRMED
ONLY WHEN
Payment has been verified and is captured/otherwise confirmed according to Razorpay's authoritative status.
```

Do not mark a registration confirmed solely because the browser says
payment succeeded.

------------------------------------------------------------------------

# 11. Payment Architecture

## Core flow

``` text
User
 |
 | Submit registration
 v
Server validates input
 |
 v
Check uniqueness
 |
 v
Create registration
 |
 | status = PAYMENT_PENDING
 v
Create Razorpay Order on server
 |
 v
Return order_id + public key ID
 |
 v
Razorpay Checkout
 |
 +--------------------------+
 |                          |
 | Payment failed            | Payment succeeded
 v                          v
PAYMENT_FAILED         Checkout response
                            |
                            v
                     Server verification
                            |
                            v
                     Razorpay API check
                            |
                            v
                         CAPTURED?
                         /       \
                       NO         YES
                       |           |
                       v           v
                    Pending     CONFIRMED
                                  |
                                  v
                            Delegate access
                                  |
                                  v
                            Sheet sync
```

------------------------------------------------------------------------

# 12. Why Checkout Response Is Not Enough

The browser response is useful for immediate UX, but it is not the
application's final source of truth.

Razorpay requires server-side signature verification using the order ID,
payment ID, and secret.

The application must:

1.  Receive payment identifiers from Checkout.
2.  Retrieve the expected order from PostgreSQL.
3.  Verify that the order belongs to the registration.
4.  Verify the Razorpay signature on the server.
5.  Fetch/verify payment state through Razorpay.
6.  Confirm the amount and currency match the expected registration fee.
7.  Confirm the payment belongs to the expected order.
8.  Accept only the correct final payment state.
9.  Update the registration transactionally.
10. Return a safe response to the browser.

------------------------------------------------------------------------

# 13. Webhook Architecture --- Industry Standard

The webhook endpoint is:

``` text
POST /api/webhooks/razorpay
```

The webhook must be:

-   Publicly reachable over HTTPS.
-   Independent of the user's browser session.
-   Signature verified.
-   Idempotent.
-   Fast to acknowledge.
-   Safe to retry.
-   Logged/audited.
-   Capable of handling duplicate delivery.
-   Capable of handling events arriving out of order.

## Recommended processing architecture

``` text
Razorpay
   |
   | HTTPS POST
   v
/api/webhooks/razorpay
   |
   +--> Read raw request body
   |
   +--> Verify Razorpay webhook signature
   |
   +--> Validate event structure
   |
   +--> Check event idempotency
   |
   +--> Store webhook event
   |
   +--> Return 2xx quickly
   |
   v
Process event
   |
   v
Update payment
   |
   v
Update registration
   |
   v
Create/activate delegate
   |
   v
Queue/perform Sheets synchronization
```

### Important

Do not parse/re-stringify the request body before computing the webhook
HMAC if the provider requires the raw payload.

Store the raw payload or an appropriately protected representation for
audit/debugging where permitted by data-retention policy.

------------------------------------------------------------------------

# 14. Webhook Idempotency

Webhook providers can retry delivery.

The same event must not create:

-   duplicate registration numbers
-   duplicate delegate records
-   duplicate payment records
-   duplicate Sheets rows
-   duplicate confirmation emails

Therefore create a table:

``` text
webhook_events
```

with:

``` text
id
provider
event_id
event_type
payload
signature_valid
processing_status
received_at
processed_at
error_message
```

Unique constraint:

``` text
(provider, event_id)
```

Processing:

``` text
Receive event
   |
   v
Already processed?
  / \
YES  NO
 |    |
ACK   Store
      |
      v
    Process
```

------------------------------------------------------------------------

# 15. Payment Idempotency

The `payments` table must have unique constraints on provider
identifiers.

Recommended:

``` text
UNIQUE(razorpay_order_id)
UNIQUE(razorpay_payment_id)
```

A payment webhook must never blindly insert another payment row.

Use:

``` text
UPSERT
+
state transition validation
```

------------------------------------------------------------------------

# 16. Payment State Transition Rules

Recommended:

``` text
CREATED
   |
   +--> AUTHORIZED
   |
   +--> FAILED

AUTHORIZED
   |
   +--> CAPTURED
   |
   +--> FAILED/OTHER PROVIDER STATE

CAPTURED
   |
   +--> REFUNDED
   |
   +--> PARTIALLY_REFUNDED
```

Terminal states should not be accidentally downgraded.

Example:

``` text
CAPTURED -> AUTHORIZED
```

must not overwrite the existing captured state merely because a delayed
webhook arrives.

------------------------------------------------------------------------

# 17. Registration Confirmation Transaction

When payment is confirmed:

``` text
BEGIN TRANSACTION

1. Lock registration row.
2. Verify registration is not already confirmed.
3. Verify payment belongs to registration.
4. Verify amount.
5. Verify currency.
6. Verify payment state.
7. Generate registration number if absent.
8. Set registration status = CONFIRMED.
9. Set confirmed_at.
10. Create/activate delegate identity mapping.
11. Record audit event.

COMMIT
```

Google Sheets synchronization should happen after the core database
transaction succeeds.

------------------------------------------------------------------------

# 18. Registration Number Generation

Human-readable registration number:

``` text
TH26-000001
TH26-000002
TH26-000003
...
```

The prefix should be configurable.

Use a PostgreSQL sequence or another concurrency-safe mechanism.

Never generate registration numbers with:

``` text
SELECT COUNT(*) + 1
```

because concurrent registrations can produce duplicates.

Recommended database approach:

``` text
registration_number_seq
```

then format:

``` text
TH26-%06d
```

------------------------------------------------------------------------

# 19. Delegate Model

Every confirmed registration becomes a delegate.

There are two concepts:

``` text
auth user
```

and:

``` text
delegate profile
```

Recommended relationship:

``` text
auth.users
      |
      | 1:1
      v
delegates
      |
      | 1:1
      v
registrations
```

However, because login is based on Registration Number + Mobile Number,
we should not expose a public password-reset/authentication flow that
leaks whether a registration exists.

The login mechanism should be implemented carefully.

------------------------------------------------------------------------

# 20. Delegate Login

Frozen login requirement:

``` text
Registration Number
+
Mobile Number
```

Example:

``` text
Registration Number:
TH26-000123

Mobile Number:
9876543210
```

## Login rules

1.  Normalize both values.
2.  Find the registration using registration number.
3.  Compare the normalized mobile number securely.
4.  Registration must be `CONFIRMED`.
5.  Create an authenticated session.
6.  Redirect to `/delegate/dashboard`.

### Security requirement

Avoid returning different error messages such as:

``` text
Registration number does not exist
```

versus:

``` text
Mobile number is incorrect
```

because that can enable account enumeration.

Use a generic message:

``` text
Registration number or mobile number is incorrect.
```

------------------------------------------------------------------------

# 21. Delegate Dashboard

A confirmed delegate can see:

### Registration

-   Registration number
-   Full name
-   Guardian name
-   Date of birth
-   Age
-   Gender
-   Tribe/community
-   State
-   District
-   Village/town/city
-   Address
-   PIN
-   Mobile
-   WhatsApp
-   Email
-   Education
-   Occupation
-   Instagram handle

### Competition

-   Category
-   Age category
-   Attire name
-   State/tribe represented
-   Attire description
-   Special talent/introduction

### Payment

-   Registration fee
-   Payment status
-   Payment date
-   Razorpay payment reference where appropriate

### Documents

-   Participant photo
-   Registration pass
-   QR code
-   Receipt, if implemented

------------------------------------------------------------------------

# 22. Delegate Permissions

A delegate can:

``` text
VIEW own registration
VIEW own payment status
VIEW/download own pass
VIEW own QR
```

A delegate cannot:

``` text
VIEW another participant
EDIT payment
CHANGE registration number
VIEW admin records
VIEW private storage objects belonging to another delegate
ACCESS Razorpay credentials
```

Editable registration fields, if allowed later, must have an explicit
business rule and audit trail.

------------------------------------------------------------------------

# 23. Admin Architecture

Admin functions are separate from delegate functions.

Suggested roles:

``` text
SUPER_ADMIN
ADMIN
VIEWER
```

Potential future role:

``` text
CHECKIN_OPERATOR
```

Check-in is intentionally not being frozen yet.

------------------------------------------------------------------------

# 24. Admin Features --- Frozen Scope

## Dashboard

Show:

-   Total registrations
-   Confirmed registrations
-   Payment pending
-   Payment failed
-   Cancelled registrations
-   Total successful collection
-   Today's registrations
-   Recent registrations
-   Google Sheets sync failures

No registration-capacity counter is required because there is **no hard
capacity limit**.

------------------------------------------------------------------------

## Registration Management

Features:

-   Search by registration number
-   Search by name
-   Search by mobile
-   Search by email
-   Filter by category
-   Filter by age category
-   Filter by state
-   Filter by registration status
-   Filter by payment status
-   View participant
-   View photo
-   View payment details
-   View audit history

------------------------------------------------------------------------

## Payment Management

Admin can view:

``` text
Registration number
Razorpay order ID
Razorpay payment ID
Amount
Currency
Payment status
Created time
Captured time
```

Refund operations should not be added until the organizer explicitly
defines the refund policy.

------------------------------------------------------------------------

# 25. Google Sheets Synchronization

Suggested workbook:

## Sheet 1 --- Registrations

Columns:

``` text
Registration Number
Full Name
Guardian Name
Date of Birth
Age
Gender
Tribal Community
Identity Proof Type
State
District
Village/Town/City
PIN
Mobile
WhatsApp
Email
Education
Occupation
Instagram
Category
Age Category
Attire Name
Attire Representation
Attire Description
Special Talent
Registration Status
Payment Status
Registration Date
Confirmed Date
```

Do not put full sensitive identity documents or secret information into
Google Sheets unless explicitly required.

------------------------------------------------------------------------

## Sheet 2 --- Payments

``` text
Registration Number
Razorpay Order ID
Razorpay Payment ID
Amount
Currency
Payment Status
Payment Created At
Payment Captured At
```

------------------------------------------------------------------------

## Sheet 3 --- Sync Errors

``` text
Registration Number
Entity
Error
Retry Count
Last Attempt
Resolved
```

------------------------------------------------------------------------

# 26. Google Sheets Sync Strategy

Do not make registration depend synchronously on Google Sheets.

Preferred:

``` text
PostgreSQL CONFIRMED
        |
        v
Create sync job / mark sync pending
        |
        v
Google Sheets
        |
   +----+----+
   |         |
 success    failure
   |         |
   v         v
SYNCED    RETRY_PENDING
```

Use idempotent row identification based on:

``` text
registration_number
```

Never use row number as the permanent identifier.

------------------------------------------------------------------------

# 27. Photo Storage Architecture

Supabase Storage bucket:

``` text
participant-photos
```

Recommended bucket visibility:

``` text
PRIVATE
```

Store object path in PostgreSQL:

``` text
photo_storage_path
```

Example:

``` text
participant-photos/registrations/0e7...uuid/profile.jpg
```

Do not store a permanent public URL in the database if the bucket is
private.

Generate short-lived signed URLs when a delegate/admin is authorized to
view the image.

------------------------------------------------------------------------

# 28. Photo Upload Flow

Recommended:

``` text
User selects photo
       |
       v
Client validates:
- file type
- file size <= 1 MB
       |
       v
Registration draft exists
       |
       v
Upload directly to Supabase Storage
       |
       v
Store storage path in registration
       |
       v
Continue to payment
```

The application should still perform server-side validation before
trusting the stored metadata.

------------------------------------------------------------------------

# 29. Orphan Photo Handling

A user may upload a photo and never pay.

Therefore:

``` text
temporary/draft photos
```

should be distinguishable from:

``` text
confirmed registration photos
```

Recommended paths:

``` text
drafts/<draft_id>/photo.jpg
confirmed/<registration_uuid>/photo.jpg
```

A scheduled cleanup process can remove abandoned draft files after a
defined retention period.

Do not delete confirmed photos because of payment timeout.

------------------------------------------------------------------------

# 30. Database Schema

## `registrations`

``` sql
create table public.registrations (
  id uuid primary key default gen_random_uuid(),

  registration_number text unique,

  full_name text not null,
  guardian_name text not null,

  date_of_birth date not null,

  gender text not null,
  tribal_community text,

  identity_proof_type text,
  identity_proof_number text,
  identity_proof_storage_path text,

  state text not null,
  district text not null,
  city_or_village text not null,
  full_address text not null,
  pincode text not null,

  mobile_number text not null unique,
  whatsapp_number text,

  email text not null unique,

  educational_qualification text,
  occupation text,
  instagram_handle text,

  category text not null,
  age_category text,

  attire_name text,
  attire_representation text,
  attire_description text,
  special_talent text,

  photo_storage_path text,

  registration_status text not null default 'DRAFT',

  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz
);
```

------------------------------------------------------------------------

# 31. `payments`

``` sql
create table public.payments (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id),

  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,

  amount integer not null,
  currency text not null default 'INR',

  status text not null default 'CREATED',

  signature_verified boolean not null default false,

  provider_created_at timestamptz,
  captured_at timestamptz,

  raw_provider_metadata jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 32. `delegates`

``` sql
create table public.delegates (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null unique
    references public.registrations(id),

  auth_user_id uuid unique,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 33. `event_settings`

``` sql
create table public.event_settings (
  id uuid primary key default gen_random_uuid(),

  event_name text not null,
  event_short_name text not null,
  event_year integer not null,

  registration_fee integer not null,
  currency text not null default 'INR',

  registration_open_at timestamptz,
  registration_close_at timestamptz,

  support_phone text,
  support_email text,

  terms_version text,
  privacy_policy_version text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 34. `webhook_events`

``` sql
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),

  provider text not null,
  event_id text not null,
  event_type text not null,

  signature_valid boolean not null default false,

  payload jsonb,

  processing_status text not null default 'RECEIVED',

  error_message text,

  received_at timestamptz not null default now(),
  processed_at timestamptz,

  unique(provider, event_id)
);
```

------------------------------------------------------------------------

# 35. `sheet_sync_jobs`

``` sql
create table public.sheet_sync_jobs (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid
    references public.registrations(id),

  entity_type text not null,

  status text not null default 'PENDING',

  attempts integer not null default 0,

  last_error text,

  last_attempt_at timestamptz,
  synced_at timestamptz,

  created_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 36. `audit_logs`

``` sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),

  actor_type text not null,
  actor_id uuid,

  action text not null,

  entity_type text not null,
  entity_id uuid,

  metadata jsonb,

  created_at timestamptz not null default now()
);
```

Examples:

``` text
REGISTRATION_CREATED
PAYMENT_ORDER_CREATED
PAYMENT_SIGNATURE_VERIFIED
PAYMENT_CAPTURED
REGISTRATION_CONFIRMED
DELEGATE_CREATED
ADMIN_VIEWED_REGISTRATION
ADMIN_UPDATED_REGISTRATION
SHEET_SYNCED
SHEET_SYNC_FAILED
```

------------------------------------------------------------------------

# 37. Admin Users / Roles

If Supabase Auth is used for administrators, role information should be
kept in an application-level role table rather than trusting a
frontend-provided role.

Example:

``` sql
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),

  auth_user_id uuid not null unique,

  role text not null,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

# 38. Uniqueness Rules

### Mobile

``` text
UNIQUE
```

### Email

``` text
UNIQUE
```

But normalization must occur before uniqueness comparison.

Recommended:

``` text
email = lowercase(trim(email))
```

Phone:

``` text
digits only
canonical Indian number
```

The database should enforce uniqueness so that concurrent requests
cannot bypass application-level checks.

------------------------------------------------------------------------

# 39. Validation Rules

Validation occurs in two places:

``` text
Client
+
Server
```

Client validation is for UX.

Server validation is authoritative.

Never rely only on React/browser validation.

------------------------------------------------------------------------

## Mobile validation

``` text
Exactly 10 digits
Indian mobile format
Unique
```

------------------------------------------------------------------------

## Email validation

``` text
Valid syntax
Lowercase normalized
Unique
```

------------------------------------------------------------------------

## PIN validation

``` text
6 digits
```

------------------------------------------------------------------------

## Date of birth

``` text
Valid date
Not future
Age calculated server-side
Eligibility checked server-side
```

------------------------------------------------------------------------

## Photo

``` text
Image
Maximum 1 MB
Allowed MIME types
```

Dimensions:

``` text
NOT ENFORCED
```

------------------------------------------------------------------------

# 40. Database Constraints vs Application Validation

Use both.

Example:

``` text
Application:
"Email already registered"

Database:
UNIQUE(email)
```

Why?

Two users could submit the same email at almost exactly the same time.

Only a database constraint reliably closes that race condition.

------------------------------------------------------------------------

# 41. Transaction Boundaries

### Registration creation

One transaction:

``` text
Validate
+
create registration
+
create payment order record
```

If Razorpay order creation fails, the registration can remain in a
controlled pending state or be rolled back depending on the exact
implementation.

### Payment confirmation

One database transaction:

``` text
payment update
+
registration confirmation
+
delegate creation/activation
+
audit log
```

Google Sheets must not be part of this database transaction.

------------------------------------------------------------------------

# 42. API Route Inventory

Recommended Next.js API routes:

``` text
POST /api/registrations
POST /api/registrations/check-availability
POST /api/uploads/photo
POST /api/payments/create-order
POST /api/payments/verify
POST /api/webhooks/razorpay

POST /api/delegate/login
GET  /api/delegate/me

GET  /api/admin/dashboard
GET  /api/admin/registrations
GET  /api/admin/registrations/:id
GET  /api/admin/payments
GET  /api/admin/audit-logs

POST /api/admin/sheets/sync
```

Actual naming can be adjusted to the final Next.js App Router structure.

------------------------------------------------------------------------

# 43. API Security

Every server endpoint must explicitly decide:

``` text
Public
Authenticated delegate
Authenticated admin
Webhook provider
```

Example:

  Endpoint                  Access
  ------------------------- -------------------------------
  Registration create       Public
  Payment create            Public but registration-bound
  Payment verify            Public but registration-bound
  Razorpay webhook          Razorpay + signature
  Delegate dashboard        Authenticated delegate
  Admin dashboard           Admin
  Admin registration view   Admin
  Sheets sync               Server/admin
  Audit logs                Admin

------------------------------------------------------------------------

# 44. Prevent Registration Tampering

Never allow the browser to submit:

``` text
registration_fee = 1
payment_status = PAID
registration_status = CONFIRMED
```

These fields must be controlled server-side.

The frontend sends participant data.

The server determines:

``` text
fee
order amount
payment state
registration state
registration number
delegate state
```

------------------------------------------------------------------------

# 45. Razorpay Amount Verification

When confirming payment:

``` text
expected_amount = event_settings.registration_fee

provider_amount = Razorpay payment amount
```

Require:

``` text
provider_amount === expected_amount
```

Also verify:

``` text
currency === expected currency
order_id === stored order id
payment belongs to expected order
```

Never trust the amount returned by the browser as the final amount.

------------------------------------------------------------------------

# 46. Webhook Event Handling

The exact event subscription list should be configured in Razorpay
Dashboard after confirming the live integration.

At minimum, design handlers around payment lifecycle events required by
the final business rules.

Possible conceptual events:

``` text
payment.authorized
payment.captured
payment.failed
payment.refunded
```

The handler must be prepared for:

-   Duplicate events
-   Delayed events
-   Out-of-order events
-   Already-processed events
-   Unknown events
-   Invalid signatures

Unknown but valid events should normally be acknowledged and logged
rather than causing repeated retries forever.

------------------------------------------------------------------------

# 47. Browser Payment Flow

``` text
1. User completes form.

2. Client sends registration data to server.

3. Server validates.

4. Server creates registration.

5. Server reads fee from event_settings.

6. Server creates Razorpay order.

7. Server stores order ID.

8. Server returns public Razorpay key + order ID.

9. Browser opens Razorpay Checkout.

10. User pays.

11. Checkout returns identifiers.

12. Browser sends identifiers to server.

13. Server verifies signature.

14. Server fetches/checks payment.

15. If captured:
       confirm registration.

16. Webhook independently confirms/synchronizes state.

17. User is redirected to confirmation/dashboard.
```

------------------------------------------------------------------------

# 48. Failure Scenarios

## Payment failed

``` text
Registration remains PAYMENT_PENDING or becomes PAYMENT_FAILED
```

User may retry payment.

A new payment attempt must be safely associated with the same
registration or a controlled new order strategy.

Do not create uncontrolled duplicate registrations.

------------------------------------------------------------------------

## Payment succeeds but browser closes

Webhook detects payment.

``` text
Razorpay
   |
   v
Webhook
   |
   v
Payment confirmed
   |
   v
Registration CONFIRMED
```

When the user later logs in, they see the confirmed registration.

------------------------------------------------------------------------

## Webhook arrives before browser verification

Webhook can confirm the registration.

Later browser verification sees the registration already confirmed and
returns the existing confirmed state.

This is why idempotency is essential.

------------------------------------------------------------------------

## Browser verification succeeds before webhook

Server confirms registration.

Webhook arrives later.

Webhook sees the payment already processed and performs no duplicate
side effect.

------------------------------------------------------------------------

## Google Sheets unavailable

Registration remains confirmed.

Sync job becomes:

``` text
RETRY_PENDING
```

------------------------------------------------------------------------

## Photo upload succeeds but payment fails

Photo remains associated with a pending registration/draft.

Cleanup policy can remove abandoned files after the configured retention
period.

------------------------------------------------------------------------

# 49. Delegate Authentication Security

Because login uses:

``` text
Registration Number + Mobile Number
```

this is a low-friction credential pair, but it must be protected against
brute-force attempts.

Implement:

-   Rate limiting
-   Attempt throttling
-   Generic login errors
-   Secure session cookies
-   Session expiration
-   Logout
-   Audit logging
-   No public enumeration endpoint

If the event later requires stronger security, OTP can be added without
changing the core registration database model.

------------------------------------------------------------------------

# 50. Data Privacy

The application will contain personal information.

Potentially sensitive data includes:

-   Mobile number
-   Email
-   Address
-   Date of birth
-   Identity proof information
-   Participant photo

Therefore:

-   Use HTTPS.
-   Keep storage private.
-   Restrict admin access.
-   Do not expose participant lists publicly.
-   Do not put sensitive information into QR codes.
-   Avoid unnecessary data duplication.
-   Define data-retention rules.
-   Define who can access identity documents.
-   Log sensitive administrative actions.

------------------------------------------------------------------------

# 51. Identity Proof Recommendation

The source form includes identity proof type, ID number, and an
identity-proof upload area.

Before production, the organizer should explicitly decide:

``` text
Is identity proof mandatory?
Which documents are accepted?
Should the full document be stored?
Who can view it?
How long should it be retained?
Should the document be deleted after verification?
```

Do not silently retain identity documents indefinitely.

------------------------------------------------------------------------

# 52. Responsive Design Requirements

The entire application must be mobile-first and responsive.

Target widths:

``` text
320px
360px
375px
390px
414px
430px
480px
640px
768px
1024px
1280px
1440px+
```

Required testing:

-   Android Chrome
-   iPhone Safari
-   Desktop Chrome
-   Desktop Edge
-   Desktop Firefox
-   Tablet layouts

------------------------------------------------------------------------

# 53. UI Structure

## Public landing page

Based on the supplied visual reference:

``` text
Header
Hero/Event information
Registration CTA
Delegate Login CTA
Admin Login CTA
Event highlights
Eligibility
Rounds
Prize information
Important instructions
Contact
Footer
```

The design should preserve the event's cultural/tribal visual identity
while using a modern, accessible component system.

------------------------------------------------------------------------

# 54. Registration UI

Recommended multi-step form:

``` text
STEP 1
Participant Details

STEP 2
Identification & Contact

STEP 3
Competition Details

STEP 4
Photo Upload

STEP 5
Review & Declaration

STEP 6
Payment

STEP 7
Confirmation
```

The exact number of UI steps can change without changing the database
model.

------------------------------------------------------------------------

# 55. Review Screen

Before payment:

``` text
Registration Summary

Participant
Contact
Address
Competition category
Age category
Attire
Photo

Registration Fee: ₹500

[ ] I confirm that the information provided is correct.
[ ] I agree to the Terms & Conditions.
[ ] I agree to the Privacy Policy.

[ Proceed to Payment ]
```

Checkbox state must be recorded with timestamp and policy version.

------------------------------------------------------------------------

# 56. Confirmation Page

Example:

``` text
Registration Successful

Congratulations!

Registration Number
TH26-000123

Payment
₹500 — PAID

[ View Delegate Dashboard ]
[ Download Registration Pass ]
```

Do not display the complete participant record publicly on the success
URL.

------------------------------------------------------------------------

# 57. Registration Pass

Optional but recommended:

``` text
Event logo/name
Participant name
Registration number
Participant photograph
Category
Event date
Venue
QR code
Payment status
```

The QR should contain only a non-sensitive identifier or secure token.

------------------------------------------------------------------------

# 58. QR Design

Example:

``` text
QR
 |
 v
TH26-000123
```

or preferably a random check token:

``` text
secure_random_token
```

The check-in system will be designed later.

------------------------------------------------------------------------

# 59. Google Sheets Security

Use a dedicated Google Cloud project/service identity or approved OAuth
approach.

Do not expose Google credentials to the browser.

The spreadsheet should be shared only with required organizer accounts.

Do not use a public spreadsheet for participant information.

------------------------------------------------------------------------

# 60. Environment Variables

Example:

``` env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Google
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=

# Application
NEXT_PUBLIC_APP_URL=
```

Rules:

-   Public variables may be exposed to the browser.
-   Secrets must never use `NEXT_PUBLIC_`.
-   Never commit `.env` files.
-   Never expose the Supabase service-role key client-side.
-   Never expose Razorpay secret.
-   Never expose Google private credentials.

------------------------------------------------------------------------

# 61. Supabase RLS

RLS must be enabled for application tables exposed through the Supabase
API.

Conceptually:

``` text
Public user
   |
   +--> Can create only permitted registration data
   |
   +--> Cannot read all registrations

Delegate
   |
   +--> Can read only own registration

Admin
   |
   +--> Can read/manage authorized records

Service role
   |
   +--> Server-only privileged operations
```

Do not rely on frontend route protection alone.

------------------------------------------------------------------------

# 62. Storage RLS

Participant photos should use a private bucket.

Rules should ensure:

``` text
Delegate -> own photo only
Admin -> authorized participant photos
Public -> no direct bucket listing/access
```

Use signed URLs for authorized viewing.

------------------------------------------------------------------------

# 63. Logging

Log application events, not secrets.

Good:

``` text
registration_id
registration_number
request_id
event
status
timestamp
```

Never log:

``` text
Razorpay secret
Supabase service role key
Google private key
full identity document contents
authentication credentials
```

------------------------------------------------------------------------

# 64. Request IDs

Every important request should have a request/correlation ID.

Example:

``` text
REQ-8a2f...
```

This allows:

``` text
Browser
  |
  v
Next.js
  |
  v
Razorpay
  |
  v
Database
```

to be correlated during debugging.

------------------------------------------------------------------------

# 65. Error Handling

User-facing errors should be understandable.

Example:

``` text
Something went wrong while creating your registration.
Please try again.

Reference:
REQ-8A2F...
```

Technical logs contain the detailed error.

Do not expose stack traces.

------------------------------------------------------------------------

# 66. Rate Limiting

Public endpoints should have rate limits, especially:

``` text
/api/registrations
/api/payments/create-order
/api/payments/verify
/delegate/login
```

The exact rate limits should be tuned during testing.

Webhook endpoint should use provider signature verification and may also
use infrastructure/network protections where practical.

------------------------------------------------------------------------

# 67. No Capacity Limit

The system must not have:

``` text
max_registrations = 600
```

or any hard registration-count stop.

The application should continue accepting registrations while
registration is open.

Capacity can still be represented as an optional future event-setting
feature without being enforced now.

------------------------------------------------------------------------

# 68. Registration Open/Close

Even without a capacity limit, registration should have an explicit
state:

``` text
registration_open_at
registration_close_at
```

Server-side registration creation must reject registrations outside the
configured registration window.

The frontend should reflect the same status.

------------------------------------------------------------------------

# 69. Time Handling

Store timestamps as:

``` text
timestamptz
```

Use a consistent server/database timezone strategy.

Display event-local time to users.

Do not calculate payment/registration validity using browser-local time
alone.

------------------------------------------------------------------------

# 70. Database Indexes

Recommended indexes:

``` text
registrations(registration_number)
registrations(mobile_number)
registrations(email)
registrations(registration_status)
registrations(created_at)
registrations(category)

payments(razorpay_order_id)
payments(razorpay_payment_id)
payments(registration_id)
payments(status)

webhook_events(provider, event_id)

sheet_sync_jobs(status)
```

Unique indexes should be created where required.

------------------------------------------------------------------------

# 71. Search Strategy

Admin search should not load all registrations into the browser.

Use server-side pagination:

``` text
page
page_size
search
filters
sort
```

Example:

``` text
GET /api/admin/registrations?page=1&pageSize=25&search=TH26
```

------------------------------------------------------------------------

# 72. Pagination

Default:

``` text
25–50 records/page
```

Admin should have:

``` text
25
50
100
```

options if needed.

Never render hundreds of participant records into a single initial
browser response.

------------------------------------------------------------------------

# 73. Audit Trail

Important actions should create audit records.

Examples:

``` text
REGISTRATION_CREATED
REGISTRATION_CONFIRMED
PAYMENT_VERIFIED
DELEGATE_CREATED
ADMIN_LOGIN
ADMIN_VIEWED_IDENTITY_DOCUMENT
ADMIN_UPDATED_REGISTRATION
SHEET_SYNC_FAILED
```

------------------------------------------------------------------------

# 74. Backup Strategy

At minimum:

``` text
PostgreSQL
   |
   +--> Supabase backups/available backup mechanisms
   |
   +--> Periodic CSV/Google Sheets operational export
```

Important:

Google Sheets is not a substitute for database backups.

------------------------------------------------------------------------

# 75. Deployment Environments

Use:

``` text
Development
Preview/Staging
Production
```

At minimum:

``` text
local development
Vercel preview
Vercel production
```

Razorpay test mode must be used during development.

Do not test live payments during ordinary development.

------------------------------------------------------------------------

# 76. Razorpay Test/Production Separation

Development:

``` text
TEST API KEY
TEST SECRET
TEST WEBHOOK
```

Production:

``` text
LIVE API KEY
LIVE SECRET
LIVE WEBHOOK
```

Never mix them.

------------------------------------------------------------------------

# 77. Production Go-Live Checklist

## Application

-   [ ] Production domain configured
-   [ ] HTTPS verified
-   [ ] Environment variables configured
-   [ ] Supabase production project configured
-   [ ] Storage bucket configured
-   [ ] RLS tested
-   [ ] Admin accounts created

## Razorpay

-   [ ] Live API credentials
-   [ ] Live webhook URL
-   [ ] Live webhook secret
-   [ ] Required webhook events configured
-   [ ] Auto-capture configuration verified
-   [ ] Test payment completed in test mode
-   [ ] Production payment reconciliation tested

## Google

-   [ ] Google Cloud project
-   [ ] Sheets API enabled
-   [ ] Spreadsheet created
-   [ ] Server credentials configured
-   [ ] Required sharing permissions configured
-   [ ] Sheet sync tested

## Registration

-   [ ] Validation tested
-   [ ] Duplicate mobile tested
-   [ ] Duplicate email tested
-   [ ] Photo 1 MB boundary tested
-   [ ] Invalid MIME tested
-   [ ] Payment failure tested
-   [ ] Payment success tested
-   [ ] Browser close after payment tested
-   [ ] Webhook retry tested
-   [ ] Duplicate webhook tested
-   [ ] Sheet outage tested

------------------------------------------------------------------------

# 78. Test Matrix

## Registration

``` text
Valid registration
Invalid email
Duplicate email
Invalid mobile
Duplicate mobile
Invalid PIN
Future DOB
Invalid category
Missing required field
Oversized photo
Unsupported photo type
```

## Payment

``` text
Successful payment
Failed payment
Cancelled checkout
Network failure
Browser closed after payment
Webhook before browser verification
Browser verification before webhook
Duplicate webhook
Invalid webhook signature
Wrong order ID
Wrong amount
Wrong currency
Already captured payment
Refunded payment
```

## Delegate

``` text
Valid credentials
Invalid credentials
Unconfirmed registration
Expired session
Logout
Cross-user access attempt
```

## Admin

``` text
Admin login
Non-admin access attempt
Search
Filter
Pagination
View photo
View identity document
Audit trail
```

------------------------------------------------------------------------

# 79. Exact Feature Scope --- Phase 1

## Public

-   [x] Event landing page
-   [x] Responsive design
-   [x] Event information
-   [x] Registration CTA
-   [x] Delegate login
-   [x] Admin login
-   [x] Terms & Privacy links
-   [x] Contact information

## Registration

-   [x] Multi-step form
-   [x] Participant data
-   [x] Identification data
-   [x] Address
-   [x] Contact information
-   [x] Competition category
-   [x] Age category
-   [x] Attire details
-   [x] Optional talent/introduction
-   [x] Photo upload
-   [x] 1 MB photo limit
-   [x] Dimension guidance without enforcement
-   [x] Client validation
-   [x] Server validation
-   [x] Unique mobile
-   [x] Unique email
-   [x] Review page
-   [x] Declaration/consent

## Payment

-   [x] Fixed fee
-   [x] Server-side order creation
-   [x] Razorpay Checkout
-   [x] Signature verification
-   [x] Payment status verification
-   [x] Webhooks
-   [x] Idempotency
-   [x] Payment reconciliation
-   [x] Registration confirmation after payment

## Delegate

-   [x] Automatic delegate activation after confirmation
-   [x] Login with Registration Number + Mobile
-   [x] Dashboard
-   [x] Registration details
-   [x] Payment status
-   [x] Registration number
-   [x] Photo
-   [x] Registration pass/QR

## Admin

-   [x] Dashboard
-   [x] Registration search
-   [x] Registration filters
-   [x] Registration details
-   [x] Payment details
-   [x] Photo viewing
-   [x] Audit log
-   [x] Google Sheets synchronization

## Storage

-   [x] Supabase Storage
-   [x] Private participant-photo bucket
-   [x] 1 MB upload limit
-   [x] Secure object paths
-   [x] Signed URLs
-   [x] Draft/orphan cleanup strategy

## Explicitly Deferred

-   [ ] Event check-in system
-   [ ] QR scanning workflow
-   [ ] On-site attendance tracking
-   [ ] Refund workflow
-   [ ] WhatsApp messaging
-   [ ] SMS OTP
-   [ ] Advanced analytics
-   [ ] Multi-event organization management

------------------------------------------------------------------------

# 80. Recommended Folder Structure

``` text
app/
├── page.tsx
├── layout.tsx
├── globals.css
│
├── register/
│   ├── page.tsx
│   ├── success/page.tsx
│   └── failed/page.tsx
│
├── delegate/
│   ├── login/page.tsx
│   └── dashboard/page.tsx
│
├── admin/
│   ├── login/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── registrations/page.tsx
│       ├── payments/page.tsx
│       ├── settings/page.tsx
│       └── audit-logs/page.tsx
│
└── api/
    ├── registrations/
    ├── uploads/
    ├── payments/
    ├── webhooks/
    │   └── razorpay/
    ├── delegate/
    └── admin/

components/
├── ui/
├── registration/
├── payment/
├── delegate/
├── admin/
└── shared/

lib/
├── supabase/
├── razorpay/
├── google/
├── storage/
├── auth/
├── validation/
├── registration/
├── payments/
├── sheets/
├── qr/
└── utils/

types/
schemas/
constants/
emails/
public/
```

------------------------------------------------------------------------

# 81. Service-Layer Architecture

Avoid putting all business logic directly inside route handlers.

Recommended:

``` text
Route Handler
     |
     v
Validation
     |
     v
Service
     |
     +--> Repository / Database
     +--> Razorpay
     +--> Storage
     +--> Google Sheets
     +--> Audit
```

Example:

``` text
createRegistration()
createPaymentOrder()
verifyPayment()
processRazorpayWebhook()
confirmRegistration()
activateDelegate()
syncRegistrationToSheet()
```

This keeps the system modular and testable.

------------------------------------------------------------------------

# 82. Important Business Invariants

These rules must always remain true.

### Invariant 1

``` text
CONFIRMED registration
=> valid confirmed/captured payment
```

### Invariant 2

``` text
Every confirmed registration
=> unique registration number
```

### Invariant 3

``` text
Every confirmed registration
=> active delegate
```

### Invariant 4

``` text
Every Razorpay payment ID
=> at most one local payment record
```

### Invariant 5

``` text
Every Razorpay webhook event
=> processed at most once
```

### Invariant 6

``` text
Every mobile number
=> at most one active registration
```

### Invariant 7

``` text
Every email
=> at most one active registration
```

If organizer later needs re-registration after cancellation, the
uniqueness policy can be changed explicitly.

------------------------------------------------------------------------

# 83. Important Decision: Unique Mobile/Email

Current frozen requirement:

``` text
Mobile = unique
Email = unique
```

Recommended database policy:

``` text
UNIQUE(mobile_number)
UNIQUE(email)
```

If future business rules allow a family to share an email/phone, the
schema must be deliberately changed.

Do not weaken uniqueness merely at the UI level.

------------------------------------------------------------------------

# 84. Important Decision: Payment Retry

A participant may fail payment.

They should not be forced to create a second registration.

Preferred:

``` text
Existing registration
       |
       v
PAYMENT_PENDING
       |
       v
Retry payment
       |
       v
New/controlled Razorpay order attempt
       |
       v
Same registration
```

The payment table should support multiple payment attempts if the final
implementation chooses this model.

For a robust implementation, introduce a separate:

``` text
payment_attempts
```

table if multiple attempts need to be retained.

------------------------------------------------------------------------

# 85. Recommended Payment Attempt Model

If multiple payment attempts are expected, use:

``` text
registrations
      |
      +---- payment_attempts
                |
                +---- order 1 -> failed
                |
                +---- order 2 -> captured
```

Then the application can maintain:

``` text
active/successful payment
```

without deleting historical attempts.

This is preferable for auditability.

------------------------------------------------------------------------

# 86. Suggested `payment_attempts` Table

``` sql
create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),

  registration_id uuid not null
    references public.registrations(id),

  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,

  amount integer not null,
  currency text not null,

  status text not null,

  signature_verified boolean not null default false,

  failure_code text,
  failure_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  captured_at timestamptz
);
```

This is the recommended production design if retry payments are
supported.

------------------------------------------------------------------------

# 87. Final Recommended Database Relationship

``` text
event_settings
      |
      |
registrations
      |
      +----------------+
      |                |
      v                v
payment_attempts    delegates
      |
      v
Razorpay

registrations
      |
      v
sheet_sync_jobs

registrations
      |
      v
audit_logs

webhook_events
```

------------------------------------------------------------------------

# 88. Final Registration Lifecycle

``` text
                    START
                      |
                      v
              Fill registration
                      |
                      v
              Client validation
                      |
                      v
              Server validation
                      |
                +-----+-----+
                |           |
              FAIL        PASS
                |           |
                v           v
              Error      Create DRAFT
                            |
                            v
                    Validate eligibility
                            |
                            v
                  Create payment order
                            |
                            v
                     PAYMENT_PENDING
                            |
                       Razorpay
                      /         \
                 FAILED        SUCCESS
                   |              |
                   v              v
             PAYMENT_FAILED   Verify signature
                                  |
                                  v
                           Verify provider state
                                  |
                           +------+------+
                           |             |
                         FAIL          CAPTURED
                           |             |
                           v             v
                       Pending       CONFIRMED
                                         |
                              +----------+----------+
                              |                     |
                              v                     v
                        Create Delegate        Sheet Sync
                              |                     |
                              v                     v
                         Dashboard              SYNCED
```

------------------------------------------------------------------------

# 89. Final Webhook Lifecycle

``` text
Razorpay
   |
   v
Webhook endpoint
   |
   v
Verify HMAC signature
   |
   +---- invalid ---> reject/log
   |
   v
Read event ID
   |
   v
Check webhook_events
   |
   +---- duplicate ---> acknowledge safely
   |
   v
Store event
   |
   v
Process payment state
   |
   v
Lock payment/registration
   |
   v
Apply valid state transition
   |
   v
Confirm registration if payment is captured
   |
   v
Activate delegate
   |
   v
Create Sheets sync job
   |
   v
Audit log
   |
   v
Acknowledge
```

------------------------------------------------------------------------

# 90. What We Are Freezing Now

The following are considered frozen for implementation:

``` text
Framework:
Next.js + TypeScript

Hosting:
Vercel

Database:
Supabase PostgreSQL

Storage:
Supabase Storage

Reporting:
Google Sheets

Payment:
Razorpay

Registration fee:
Fixed amount, configured server-side
Current event reference: ₹500

Capacity:
No hard registration limit

Photo:
Maximum 1 MB
Dimensions displayed as guidance only
No dimension enforcement

Delegate login:
Registration Number + Mobile Number

Delegate:
Created/activated after successful verified payment

Validation:
Client + server + database constraints

Unique:
Mobile + Email

Payment:
Server-created Razorpay Order

Payment verification:
Server-side signature + provider status verification

Webhook:
Mandatory production architecture
Signature validation
Idempotency
Retry-safe processing
Out-of-order-safe state transitions

Primary database:
PostgreSQL

Google Sheets:
Secondary mirror only

Check-in:
Deferred
```

------------------------------------------------------------------------

# 91. Items Requiring Organizer Confirmation Before Coding

These should be answered before the final production schema migration:

### A. Eligibility

The supplied form and poster contain different age information.

Confirm:

``` text
Minimum age:
Maximum age:
Age category definitions:
```

### B. Required fields

Confirm whether these are mandatory:

``` text
Tribal Community
Identity Proof
WhatsApp
Education
Occupation
Instagram
Attire Name
Attire Representation
Attire Description
```

### C. Identity documents

Confirm:

``` text
Required?
Accepted types?
Storage required?
Who can view?
Retention period?
```

### D. Email

Current technical requirement:

``` text
Unique email
```

Confirm that participants without email should not be allowed to
register.

### E. Photo

Confirm allowed types:

``` text
JPEG
PNG
WebP
```

### F. Payment retry

Confirm whether failed payments should:

``` text
Reuse the same registration
+
Create another payment attempt
```

This is the recommended approach.

### G. Refund policy

Not part of the initial frozen feature set.

### H. Registration closing

Confirm:

``` text
Opening date/time
Closing date/time
```

### I. Terms & Privacy

Final legal text and versions must be supplied by the organizer.

------------------------------------------------------------------------

# 92. Official Technical References

The implementation should follow the current official documentation of
the selected providers.

-   Next.js documentation: https://nextjs.org/docs
-   Razorpay payment integration: https://razorpay.com/docs/
-   Razorpay security checklist: https://razorpay.com/security/checklist
-   Supabase database/RLS documentation:
    https://supabase.com/docs/guides/database/postgres/row-level-security
-   Supabase Storage documentation:
    https://supabase.com/docs/guides/storage
-   Google Sheets API documentation:
    https://developers.google.com/workspace/sheets/api
-   Vercel documentation: https://vercel.com/docs

------------------------------------------------------------------------

# 93. Architecture Principle

The application should be built around one central rule:

> **The browser is not trusted. The database is authoritative. Razorpay
> verifies payment. Webhooks provide reliable asynchronous payment
> events. Google Sheets mirrors application data.**

This principle should guide every implementation decision.

------------------------------------------------------------------------

# 94. Final Target Architecture

``` text
                    +----------------------+
                    |      PARTICIPANT     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |       NEXT.JS        |
                    |      VERCEL          |
                    +----------+-----------+
                               |
          +--------------------+--------------------+
          |                    |                    |
          v                    v                    v
     Registration          Razorpay             Supabase
       Service             Service              Services
          |                    |                    |
          |                    |                    +---- PostgreSQL
          |                    |                    |
          |                    |                    +---- Storage
          |                    |
          |                    +---- Checkout
          |                    |
          |                    +---- Orders API
          |                    |
          |                    +---- Webhooks
          |
          v
     PostgreSQL
          |
          +---- Registration
          +---- Payment Attempts
          +---- Delegate
          +---- Audit
          +---- Webhook Events
          +---- Sheet Sync Jobs
          |
          v
     Google Sheets
```

This is the architecture baseline to use for implementation.

**Implementation should begin only after the organizer decisions in
Section 91 are confirmed.**
