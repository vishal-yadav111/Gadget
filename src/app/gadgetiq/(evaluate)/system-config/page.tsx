"use client";

import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, FileCode, Check } from "lucide-react";
import { systemConfigService } from "./services";
import { SystemConfigUploadResult } from "./types";
import { getFriendlyErrorMessage } from "../core";

export default function UploadSystemConfigPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<SystemConfigUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an XML or Excel config file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const res = await systemConfigService.uploadConfigFile(file);
      setResult(res);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, "Failed to upload configuration file. Please verify file format and try again."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-[#17284D]">Upload System Config</h1>
          <p className="text-xs text-[#5F6A86]">
            Upload master diagnostic test criteria, sensor tolerances, and scoring calibration matrices (.xlsx, .xml).
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDE4F3] shadow-xs space-y-5">
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="border-2 border-dashed border-[#C3CEE6] hover:border-[#0052CC] rounded-2xl p-8 text-center transition-colors bg-[#F8FAFC]">
            <input
              type="file"
              id="configFile"
              accept=".xml,.xlsx,.xls,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="configFile"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center shadow-xs">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#17284D] block">
                  {file ? file.name : "Click to browse or drag & drop configuration file"}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Supported formats: .XML, .XLSX, .JSON (Max 15MB)
                </span>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Configuration Upload Verified</span>
              </div>
              <p>{result.message}</p>
              <div className="flex items-center space-x-4 pt-1 font-mono text-[11px] text-emerald-700">
                <span>Total Rules: {result.totalParsedRows}</span>
                <span>•</span>
                <span>Active: {result.validConfigurations}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating Config...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Apply Specification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
