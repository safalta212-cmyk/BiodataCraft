import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Plus,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ListTree,
  FileText,
  CornerDownRight
} from 'lucide-react';

interface ArticleStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertStructure: (markdownSnippet: string, mode: 'cursor' | 'append') => void;
  currentArticleTitle?: string;
}

export interface StructureTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  preview: string;
  markdown: string;
}

export const STRUCTURE_TEMPLATES: StructureTemplate[] = [
  {
    id: 'full-guide',
    name: 'Complete Educational Guide Blueprint',
    badge: 'Comprehensive Outline',
    description: 'Complete 9-section framework for authoring high-authority Indian marriage biodata guides.',
    preview: 'Introduction → TOC → Foundations → Step-by-Step → Sample Box → Auspicious Tips → Common Mistakes → FAQs → Conclusion',
    markdown: `In Indian arranged and semi-arranged marriage proposals, a matrimonial biodata is the sacred first introduction of a candidate and their family lineage. A balanced biodata honors traditional values while clearly articulating professional achievements and life expectations.

## Why a Dignified Biodata Matters in Indian Matrimony

First impressions shape matrimonial conversations. Unlike a corporate curriculum vitae, an Indian marriage biodata communicates cultural harmony, family values, and lifestyle compatibility alongside educational qualifications.

### Essential Personal & Family Fundamentals
When compiling personal credentials, ensure the following core categories are clearly delineated:
- **Personal Information:** Full legal name, date of birth, time of birth, birth city, height, and marital status.
- **Astrological Details:** Gotra, Nakshatra, Rashi, and Manglik status (Kalyana/Kundali compatibility).
- **Academic & Professional Standing:** Highest educational degree, college/university, current job title, employer, and work location.
- **Family Lineage:** Father's occupation, mother's background, sibling details, and maternal uncle (Mosal/Mama) gotra.

## Step-by-Step Guide to Crafting Your Profile

Follow this structured sequence to prepare an error-free proposal:
1. **Choose an Auspicious Design:** Pick a cultural border reflecting your family tradition (e.g. Traditional Vedic, Royal Rajasthani, or Minimalist Gold).
2. **Draft Concise Summary:** Write a brief, respectful introduction summarizing core values.
3. **Verify Astrological Data:** Consult family elders to confirm Gotra and birth timing before printing.
4. **Select a High-Resolution Portrait:** Use a warm, well-lit portrait photograph taken in professional or semi-formal attire.

## Real Sample Marriage Biodata Format

> **Sample Profile Summary:**
> - **Full Name:** Aarav Sharma | **DOB:** 14 June 1996 (Height: 5'11")
> - **Education:** B.Tech (IIT Delhi), Senior Software Architect at Bengaluru
> - **Astrology:** Shandilya Gotra, Rohini Nakshatra, Non-Manglik
> - **Family:** Father (Retired Principal), Mother (Homemaker), 1 Younger Sister (Married)
> - **Contact:** Family Residence, Civil Lines, Jaipur

## Practical Auspicious Tips & Family Etiquette

- **Respectful Tone:** Avoid casual abbreviations or slang; maintain dignified language throughout.
- **Honesty in Credentials:** Accurately state package, height, and expectations to foster lasting trust.
- **Privacy Awareness:** Never disclose sensitive national ID numbers or bank details in matrimonial biodatas.

## Common Mistakes to Avoid in Marriage Biodatas

| Common Mistake | Recommended Correction | Impact on Proposal |
| :--- | :--- | :--- |
| Writing long, unformatted text blocks | Use clear bullet points with bold subheadings | Enhances readability on mobile screens |
| Omitting maternal uncle (Mosal) details | Include maternal Gotra and city | Crucial for North/West Indian alliances |
| Using low-resolution or cropped selfie photos | Attach a clear, professional studio portrait | Conveys seriousness and dignity |
| Ambiguous caste or Gotra details | Clarify Gotra and sub-caste up front | Prevents mismatched astrological inquiries |

## Frequently Asked Questions (FAQ)

### What is the ideal length of an Indian marriage biodata?
A single-page format is strongly recommended for standard matchmaking. Two pages may be utilized when extensive family background, Mosal lineage, and Kundali charts need representation.

### Is astrological (Kundali) information mandatory?
While modern couples may prioritize lifestyle compatibility, traditional families often require Gotra, Rashi, and Manglik details for initial screening. Including these details prevents delays in family deliberations.

## Conclusion & Next Steps

Preparing an authentic marriage biodata sets the stage for meaningful family introductions. Take time to review details with your elders, choose a dignified template border, and share a clean PDF format with prospective proposals.`
  },
  {
    id: 'dos-and-donts',
    name: 'Dos and Don\'ts Comparison Table',
    badge: 'Comparison Block',
    description: 'Insert a high-contrast comparison table contrasting best practices vs common pitfalls.',
    preview: '| Dos (Best Practices) | Don\'ts (Mistakes to Avoid) |',
    markdown: `## Matrimonial Biodata Dos and Don'ts

| Recommended Best Practice (Do) | Common Mistake to Avoid (Don't) | Why It Matters |
| :--- | :--- | :--- |
| **Verify Gotra & Horoscope:** Check birth time and maternal Gotra with elders. | **Don't guess astrological data:** Inaccurate Manglik status leads to future confusion. | Establishes immediate trust between families. |
| **Clear Professional Portrait:** Provide a high-resolution, recent photograph. | **Avoid group photos or selfies:** Cropped images look unprofessional. | Allows the prospective family to see you clearly. |
| **Concise Family Background:** Mention parents, siblings, and family hometown. | **Don't write lengthy essays:** Keep family details structured and respectful. | Quick, effortless scanning for parents and elders. |
| **Share in PDF Format:** Export a crisp, non-editable PDF document. | **Don't send raw Word docs:** Word files lose formatting across different mobile devices. | Ensures pristine presentation on WhatsApp. |`
  },
  {
    id: 'faq-section',
    name: 'Structured FAQ Accordion Block',
    badge: 'FAQ Schema',
    description: 'Insert an authentic Frequently Asked Questions section with answers tailored to matrimonial inquiries.',
    preview: '### FAQ 1: How to write family background? \n### FAQ 2: Should I include salary in biodata?',
    markdown: `## Frequently Asked Questions

### What family background information should be included in an Indian biodata?
State your father's occupation, mother's background, number of siblings and their marital status, family values (orthodox, moderate, or liberal), and ancestral native place. In North and West Indian communities, including your maternal uncle's (Mosal/Mama) surname and Gotra is also customary.

### Should exact salary or CTC package be mentioned?
In traditional Indian matrimonial biodatas, it is common to state either a broad compensation bracket (e.g., "18–22 LPA") or simply indicate the job role, company name, and location, reserving exact financial details for direct family discussions.

### How do I share my marriage biodata securely?
Always export your biodata as a password-free, high-quality PDF. Avoid sharing physical government identity cards or Aadhaar numbers until after initial family conversations have advanced.`
  },
  {
    id: 'sample-callout',
    name: 'Sample Profile Snippet (Callout Box)',
    badge: 'Profile Callout',
    description: 'Insert an illustrative sample matrimonial profile box showing bride or groom credentials.',
    preview: '> **Candidate Overview:** Name, Age, Profession, Gotra, Family',
    markdown: `> **Illustrative Sample Profile:**
> - **Candidate:** Priya Patel, B.E. (Computer Science), Senior UX Designer, Ahmedabad
> - **Personal Details:** Born 22 Oct 1997 (Age 29), Height 5'5", Vegetarian
> - **Kundali Details:** Kashyap Gotra, Punarvasu Nakshatra, Non-Manglik
> - **Family Details:** Father (Chartered Accountant), Mother (Teacher), 1 Brother (Studying MBA)
> - **Contact & Native Place:** Navrangpura, Ahmedabad | Native: Anand, Gujarat`
  },
  {
    id: 'etiquette-checklist',
    name: 'Auspicious Kundali & Astrological Guide',
    badge: 'Cultural Tips',
    description: 'Insert an astrological checklist explaining Gotra, Mosal, Manglik dosha, and Guna Milan.',
    preview: '### Gotra Lineage Rules \n### Maternal Uncle (Mosal) \n### Manglik Dosha Clarification',
    markdown: `## Astrological (Kundali) Details in Indian Biodatas

Astrological compatibility remains a cornerstone of traditional Indian matrimonial alliances. Clarifying these parameters upfront helps families conduct Guna Milan with clarity:

- **Gotra (Ancestral Lineage):** Identifies patriarchal lineage from Vedic sages (e.g., Bharadwaja, Kashyap, Vashishta). Traditional customs forbid marriage within the same Gotra.
- **Mosal / Mama Gotra:** In Gujarati, Marwari, and Rajasthani traditions, the maternal uncle's Gotra is also cross-verified to avoid close relation.
- **Manglik Status (Kuja Dosha):** State whether the candidate is Manglik, Non-Manglik, or Anshik (partial) Manglik, along with exact birth time and place for horoscope verification.
- **Nakshatra & Rashi:** Crucial for calculating the 36 Guna Milan points (Ashtakoot score).`
  }
];

