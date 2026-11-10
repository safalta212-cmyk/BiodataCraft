import React, { useState } from 'react';
import {
  History,
  X,
  RotateCcw,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  GitCommit,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export interface ArticleVersionSnapshot {
  id: string;
  timestamp: string;
  dateFormatted: string;
  label: string;
  author: string;
  title: string;
  excerpt: string;
  content: string;
  wordCount: number;
  charCount: number;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ArticleVersionSnapshot[];
  currentContent: string;
  currentTitle: string;
  onRestoreVersion: (snapshot: ArticleVersionSnapshot) => void;
  onCreateManualSnapshot: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentContent,
  currentTitle,
  onRestoreVersion,
  onCreateManualSnapshot
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versions.length > 0 ? versions[0].id : ''
  );
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  if (!isOpen) return null;

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];

  const handleConfirmRestore = () => {
    if (selectedVersion) {
      onRestoreVersion(selectedVersion);
      setShowRestoreConfirm(false);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="version-history-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-900 shadow-2xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 id="version-history-modal-title" className="text-base font-bold text-stone-900 font-cinzel">
                Article Version History & Snapshots
              </h2>
              <p className="text-xs text-stone-500">
                Inspect editing milestones, compare changes against the active canvas, and safely restore drafts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Architecture Notice */}
        <div className="p-3 px-5 bg-amber-50/70 border-b border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-950">
          <Info className="w-4 h-4 text-amber-800 shrink-0" />
          <div className="flex-1 text-[11px] leading-normal">
            <strong>Architecture Notice:</strong> Version snapshots are preserved locally within this editing session and browser storage. Multi-author persistent server history across multiple devices requires provisioning a <code>/blog_posts/{'{postId}'}/versions</code> Firestore subcollection.
          </div>
          <button
            type="button"
            onClick={onCreateManualSnapshot}
            className="px-2.5 py-1 rounded-lg bg-amber-800 text-white font-medium hover:bg-amber-900 transition-colors cursor-pointer whitespace-nowrap text-[11px] shadow-2xs"
          >
            Save Snapshot Now
          </button>
        </div>

        {/* Content Body: Left versions timeline + Right side-by-side / diff comparison */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Timeline column */}
          <div className="w-full md:w-4/12 p-4 border-r border-stone-100 overflow-y-auto space-y-2 bg-stone-50/30">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Milestones ({versions.length})
              </span>
            </div>

            {versions.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto opacity-30 text-stone-400" />
                <p className="text-xs font-medium text-stone-600">No previous versions yet.</p>
                <p className="text-[11px] text-stone-400">
                  Snapshots are captured automatically when saving drafts or publishing.
                </p>
              </div>
            ) : (
              versions.map((ver, idx) => {
                const isSelected = ver.id === selectedVersion?.id;
                const isLatest = idx === 0;
                return (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => {
                      setSelectedVersionId(ver.id);
                      setShowRestoreConfirm(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-700/15 shadow-2xs'
                        : 'bg-white border-stone-200/70 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <GitCommit className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-800' : 'text-stone-400'}`} />
                        <span className="text-xs font-bold text-stone-900 truncate">{ver.label}</span>
                      </div>
                      {isLatest && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Latest
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>{ver.dateFormatted}</span>
                      <span>{ver.wordCount} words</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Details / Diff Column */}
          <div className="w-full md:w-8/12 p-5 overflow-y-auto space-y-4 bg-white flex flex-col">
            {selectedVersion ? (
              <>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{selectedVersion.label}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{selectedVersion.dateFormatted}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{selectedVersion.author}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{selectedVersion.wordCount} words</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRestoreConfirm(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Version</span>
                  </button>
                </div>

                {/* Restore Confirmation Prompt */}
                {showRestoreConfirm && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-800" />
                      <span>Confirm Restoring Version "{selectedVersion.label}"?</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      Restoring this snapshot will replace the current editor canvas with this content. Your active version has been saved as an undo milestone in your session history.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleConfirmRestore}
                        className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        Yes, Restore Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRestoreConfirm(false)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Compare Metadata Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">Word Difference</span>
                    <span className="font-bold text-stone-800">
                      {selectedVersion.wordCount - (currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0) > 0
                        ? `+${selectedVersion.wordCount - (currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0)} words`
                        : `${selectedVersion.wordCount - (currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0)} words`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">Article Title</span>
                    <span className="font-semibold text-stone-800 truncate block">
                      {selectedVersion.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">Total Characters</span>
                    <span className="font-bold text-stone-800">{selectedVersion.charCount} chars</span>
                  </div>
                </div>

                {/* Content Comparison View */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                    <span>Snapshot Article Content</span>
                    <span className="text-stone-400 text-[10px] font-mono">Markdown Format</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[11px] leading-relaxed max-h-[300px] overflow-y-auto border border-stone-800 shadow-inner">
                    <pre className="whitespace-pre-wrap">{selectedVersion.content}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-stone-400">
                <p>Select a snapshot from the timeline to review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50">
          <span className="text-xs text-stone-400">
            {versions.length} version milestones recorded in this editing session
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
