"use client";

import { useState, useRef } from "react";
import { EVENT_DETAILS } from "@/lib/constants/event";
import { Camera, Upload, AlertCircle, CheckCircle2, X, RefreshCw } from "lucide-react";
import Image from "next/image";

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

    // 1. Client-Side Size Validation (1 MB)
    if (file.size > EVENT_DETAILS.maxPhotoSizeBytes) {
      setUploadError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(
          2
        )} MB). Please select a photo under 1 MB.`
      );
      return;
    }

    // 2. MIME Validation
    if (!EVENT_DETAILS.allowedPhotoTypes.includes(file.type as any)) {
      setUploadError("Only JPG, PNG, and WebP images are accepted.");
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
      // Keep local preview if server storage is offline in dev
      setUploadError(err.message || "Failed to upload photo. Local preview retained.");
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

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Camera className="h-5 w-5 text-amber-400" />
          <span>Section IV: Participant Photograph</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload a clear portrait or passport-style photograph for your Delegate Pass and jury evaluation.
        </p>
      </div>

      {/* Recommended Guidelines Notice */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200/90 space-y-1">
        <div className="font-semibold text-amber-300 flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Photograph Guidelines:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
          <li><strong>File Size Limit:</strong> Maximum 1 MB (Strictly enforced).</li>
          <li><strong>Recommended Dimensions:</strong> Standard portrait ratio (3:4) or passport size (3.5cm x 4.5cm). <em>(Not technically blocked)</em>.</li>
          <li><strong>Format:</strong> JPEG, PNG, or WebP.</li>
          <li>Photo must show your face clearly with good lighting.</li>
        </ul>
      </div>

      {/* Upload Dropzone / Preview Area */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {formData.photoPreviewUrl ? (
          <div className="relative group w-44 h-56 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl bg-slate-900 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.photoPreviewUrl}
              alt="Participant Preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-2 text-xs text-amber-400">
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
              dragActive
                ? "border-amber-400 bg-amber-500/10"
                : "border-slate-700 bg-slate-900/40 hover:border-amber-500/50 hover:bg-slate-900/80"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-amber-400 mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-white">Click or drag & drop</p>
            <p className="text-[11px] text-slate-400 mt-1">Portrait photo (Max 1 MB)</p>
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
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-500/40 hover:text-white transition-all"
          >
            {formData.photoPreviewUrl ? "Choose Different Photo" : "Select Photo from Device"}
          </button>

          {formData.photoPreviewUrl && !uploadError && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 justify-center sm:justify-start">
              <CheckCircle2 className="h-4 w-4" />
              <span>Photograph ready for registration</span>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
