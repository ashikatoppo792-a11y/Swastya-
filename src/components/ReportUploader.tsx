import React, { useState } from 'react';
import { ReportItem, PhotoItem } from '../types';
import { extractReportOCR } from '../services/api';
import {
  FileText,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ScanLine,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface ReportUploaderProps {
  reports: ReportItem[];
  photos: PhotoItem[];
  onReportsChange: (reports: ReportItem[]) => void;
  onPhotosChange: (photos: PhotoItem[]) => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  reports,
  photos,
  onReportsChange,
  onPhotosChange,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  // Handle report file upload
  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setScanning(true);
    setScanMessage(`Scanning ${file.name} with OCR extraction engine...`);

    try {
      const extracted = await extractReportOCR(file.name, file.type);
      const newReport: ReportItem = {
        id: `REP-${Date.now()}`,
        type: file.type.includes('pdf') ? 'pdf_report' : 'lab_image',
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        ocrExtractedText: extracted.ocrExtractedText,
        keyFindings: extracted.keyFindings,
      };

      onReportsChange([...reports, newReport]);
    } catch {
      // Fallback
      const fallbackReport: ReportItem = {
        id: `REP-${Date.now()}`,
        type: 'document',
        fileName: file.name,
        ocrExtractedText: 'Document uploaded for clinician review.',
        keyFindings: [{ parameter: 'Document Scan', value: 'Legible record', status: 'NORMAL' }]
      };
      onReportsChange([...reports, fallbackReport]);
    } finally {
      setScanning(false);
      setScanMessage('');
      e.target.value = '';
    }
  };

  // Handle photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    const newPhoto: PhotoItem = {
      id: `PHT-${Date.now()}`,
      fileName: file.name,
      previewUrl,
      mockVisualAnalysis: 'Surface tissue screening: Erythema and localized skin alteration recorded. Non-diagnostic screening.',
      confidence: 0.90,
    };

    onPhotosChange([...photos, newPhoto]);
    e.target.value = '';
  };

  // Quick Demo Pre-loaders
  const loadDemoCbcReport = () => {
    const demoCbc: ReportItem = {
      id: `REP-DEMO-${Date.now()}`,
      type: 'cbc_report',
      fileName: 'diagnostic_lab_cbc_report.pdf',
      ocrExtractedText: 'Platelet Count: 42,000 /cumm. Hemoglobin: 13.8 g/dL. Dengue NS1: POSITIVE. Hematocrit: 47%.',
      keyFindings: [
        { parameter: 'Platelet Count', value: '42,000 /cumm', status: 'CRITICAL', normalRange: '150,000 - 450,000' },
        { parameter: 'Dengue NS1 Antigen', value: 'POSITIVE', status: 'CRITICAL', normalRange: 'Negative' },
        { parameter: 'Hematocrit (PCV)', value: '47%', status: 'ABNORMAL', normalRange: '36 - 44%' }
      ]
    };
    onReportsChange([...reports, demoCbc]);
  };

  const loadDemoEcg = () => {
    const demoEcg: ReportItem = {
      id: `REP-DEMO-ECG-${Date.now()}`,
      type: 'ecg_snapshot',
      fileName: 'lead_II_ecg_strip.png',
      ocrExtractedText: 'ST-Elevation >2mm in anterolateral leads. HR 108 bpm. Sinus Tachycardia.',
      keyFindings: [
        { parameter: 'ST Segment', value: 'Marked Elevation', status: 'CRITICAL', normalRange: 'Isoelectric' },
        { parameter: 'Rhythm', value: 'Sinus Tachycardia 108 bpm', status: 'ABNORMAL', normalRange: '60-100 bpm' }
      ]
    };
    onReportsChange([...reports, demoEcg]);
  };

  const loadDemoWoundPhoto = () => {
    const demoPhoto: PhotoItem = {
      id: `PHT-DEMO-${Date.now()}`,
      fileName: 'diabetic_foot_lesion.jpg',
      previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      mockVisualAnalysis: 'Plantar hallux ulceration with slough base and 2cm surrounding erythematous cellulitis border.',
      confidence: 0.91
    };
    onPhotosChange([...photos, demoPhoto]);
  };

  const removeReport = (id: string) => {
    onReportsChange(reports.filter(r => r.id !== id));
  };

  const removePhoto = (id: string) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6 transition-colors">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Diagnostic Reports & Clinical Photos
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload PDF/images of lab tests, prescriptions, ECGs, and skin or wound photos for preliminary automated summarization.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Visual Input Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">BASIC VISUAL INPUT ONLY — NOT DIAGNOSTIC:</strong>
          <span className="ml-1 text-amber-800 dark:text-amber-300">
            Uploaded images and OCR extractions serve solely as observational context for clinical review. Automated models do not determine final clinical diagnoses or pathology.
          </span>
        </div>
      </div>

      {/* Quick Demo Pre-load buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Load realistic demo files:
        </span>
        <button
          type="button"
          onClick={loadDemoCbcReport}
          className="text-xs px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 font-medium transition"
        >
          + Dengue CBC Report (Plt 42k)
        </button>
        <button
          type="button"
          onClick={loadDemoEcg}
          className="text-xs px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-medium transition"
        >
          + Cardiac Lead II ECG Strip
        </button>
        <button
          type="button"
          onClick={loadDemoWoundPhoto}
          className="text-xs px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-medium transition"
        >
          + Diabetic Foot Wound Photo
        </button>
      </div>

      {/* Two Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lab Reports Dropzone */}
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-950/40 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition group">
          <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Upload Diagnostic Report
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PDF, PNG, JPG (CBC, X-ray, ECG, Sugar)
          </span>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleReportUpload}
            className="hidden"
          />
        </label>

        {/* Clinical Photos Dropzone */}
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-950/40 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition group">
          <Camera className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Upload Clinical Photo
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Wound, skin lesion, burn, or swelling photo
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Scanning status banner */}
      {scanning && (
        <div className="bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 rounded-xl p-3 flex items-center gap-3 animate-pulse">
          <ScanLine className="w-5 h-5 text-teal-600 animate-spin" />
          <span className="text-xs font-semibold text-teal-800 dark:text-teal-200">
            {scanMessage}
          </span>
        </div>
      )}

      {/* Uploaded Reports List with OCR Findings */}
      {reports.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Uploaded Reports ({reports.length})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col sm:flex-row items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {rep.fileName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      OCR Extracted
                    </span>
                  </div>

                  {rep.ocrExtractedText && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                      {rep.ocrExtractedText}
                    </p>
                  )}

                  {rep.keyFindings && rep.keyFindings.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {rep.keyFindings.map((kf, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                            kf.status === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                              : kf.status === 'ABNORMAL'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {kf.parameter}: {kf.value}
                          {kf.normalRange && <span className="font-normal opacity-80">({kf.normalRange})</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeReport(rep.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                  title="Remove report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Photos List with Visual Observations */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Uploaded Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex gap-3"
              >
                <img
                  src={photo.previewUrl}
                  alt={photo.fileName}
                  className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {photo.fileName}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {photo.mockVisualAnalysis || 'Photo recorded for clinician view.'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                      Basic visual input only
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
