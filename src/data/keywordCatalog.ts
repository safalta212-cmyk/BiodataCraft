import { SEO_KEYWORD_CATEGORIES, ALL_500_SEO_KEYWORDS } from './seoKeywords';

export interface KeywordChecklistItem {
  title: string;
  desc: string;
}

export interface KeywordFAQItem {
  question: string;
  answer: string;
}

export interface KeywordPageMetadata {
  slug: string;
  keyword: string;
  category: string;
  categoryId: string;
  categoryHindi: string;
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  culturalContext: string;
  keyChecklist: KeywordChecklistItem[];
  faqs: KeywordFAQItem[];
  recommendedTemplateIds: string[];
  suggestedSample: 'hindu' | 'hindi' | 'modern';
  relatedSlugs: { title: string; slug: string }[];
}

export const HINDI_KEYWORD_SLUG_MAP: Record<string, string> = {
  'विवाह बायोडाटा': 'vivah-biodata-hindi',
  'शादी का बायोडाटा': 'shadi-ka-biodata-hindi',
  'शादी के लिए बायोडाटा प्रारूप': 'shadi-ke-liye-biodata-praroop',
  'फ्री बायोडाटा मेकर': 'free-biodata-maker-hindi',
  'बायोडाटा पीडीएफ डाउनलोड': 'biodata-pdf-download-hindi',
  'शादी बायोडाटा हिंदी में': 'shadi-biodata-hindi-me',
  'वर बायोडाटा प्रारूप': 'var-biodata-praroop',
  'वधू बायोडाटा प्रारूप': 'vadhu-biodata-praroop',
  'हिन्दू विवाह बायोडाटा': 'hindu-vivah-biodata-hindi',
  'जैन विवाह बायोडाटा': 'jain-vivah-biodata-hindi',
  'यादव समाज विवाह बायोडाटा': 'yadav-samaj-vivah-biodata',
  'राजपूत बायोडाटा': 'rajput-biodata-hindi',
  'ब्राह्मण विवाह बायोडाटा': 'brahmin-vivah-biodata-hindi',
  'लग्न पत्रिका प्रारूप': 'lagna-patrika-praroop',
  'मांगलिक बायोडाटा': 'manglik-biodata-hindi',
  'कुंडली मिलान बायोडाटा': 'kundali-milan-biodata-hindi',
  'गोत्र ननिहाल विवरण': 'gotra-nanihal-vivaran-biodata',
  'बायोडाटा कैसे बनाएं': 'biodata-kaise-banaye-hindi',
  'विवाह बायोडाटा फॉर्मेट वर्ड': 'vivah-biodata-format-word',
  'बिना वाटरमार्क बायोडाटा': 'bina-watermark-biodata',
  'नि:शुल्क विवाह बायोडाटा': 'nishulk-vivah-biodata',
  'भारतीय विवाह बायोडाटा': 'bharatiya-vivah-biodata',
  'सुन्दर विवाह बायोडाटा': 'sundar-vivah-biodata',
  'आकर्षक शादी बायोडाटा': 'aakarshak-shadi-biodata',
  'शादी का परिचय पत्र': 'shadi-ka-parichay-patra',
  'वैवाहिक बायोडाटा': 'vaivahik-biodata',
  'विवाह हेतु परिचय पत्र': 'vivah-hetu-parichay-patra',
  'शादी के लिए जीवन परिचय': 'shadi-ke-liye-jeevan-parichay',
  'विवाह प्रोफाइल मेकर': 'vivah-profile-maker',
  'बायोडाटा मेकर ऑनलाइन': 'biodata-maker-online-hindi',
  'वर-वधू विवाह बायोडाटा': 'var-vadhu-vivah-biodata',
  'गोत्र प्रवर बायोडाटा': 'gotra-pravara-biodata',
  'ननिहाल पक्ष बायोडाटा': 'nanihal-paksha-biodata',
  'मामा का नाम गोत्र': 'mama-ka-naam-gotra-biodata',
  'जन्म समय जन्म स्थान बायोडाटा': 'janma-samay-janma-sthan-biodata',
  'राशि नक्षत्र बायोडाटा': 'rashi-nakshatra-biodata-hindi',
  'शुभ विवाह लग्न पत्रिका': 'shubh-vivah-lagna-patrika',
  'गणेश जी फोटो बायोडाटा': 'ganesh-ji-photo-biodata',
  'ॐ स्वस्तिक बायोडाटा': 'om-swastik-biodata',
  'हिन्दी में बायोडाटा कैसे लिखें': 'hindi-me-biodata-kaise-likhe',
  'शादी का फॉर्म': 'shadi-ka-form',
  'विवाह का फॉर्म पीडीएफ': 'vivah-ka-form-pdf',
  'लड़का बायोडाटा प्रारूप': 'ladka-biodata-praroop',
  'लड़की बायोडाटा प्रारूप': 'ladki-biodata-praroop',
  'पुनर्विवाह बायोडाटा': 'punarvivah-biodata',
  'एनआरआई शादी बायोडाटा': 'nri-shadi-biodata',
  'डॉक्टर शादी बायोडाटा': 'doctor-shadi-biodata',
  'इंजीनियर विवाह बायोडाटा': 'engineer-vivah-biodata',
  'सरकारी नौकरी विवाह बायोडाटा': 'sarkari-naukri-vivah-biodata',
  'विवाह बायोडेटा डाउनलोड': 'vivah-biodata-download-hindi',
  'शादी का बायोडाटा कैसे बनाएं': 'shadi-ka-biodata-kaise-banaye',
  'बायोडाटा फॉर्मेट इन हिंदी पीडीफ़': 'biodata-format-in-hindi-pdf',
  'सुंदर विवाह बायोडाटा मेकर': 'sundar-vivah-biodata-maker',
  'हिन्दू विवाह बायोडाटा फॉर्मेट वर्ड': 'hindu-vivah-biodata-format-word',
  'शादी के लिए बायोडाटा इन हिंदी': 'shadi-ke-liye-biodata-in-hindi',
  'वर पक्ष का बायोडाटा': 'var-paksha-ka-biodata',
  'वधू पक्ष का बायोडाटा': 'vadhu-paksha-ka-biodata',
  'मांगलिक दोष बायोडाटा': 'manglik-dosh-biodata-hindi',
  'जन्म कुंडली बायोडाटा': 'janam-kundali-biodata-hindi'
};