export const ArticleStructureModal: React.FC<ArticleStructureModalProps> = ({
  isOpen,
  onClose,
  onInsertStructure,
  currentArticleTitle = ''
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('full-guide');
  const [insertMode, setInsertMode] = useState<'cursor' | 'append'>('cursor');

  if (!isOpen) return null;

  const currentTemplate = STRUCTURE_TEMPLATES.find((t) => t.id === selectedTemplateId) || STRUCTURE_TEMPLATES[0];

  const handleApply = () => {
    onInsertStructure(currentTemplate.markdown, insertMode);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="structure-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-900 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="structure-modal-title" className="text-base font-bold text-stone-900 font-cinzel">
                Article Structure Assistant
              </h2>
              <p className="text-xs text-stone-500">
                Choose an educational structure blueprint or modular section to insert without losing existing text.
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

        {/* Content Body: Left template list + Right preview */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Template Selection Column */}
          <div className="w-full md:w-5/12 p-4 border-r border-stone-100 overflow-y-auto space-y-2 bg-stone-50/30">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block px-1 pb-1">
              Structure Blueprints & Blocks:
            </span>
            {STRUCTURE_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-700/15 shadow-2xs'
                      : 'bg-white border-stone-200/70 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900 line-clamp-1">{tmpl.name}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">{tmpl.description}</p>
                </button>
              );
            })}
          </div>

          {/* Preview Column */}
          <div className="w-full md:w-7/12 p-5 overflow-y-auto space-y-4 bg-white flex flex-col">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 font-cinzel">{currentTemplate.name}</span>
                <span className="text-[10px] text-stone-400 font-mono">Structured Markdown</span>
              </div>
              <p className="text-xs text-stone-500">{currentTemplate.description}</p>
            </div>

            {/* Markdown Codebox Preview */}
            <div className="flex-1 p-3.5 rounded-2xl bg-stone-900 text-stone-200 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[300px] border border-stone-800 shadow-inner">
              <pre className="whitespace-pre-wrap">{currentTemplate.markdown}</pre>
            </div>

            {/* Insertion Mode Selector */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-xs font-semibold text-stone-700 block">Insertion Placement:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInsertMode('cursor')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    insertMode === 'cursor'
                      ? 'bg-amber-50 border-amber-700 text-amber-950 font-semibold ring-1 ring-amber-700'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Insert at Cursor Position</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInsertMode('append')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                    insertMode === 'append'
                      ? 'bg-amber-50 border-amber-700 text-amber-950 font-semibold ring-1 ring-amber-700'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Append to End of Article</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400 italic">
                Safe insertion: Your existing content will never be deleted or overwritten.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-2 min-h-[36px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Insert Selected Structure</span>
          </button>
        </div>
      </div>
    </div>
  );
};
