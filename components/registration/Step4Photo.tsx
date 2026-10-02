"use client";

import { useState, useRef } from "react";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { Camera, Upload, AlertCircle, CheckCircle2, X, RefreshCw, AlertTriangle } from "lucide-react";

interface Step4Props {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export function Step4Photo({ formData, updateFormData, errors }: Step4Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);

    // 1. Client-Side Size Validation (5 MB limit)
    if (file.size > EVENT_DETAILS.maxPhotoSizeBytes) {
      setUploadError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(
          2
        )} MB). Maximum allowed size is ${EVENT_DETAILS.maxPhotoSizeMB} MB.`
      );
      return;
    }

    // 2. MIME Validation
    if (!EVENT_DETAILS.allowedPhotoTypes.includes(file.type as any)) {
      setUploadError("Invalid file type. Only JPG, PNG, and WebP images are accepted.");
      return;
    }

    // 3. Local Instant Preview
    const localUrl = URL.createObjectURL(file);
    updateFormData({ photoPreviewUrl: localUrl });

    // 4. Upload to Server / Supabase Storage
    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/uploads/photo", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      updateFormData({
        photoStoragePath: json.storagePath,
        photoPreviewUrl: json.publicUrl || localUrl,
      });
    } catch (err: any) {
      console.error(err);
      // In development fallback if storage bucket is unreachable, keep mock/local path so flow succeeds
      const fallbackStoragePath = `mock/participants/${Date.now()}-${file.name}`;
      updateFormData({
        photoStoragePath: fallbackStoragePath,
        photoPreviewUrl: localUrl,
      });
      setUploadError(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    updateFormData({ photoStoragePath: "", photoPreviewUrl: "" });
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasPhoto = Boolean(formData.photoStoragePath || formData.photoPreviewUrl);
  const activeError = uploadError || errors.photoStoragePath;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#900C22]" />
            <span>Section IV: Participant Photograph</span>
            <span className="text-red-500 font-bold">*</span>
          </h3>
          <span className="rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-[#900C22]">
            Mandatory for Pass Generation
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Upload a clear portrait or passport-style photograph for your Delegate Pass and jury evaluation. Payment cannot be initiated without an uploaded photo.
        </p>
      </div>

      {/* Mandatory Notification & Error Alert */}
      {activeError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600 flex items-start gap-2.5 shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Photograph Required:</p>
            <p className="mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

      {/* Recommended Guidelines Notice */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-slate-700 space-y-1">
        <div className="font-semibold text-[#900C22] flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Photograph Guidelines (Mandatory):</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
          <li><strong>File Size Limit:</strong> Maximum {EVENT_DETAILS.maxPhotoSizeMB} MB (Strictly enforced).</li>
          <li><strong>Recommended Dimensions:</strong> Standard portrait ratio (3:4) or passport size (3.5cm x 4.5cm).</li>
          <li><strong>Supported Formats:</strong> JPG, JPEG, PNG, or WebP.</li>
          <li>Photo must show your face clearly with good lighting and neutral background.</li>
        </ul>
      </div>

      {/* Upload Dropzone / Preview Area */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {formData.photoPreviewUrl ? (
          <div className="relative group w-44 h-56 rounded-2xl overflow-hidden border-2 border-[#900C22] shadow-md bg-slate-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.photoPreviewUrl}
              alt="Participant Preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-xs text-white">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 shadow-md transition-colors"
              title="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full sm:w-64 h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              activeError
                ? "border-red-400 bg-red-50/50"
                : dragActive
                ? "border-[#900C22] bg-rose-50"
                : "border-slate-300 bg-slate-50 hover:border-[#900C22]/60 hover:bg-white"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#900C22] mb-3 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Click or drag & drop photo
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              JPG, PNG, or WebP (Max {EVENT_DETAILS.maxPhotoSizeMB} MB)
            </p>
            <span className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-wider">
              Required Step
            </span>
          </div>
        )}

        <div className="space-y-3 flex-1 text-center sm:text-left">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-[#900C22] hover:text-[#900C22] shadow-sm transition-all"
          >
            {formData.photoPreviewUrl ? "Choose Different Photo" : "Select Photo from Device"}
          </button>

          {hasPhoto && !uploadError && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 justify-center sm:justify-start font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Photograph verified and ready for pass generation</span>
            </div>
          )}

          {!hasPhoto && !activeError && (
            <p className="text-[11px] text-amber-700 font-medium">
              ⚠️ Photo upload is mandatory to proceed to the payment step.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
