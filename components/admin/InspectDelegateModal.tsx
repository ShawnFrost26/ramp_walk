"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Upload,
  Camera,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  COMPETITION_CATEGORIES,
  AGE_CATEGORIES,
  IDENTITY_PROOF_TYPES,
  PROMINENT_TRIBES,
  EVENT_DETAILS,
} from "@/lib/constants/event";

interface InspectDelegateModalProps {
  record: any;
  onClose: () => void;
  onRecordUpdated: (updatedRecord: any) => void;
}

export function InspectDelegateModal({
  record,
  onClose,
  onRecordUpdated,
}: InspectDelegateModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inspectData, setInspectData] = useState<any>(record);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Reliable photo URL - defaults to internal photo proxy endpoint
  const [photoUrl, setPhotoUrl] = useState<string>(
    record.id ? `/api/admin/registrations/${record.id}/photo` : ""
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Edit form state
  const [formData, setFormData] = useState<any>({ ...record });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Photo rendering state
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy helper
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Fetch full details (including latest payment record and fresh signed photo URL)
  useEffect(() => {
    let isMounted = true;
    const fetchDeepDetails = async () => {
      try {
        setIsLoadingDetails(true);
        const res = await fetch(`/api/admin/registrations/${record.id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.registration) {
              setInspectData(data.registration);
              setFormData({ ...data.registration });
            }
            if (data.payment) {
              setPaymentData(data.payment);
            }
            if (data.photo_url) {
              setPhotoUrl(data.photo_url);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load detailed delegate view:", err);
      } finally {
        if (isMounted) setIsLoadingDetails(false);
      }
    };

    fetchDeepDetails();
    return () => {
      isMounted = false;
    };
  }, [record.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Admin Photo Upload / Replacement handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > EVENT_DETAILS.maxPhotoSizeBytes) {
      setSaveError(`File size exceeds 5 MB. Please select a photo under 5 MB.`);
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setSaveError(null);

      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/uploads/photo", {
        method: "POST",
        body: uploadData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Photo upload failed");

      const newPath = json.storagePath;
      const preview = json.publicUrl || URL.createObjectURL(file);

      handleInputChange("photo_storage_path", newPath);
      setPhotoUrl(preview);
      setImgError(false);
      setImgLoaded(true);
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Failed to upload new photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(`/api/admin/registrations/${inspectData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update delegate record");
      }

      setInspectData(data.registration);
      setFormData({ ...data.registration });
      setSaveSuccess("Delegate details updated and synchronized across all tables and Google Sheets!");
      setIsEditMode(false);
      onRecordUpdated(data.registration);

      // Trigger background Google Sheet Sync so remote sheets are updated immediately
      fetch("/api/admin/sheets/sync", { method: "POST" }).catch((err) =>
        console.warn("Background sheet sync trigger:", err)
      );

      // Auto-clear success notification after 5s
      setTimeout(() => setSaveSuccess(null), 5000);
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveError(err.message || "Failed to save delegate changes");
    } finally {
      setIsSaving(false);
    }
  };

  const isConfirmed = inspectData.registration_status === "CONFIRMED";
  const displayPhoto = photoUrl || `/api/admin/registrations/${inspectData.id}/photo`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#A26715] border border-amber-200 font-bold shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#900C22] uppercase tracking-wider">
                  {inspectData.registration_number || "PENDING REGISTRATION"}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isConfirmed
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {inspectData.registration_status}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {inspectData.full_name}
              </h2>
            </div>
          </div>

          {/* UPPER RIGHT CORNER: EDIT BUTTON & CLOSE */}
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...inspectData });
                  setIsEditMode(true);
                  setSaveError(null);
                  setSaveSuccess(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
                title="Edit Delegate Information"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Information</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Cancel</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span className="font-semibold">{saveError}</span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ═════════════════════════════════════════════════════════ */}
          {/* EDIT MODE FORM (ADMIN EDIT & SYNC)                      */}
          {/* ═════════════════════════════════════════════════════════ */}
          {isEditMode ? (
            <form onSubmit={handleSave} className="space-y-6 text-xs">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Edit3 className="h-4 w-4 text-[#900C22]" />
                  <span>Admin Edit Mode: Modify information below. Saved changes will sync across all tables & Google Sheets.</span>
                </div>
                <span className="text-[11px] text-amber-800 font-medium">Logged in Audit Trail</span>
              </div>

              {/* Photo Upload & Replacement in Edit Mode */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-[#900C22] bg-white shadow-md shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayPhoto}
                    alt={formData.full_name || "Delegate"}
                    className="w-full h-full object-cover"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white text-[10px] gap-1">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Participant Photograph</h4>
                  <p className="text-slate-500 text-xs">
                    You can replace or update the delegate photo. Accepted: JPG, PNG, WebP (Max 5 MB).
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-all shadow-sm cursor-pointer"
                  >
                    <Camera className="h-4 w-4 text-[#900C22]" />
                    <span>{isUploadingPhoto ? "Uploading Photo..." : "Select New Photo from Device"}</span>
                  </button>
                </div>
              </div>

              {/* Status & Registration Number Controls */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#900C22]" />
                  <span>Administrative Status & Reg Number</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registration Status</label>
                    <select
                      value={formData.registration_status || "PAYMENT_PENDING"}
                      onChange={(e) => handleInputChange("registration_status", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#900C22]"
                    >
                      <option value="CONFIRMED">CONFIRMED (Paid Delegate)</option>
                      <option value="PAYMENT_PENDING">PAYMENT_PENDING (Awaiting Fee)</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={formData.registration_number || ""}
                      placeholder="e.g. TH2026-1001"
                      onChange={(e) => handleInputChange("registration_number", e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#900C22]"
                    />
                  </div>
                </div>
              </div>

              {/* Bio-Data Fields */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-[#900C22]" />
                  <span>Participant Bio-Data</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name || ""}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      required
                      value={formData.guardian_name || ""}
                      onChange={(e) => handleInputChange("guardian_name", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={formData.date_of_birth ? formData.date_of_birth.split("T")[0] : ""}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender || "MALE"}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tribal Community</label>
                    <input
                      type="text"
                      value={formData.tribal_community || ""}
                      list="tribes-list"
                      onChange={(e) => handleInputChange("tribal_community", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                    <datalist id="tribes-list">
                      {PROMINENT_TRIBES.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Identity Proof Type</label>
                    <select
                      value={formData.identity_proof_type || ""}
                      onChange={(e) => handleInputChange("identity_proof_type", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    >
                      <option value="">Select ID Type</option>
                      {IDENTITY_PROOF_TYPES.map((idType) => (
                        <option key={idType} value={idType}>{idType}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ID Proof Number</label>
                    <input
                      type="text"
                      value={formData.identity_proof_number || ""}
                      onChange={(e) => handleInputChange("identity_proof_number", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Education</label>
                    <input
                      type="text"
                      value={formData.educational_qualification || ""}
                      onChange={(e) => handleInputChange("educational_qualification", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation || ""}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Address Fields */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#900C22]" />
                  <span>Contact & Address Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile_number || ""}
                      onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={formData.whatsapp_number || ""}
                      onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      placeholder="username"
                      value={formData.instagram_handle || ""}
                      onChange={(e) => handleInputChange("instagram_handle", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City / Village</label>
                    <input
                      type="text"
                      required
                      value={formData.city_or_village || ""}
                      onChange={(e) => handleInputChange("city_or_village", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      required
                      value={formData.district || ""}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode || ""}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Full Residential Address</label>
                    <textarea
                      rows={2}
                      value={formData.full_address || ""}
                      onChange={(e) => handleInputChange("full_address", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>
                </div>
              </div>

              {/* Competition & Attire Fields */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#900C22]" />
                  <span>Competition & Cultural Presentation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#900C22]"
                    >
                      {COMPETITION_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age Category</label>
                    <select
                      value={formData.age_category || ""}
                      onChange={(e) => handleInputChange("age_category", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    >
                      {AGE_CATEGORIES.map((ac) => (
                        <option key={ac.id} value={ac.label}>{ac.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attire Name</label>
                    <input
                      type="text"
                      value={formData.attire_name || ""}
                      onChange={(e) => handleInputChange("attire_name", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Attire Representation</label>
                    <input
                      type="text"
                      value={formData.attire_representation || ""}
                      onChange={(e) => handleInputChange("attire_representation", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Attire Description</label>
                    <textarea
                      rows={2}
                      value={formData.attire_description || ""}
                      onChange={(e) => handleInputChange("attire_description", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Special Talent / Notes</label>
                    <textarea
                      rows={2}
                      value={formData.special_talent || ""}
                      onChange={(e) => handleInputChange("special_talent", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#900C22]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingPhoto}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-6 py-2.5 text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving & Syncing Everywhere...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save & Sync All Data</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (

            /* ═════════════════════════════════════════════════════════ */
            /* VIEW MODE: COMPREHENSIVE PARTICIPANT RECORD & PAYMENT   */
            /* ═════════════════════════════════════════════════════════ */
            <div className="space-y-6">
              
              {/* TOP HERO PROFILE & PHOTO CARD */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
                
                {/* Delegate Photo Rendered (Guaranteed Display) */}
                <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#900C22] bg-white shadow-md shrink-0">
                  {displayPhoto && !imgError ? (
                    <>
                      {!imgLoaded && (
                        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-slate-400 animate-spin" />
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayPhoto}
                        alt={inspectData.full_name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imgLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
                      <User className="h-10 w-10 text-slate-300 mb-1" />
                      <span className="text-[11px] font-medium text-slate-500">No Photo</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-[#900C22] py-0.5 text-center text-[9px] font-bold text-white uppercase tracking-wider">
                    {inspectData.registration_status}
                  </div>
                </div>

                {/* Primary Overview Meta */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#900C22] uppercase tracking-wider block">
                      {inspectData.category}
                      {inspectData.age_category && ` • ${inspectData.age_category}`}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {inspectData.full_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Parent / Guardian: <strong className="text-slate-700">{inspectData.guardian_name}</strong> • Tribe:{" "}
                      <strong className="text-[#900C22]">{inspectData.tribal_community || "Indigenous"}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3 text-slate-600">
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`tel:${inspectData.mobile_number}`} className="font-semibold text-slate-800 hover:text-[#900C22]">
                        +91 {inspectData.mobile_number}
                      </a>
                      {inspectData.whatsapp_number && (
                        <span className="text-[11px] text-emerald-600 font-medium">(WA: {inspectData.whatsapp_number})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`mailto:${inspectData.email}`} className="text-slate-700 hover:underline truncate max-w-[200px]">
                        {inspectData.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>DOB: <strong>{formatDate(inspectData.date_of_birth)}</strong> ({inspectData.gender})</span>
                    </div>

                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{inspectData.city_or_village}, {inspectData.district}, {inspectData.state}</span>
                    </div>
                  </div>

                  {displayPhoto && (
                    <div className="pt-1 flex justify-center sm:justify-start">
                      <a
                        href={displayPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#900C22] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View / Open Full Resolution Photograph</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* PAYMENT & GATEWAY TRANSACTION CARD */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Payment & Fee Transaction Details</h4>
                      <p className="text-[11px] text-slate-500">Razorpay server verification and settlement</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isConfirmed
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {isConfirmed ? "PAID & CAPTURED" : "PAYMENT PENDING"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Registration Fee</span>
                    <p className="text-base font-black text-emerald-800">
                      {formatCurrency(paymentData?.amount ? paymentData.amount / 100 : EVENT_DETAILS.registrationFee)}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Gateway Payment ID</span>
                    <div className="flex items-center gap-1 font-mono text-slate-800 font-semibold truncate">
                      <span>{paymentData?.razorpay_payment_id || (isConfirmed ? "pay_captured_auto" : "—")}</span>
                      {paymentData?.razorpay_payment_id && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentData.razorpay_payment_id, "payId")}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy Payment ID"
                        >
                          {copiedField === "payId" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Razorpay Order ID</span>
                    <div className="flex items-center gap-1 font-mono text-slate-800 font-semibold truncate">
                      <span>{paymentData?.razorpay_order_id || "—"}</span>
                      {paymentData?.razorpay_order_id && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentData.razorpay_order_id, "orderId")}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy Order ID"
                        >
                          {copiedField === "orderId" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">Payment Timestamp</span>
                    <p className="text-slate-700 font-medium">
                      {formatDate(paymentData?.captured_at || inspectData.confirmed_at || inspectData.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION I & II: BIO-DATA & IDENTIFICATION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4 w-4 text-[#900C22]" />
                  <span>Section I: Participant Bio-Data & Identification</span>
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Full Name:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{inspectData.full_name}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Guardian / Parent:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{inspectData.guardian_name}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Date of Birth & Gender:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {formatDate(inspectData.date_of_birth)} ({inspectData.gender})
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Tribal Community:</span>
                    <p className="font-bold text-[#900C22] mt-0.5">
                      {inspectData.tribal_community || "Not Specified"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Identity Proof Type:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {inspectData.identity_proof_type || "Government ID"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">ID Proof Number:</span>
                    <p className="font-mono font-semibold text-slate-800 mt-0.5">
                      {inspectData.identity_proof_number || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Educational Qualification:</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {inspectData.educational_qualification || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Occupation:</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {inspectData.occupation || "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Instagram Handle:</span>
                    <p className="font-medium text-[#900C22] mt-0.5">
                      {inspectData.instagram_handle ? `@${inspectData.instagram_handle}` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION II: CONTACT & RESIDENTIAL ADDRESS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="h-4 w-4 text-[#900C22]" />
                  <span>Section II: Contact & Full Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Registered Phone:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">+91 {inspectData.mobile_number}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">WhatsApp Number:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {inspectData.whatsapp_number ? `+91 ${inspectData.whatsapp_number}` : "—"}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Registered Email:</span>
                    <p className="font-semibold text-slate-900 mt-0.5 truncate">{inspectData.email}</p>
                  </div>

                  <div className="sm:col-span-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <span className="text-slate-400 font-medium block mb-0.5">Complete Residential Address:</span>
                    <p className="text-slate-800 font-medium">{inspectData.full_address}</p>
                    <p className="text-slate-500 mt-0.5">
                      {inspectData.city_or_village}, {inspectData.district}, {inspectData.state} — PIN:{" "}
                      <strong>{inspectData.pincode}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION III: CULTURAL ATTIRE & COMPETITION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Sparkles className="h-4 w-4 text-[#900C22]" />
                  <span>Section III: Competition & Traditional Attire Presentation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Competition Category:</span>
                    <p className="font-bold text-[#900C22] text-sm mt-0.5">{inspectData.category}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Age Category:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{inspectData.age_category || "General / Youth"}</p>
                  </div>

                  <div className="sm:col-span-2 rounded-xl bg-rose-50/70 border border-rose-200 p-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#900C22] uppercase tracking-wider block">
                      Attire Presentation
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {inspectData.attire_name || "Tribal Attire"} ({inspectData.attire_representation || "Cultural Representation"})
                    </p>
                    {inspectData.attire_description && (
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        &ldquo;{inspectData.attire_description}&rdquo;
                      </p>
                    )}
                    {inspectData.special_talent && (
                      <div className="pt-2 border-t border-rose-200/60 text-xs">
                        <strong className="text-[#900C22]">Special Talent / Intro:</strong> {inspectData.special_talent}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION IV: SYSTEM TIMESTAMPS & CONSENT AUDIT */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">System Timestamps & Compliance:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-500 text-[11px]">
                  <div>Registered: <strong className="text-slate-700">{formatDate(inspectData.created_at)}</strong></div>
                  <div>Confirmed: <strong className="text-slate-700">{inspectData.confirmed_at ? formatDate(inspectData.confirmed_at) : "Pending"}</strong></div>
                  <div>Terms Accepted: <strong className="text-slate-700">{inspectData.terms_accepted_at ? "Yes" : "No"}</strong></div>
                  <div>Privacy Accepted: <strong className="text-slate-700">{inspectData.privacy_accepted_at ? "Yes" : "No"}</strong></div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Participant ID: <span className="font-mono">{inspectData.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...inspectData });
                  setIsEditMode(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#900C22] hover:bg-[#74091A] text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Delegate</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-5 py-2 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