export function getSlugForKeyword(kw: string): string {
  if (HINDI_KEYWORD_SLUG_MAP[kw]) return HINDI_KEYWORD_SLUG_MAP[kw];
  return kw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Slugs reverse index to raw keyword
const SLUG_TO_KEYWORD_MAP: Record<string, string> = {};
ALL_500_SEO_KEYWORDS.forEach((kw) => {
  SLUG_TO_KEYWORD_MAP[getSlugForKeyword(kw)] = kw;
});

export const ALL_KEYWORD_SLUGS: string[] = Object.keys(SLUG_TO_KEYWORD_MAP);

export function getKeywordPageBySlug(slug: string): KeywordPageMetadata | undefined {
  const keyword = SLUG_TO_KEYWORD_MAP[slug];
  if (!keyword) return undefined;

  const isHindi = /[\u0900-\u097F]/.test(keyword);
  const formattedName = isHindi
    ? keyword
    : keyword.replace(/\b\w/g, (l) => l.toUpperCase());

  // Determine category
  let matchedCat = SEO_KEYWORD_CATEGORIES[0];
  for (const cat of SEO_KEYWORD_CATEGORIES) {
    if (cat.keywords.includes(keyword)) {
      matchedCat = cat;
      break;
    }
  }

  // Related keywords from same category (up to 8 items)
  const relatedSlugs = matchedCat.keywords
    .filter((k) => k !== keyword)
    .slice(0, 8)
    .map((k) => ({
      title: k.replace(/\b\w/g, (l) => l.toUpperCase()),
      slug: getSlugForKeyword(k)
    }));

  switch (matchedCat.id) {
    case 'communities-castes':
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} Format, Gotra & Free PDF Maker | BiodataCraft`,
        metaDescription: `Create an authentic ${keyword} tailored to traditional family expectations. Includes Gotra, Mama Ji (Mosal/Nanihal), Kuldevi, and Kundali details. 100% Free A4 PDF.`,
        h1: formattedName,
        tagline: `Authentic Matrimonial Biodata Format for ${formattedName} Families`,
        culturalContext: `In traditional Indian matrimony, ${keyword} serves as a sacred portrait of ancestral heritage, family standing, and cultural values. Ensuring exact paternal Gotra, maternal uncle (Mama Ji / Mosal) lineage, and respectful family background facilitates a smooth and dignified matchmaking process.`,
        keyChecklist: [
          {
            title: 'Paternal Gotra & Ancestral Origin',
            desc: 'Clearly mention your ancestral gotra, native village (pind / gaon), and family kuldevi or ishta devata.'
          },
          {
            title: 'Maternal Uncle (Mama Ji / Mosal)',
            desc: "Include the mother's maiden gotra, maternal grandfather's location, and respected mama ji details to avoid sagotra alliances."
          },
          {
            title: 'Education & Professional Credentials',
            desc: 'Accurately specify degrees, university, current designation, employer organization, and workplace city.'
          },
          {
            title: 'Family Lineage & Contact Person',
            desc: "Detail parents' occupations, sibling counts with marital status, and direct contact numbers of family elders."
          }
        ],
        faqs: [
          {
            question: `Why is maternal gotra (Mosal) important in a ${formattedName}?`,
            answer: 'Maternal gotra verification is a revered tradition across Indian communities to prevent ancestral conflict and ensure both maternal and paternal bloodlines are harmoniously aligned.'
          },
          {
            question: `Can I download the ${formattedName} directly as a PDF?`,
            answer: 'Yes! BiodataCraft generates publication-grade vector A4 PDFs and high-resolution WhatsApp PNG images directly in your browser with zero watermarks.'
          },
          {
            question: 'Is any of my private family information stored on servers?',
            answer: 'Never. BiodataCraft operates on a 100% client-side privacy architecture. Your photos and personal data stay strictly inside your browser memory.'
          }
        ],
        recommendedTemplateIds: ['royal-heritage', 'vedic-aura', 'emerald-royalty'],
        suggestedSample: 'hindu',
        relatedSlugs
      };

    case 'astrology-kundali':
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} - Janam Kundali, Gotra & Guna Milan | BiodataCraft`,
        metaDescription: `Generate a complete ${keyword} with exact birth time, Rashi, Nakshatra, Charan, Gotra, and Manglik status. Pandit-approved layout with instant free A4 PDF.`,
        h1: formattedName,
        tagline: 'Vedic Kundali, Guna Milan & Horoscope Details for Marriage',
        culturalContext: `Astrological alignment forms a foundational pillar in Vedic matrimony. A complete ${keyword} provides matched pandits with exact birth coordinates (time with AM/PM, place, and date) to verify Ashta Kuta Guna Milan (36 points), Manglik Dosha, and Nadi compatibility without delay.`,
        keyChecklist: [
          {
            title: 'Exact Time of Birth & City',
            desc: 'Record the exact time with AM/PM and birth city to ensure precise planetary ascendant (Lagna) calculations.'
          },
          {
            title: 'Rashi, Nakshatra & Charan',
            desc: 'State Moon sign (Chandra Rashi), birth star (Nakshatra), and quadrant (Charan/Padam) clearly.'
          },
          {
            title: 'Manglik & Dosha Clarity',
            desc: 'Mention Manglik, Anshik Manglik, or Non-Manglik status transparently for peaceful matrimonial understanding.'
          },
          {
            title: 'Gotra, Gana & Nadi',
            desc: 'List Gotra, Gana (Dev/Manushya/Rakshasa), and Nadi (Adi/Madhya/Antya) for comprehensive horoscope matching.'
          }
        ],
        faqs: [
          {
            question: `What astrological details must be included in a ${formattedName}?`,
            answer: 'Essential details include Date of Birth, exact Time of Birth (with AM/PM), Birth City, Rashi (Moon Sign), Nakshatra, Charan, Gotra, and Manglik status.'
          },
          {
            question: 'How do I mention Manglik status respectfully?',
            answer: "State it clearly as 'Non-Manglik', 'Manglik', or 'Anshik (Mild) Manglik'. Transparency helps pandits assess compatibility right away."
          },
          {
            question: 'Can I add a Kundali chart image to my biodata?',
            answer: 'Yes, our templates allow embedding your birth chart or horoscope summary alongside your candidate photograph.'
          }
        ],
        recommendedTemplateIds: ['vedic-aura', 'royal-heritage', 'emerald-royalty'],
        suggestedSample: 'hindu',
        relatedSlugs
      };

    case 'professions-careers':
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} - Professional Matrimonial Profile | BiodataCraft`,
        metaDescription: `Craft an elegant ${keyword} showcasing degrees, current designation, employer, and family background. 100% Free with zero registration. Instant PDF export.`,
        h1: formattedName,
        tagline: 'Executive Matrimonial Profile for Working Professionals',
        culturalContext: `For accomplished modern professionals, a ${keyword} strikes the ideal balance between celebrating career milestones and honoring respected family traditions. It communicates personal ambition while highlighting mutual compatibility and cultured lifestyle.`,
        keyChecklist: [
          {
            title: 'Educational Alma Mater & Degrees',
            desc: 'Highlight highest qualification, prestigious college/university names, and notable academic honors.'
          },
          {
            title: 'Corporate / Government Role',
            desc: 'Specify exact job title, organization/company name, workplace location, and work flexibility (WFH/hybrid).'
          },
          {
            title: 'Lifestyle & Core Values',
            desc: 'Briefly articulate personal interests, cultural balance, fitness habits, and vision for married partnership.'
          },
          {
            title: 'Family Foundation',
            desc: "Provide dignified details of parents' professions and family roots alongside professional credentials."
          }
        ],
        faqs: [
          {
            question: `Should salary or annual CTC be mentioned in a ${formattedName}?`,
            answer: "You may mention an annual package range (e.g. '25+ LPA') or simply specify your designation and company if your family prefers discussing financials in personal meetings."
          },
          {
            question: 'Which template is best suited for an executive biodata?',
            answer: "Our 'Modern Elegance' and 'Executive Ivory' templates are designed specifically for corporate and working professionals."
          },
          {
            question: 'Can I share my biodata directly via WhatsApp?',
            answer: 'Yes! You can download a high-resolution PNG image optimized specifically for instant viewing on WhatsApp.'
          }
        ],
        recommendedTemplateIds: ['modern-elegance', 'executive-ivory', 'royal-heritage'],
        suggestedSample: 'modern',
        relatedSlugs
      };

    case 'regional-languages':
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} - Regional Biodata Format & PDF | BiodataCraft`,
        metaDescription: `Create a culturally tailored ${keyword} with bilingual regional script support. Includes custom shlokas, gotra, and print-ready A4 PDF download.`,
        h1: formattedName,
        tagline: 'Culturally Accurate Matrimonial Format with Native Traditions',
        culturalContext: `Every region of India carries distinct wedding rituals and matrimonial norms. A ${keyword} incorporates local customs, auspicious greetings, and regional terms that resonate deeply with prospective family elders.`,
        keyChecklist: [
          {
            title: 'Regional Ceremonial Customs',
            desc: 'Incorporate native greetings and customary family terms specific to your home state.'
          },
          {
            title: 'Bilingual Clarity',
            desc: 'Blend regional Devanagari or native terms alongside English for younger candidates and elder relatives.'
          },
          {
            title: 'Paternal & Maternal Roots',
            desc: 'Include native district, ancestral home, and maternal family connections.'
          },
          {
            title: 'Print-Ready Clean Margins',
            desc: 'Formatted to print cleanly on standard A4 paper without awkward line wraps or chopped margins.'
          }
        ],
        faqs: [
          {
            question: 'Can I type in regional script on BiodataCraft?',
            answer: 'Yes! Our platform fully supports Unicode fonts and mobile regional keyboards so you can type in your native language.'
          },
          {
            question: 'Is BiodataCraft free for regional biodatas?',
            answer: 'Yes, 100% free with no watermark and no customer registration required.'
          }
        ],
        recommendedTemplateIds: ['vedic-aura', 'peacock-glory', 'royal-heritage'],
        suggestedSample: 'hindu',
        relatedSlugs
      };

    case 'devanagari-hindi':
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} - नि:शुल्क ऑनलाइन प्रारूप एवं पीडीएफ | BiodataCraft`,
        metaDescription: `सुंदर एवं शुद्ध हिन्दी में ${keyword} बनाएं। मांगलिक, गोत्र, ननिहाल पक्ष, जन्म विवरण सहित। 100% नि:शुल्क, बिना लॉगिन, A4 पीडीएफ तुरंत डाउनलोड करें।`,
        h1: formattedName,
        tagline: 'शुद्ध हिन्दी देवनागरी विवाह परिचय पत्र एवं बायोडाटा',
        culturalContext: `भारतीय वैवाहिक संस्कृति में शुद्ध हिन्दी एवं देवनागरी लिपि में निर्मित बायोडेटा आदर, संस्कार एवं पारिवारिक मर्यादा का प्रतीक माना जाता है। इसमें वर या वधू के व्यक्तिगत विवरण के साथ कुल गोत्र, ननिहाल पक्ष और जन्म पत्रिका का स्पष्ट उल्लेख रहता है।`,
        keyChecklist: [
          {
            title: 'व्यक्तिगत एवं शैक्षणिक विवरण',
            desc: 'नाम, जन्म तिथि, शारीरिक कद (ऊंचाई), उच्च शिक्षा एवं वर्तमान नौकरी का स्पष्ट विवरण।'
          },
          {
            title: 'जन्म समय एवं कुंडली विवरण',
            desc: 'जन्म का सही समय (प्रातः/सायं), जन्म स्थान, राशि, नक्षत्र एवं मांगलिक स्थिति।'
          },
          {
            title: 'पारिवारिक एवं ननिहाल पक्ष',
            desc: 'पिता एवं माता का व्यवसाय, भाई-बहनों का विवरण, तथा मामा जी (ननिहाल) का नाम व गोत्र।'
          },
          {
            title: 'संपर्क एवं निवास का पता',
            desc: 'परिवार के मुखिया का मोबाइल नंबर, स्थायी निवास पता एवं व्हाट्सएप नंबर।'
          }
        ],
        faqs: [
          {
            question: 'हिन्दी में बायोडेटा कैसे टाइप करें?',
            answer: 'आप अपने मोबाइल के हिन्दी कीबोर्ड से या कम्प्यूटर पर गूगल इनपुट टूल्स की सहायता से सीधे हिन्दी में टाइप कर सकते हैं।'
          },
          {
            question: 'क्या हिन्दी बायोडेटा में फोटो लगाना आवश्यक है?',
            answer: 'बायोडेटा में एक सुंदर, शालीन एवं हाल ही की स्पष्ट फोटो लगाने से पारिवारिक स्वीकृति की संभावना कई गुना बढ़ जाती है।'
          },
          {
            question: 'क्या पीडीएफ डाउनलोड करने पर कोई शुल्क या वॉटरमार्क लगेगा?',
            answer: 'बिल्कुल नहीं! BiodataCraft पूरी तरह नि:शुल्क है और बिना किसी वॉटरमार्क के उच्च गुणवत्ता वाली A4 शीट पीडीएफ डाउनलोड होती है।'
          }
        ],
        recommendedTemplateIds: ['vedic-aura', 'royal-heritage'],
        suggestedSample: 'hindi',
        relatedSlugs
      };

    default:
      return {
        slug,
        keyword,
        category: matchedCat.name,
        categoryId: matchedCat.id,
        categoryHindi: matchedCat.hindiName,
        title: `${formattedName} - Free Format & PDF Maker | BiodataCraft`,
        metaDescription: `Design a distinguished ${keyword} in minutes. Comprehensive checklist, horoscope compatibility, elegant borders, and instant A4 PDF export with zero watermark.`,
        h1: formattedName,
        tagline: 'Auspicious, Elegant & Privacy-First Matrimonial Biodata Maker',
        culturalContext: `A well-crafted ${keyword} is often the very first introduction between two families. Presenting candidate qualifications, family heritage, and personal aspirations with dignity creates an immediate lasting impression of grace and cultural harmony.`,
        keyChecklist: [
          {
            title: 'Complete Personal Information',
            desc: 'Full name, date of birth, height, complexion, hobbies, and direct candidate bio.'
          },
          {
            title: 'Astrological Kundali Matching',
            desc: 'Accurate birth coordinates, gotra, manglik status, and horoscope summary.'
          },
          {
            title: 'Academic & Professional Credentials',
            desc: 'Degrees, current job role, company name, workplace city, and package details.'
          },
          {
            title: 'Ancestral Lineage & Mosal Background',
            desc: 'Father, mother, siblings, and maternal uncle (Mama Ji) origins.'
          }
        ],
        faqs: [
          {
            question: `How long does it take to create a ${formattedName}?`,
            answer: 'Just 3 to 5 minutes! Select any of our authentic templates, fill in your details with live preview, and download your free print-ready A4 PDF immediately.'
          },
          {
            question: 'Is my photograph secure on BiodataCraft?',
            answer: 'Yes! Your photos and data are processed locally in your web browser. Nothing is ever sent to or stored on remote cloud servers.'
          },
          {
            question: 'Can I print on standard A4 paper without headers and footers?',
            answer: "Yes. In your browser print settings, simply uncheck 'Headers and footers' to obtain a pristine A4 matrimonial sheet."
          }
        ],
        recommendedTemplateIds: ['royal-heritage', 'modern-elegance', 'vedic-aura'],
        suggestedSample: 'hindu',
        relatedSlugs
      };
  }
}
