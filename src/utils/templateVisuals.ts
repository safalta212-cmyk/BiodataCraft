import { Template } from '../types/template';

/**
 * Generates an authentic, high-fidelity SVG preview card data URI
 * based on template colors, typography headers, and cultural motifs.
 */
export function generateTemplateSvgDataUri(
  title: string,
  primaryColor = '#7a1426',
  secondaryColor = '#c59b27',
  accentBg = '#fffaf5',
  style = 'Royal',
  headerTitle = '॥ श्री गणेशाय नमः ॥'
): string {
  const safeTitle = (title || 'Matrimonial Biodata').replace(/[<>&"]/g, '');
  const safeHeader = (headerTitle || '॥ श्री गणेशाय नमः ॥').replace(/[<>&"]/g, '');
  const safeStyle = (style || 'Royal').replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.92" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${secondaryColor}" />
      <stop offset="50%" stop-color="#fff2c6" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
  </defs>
  <rect width="400" height="560" fill="url(#bg)" rx="16" />
  <rect x="14" y="14" width="372" height="532" fill="none" stroke="url(#gold)" stroke-width="2.5" rx="12" />
  <rect x="22" y="22" width="356" height="516" fill="none" stroke="${secondaryColor}" stroke-opacity="0.4" stroke-width="1" rx="8" />
  <circle cx="22" cy="22" r="5" fill="${secondaryColor}" />
  <circle cx="378" cy="22" r="5" fill="${secondaryColor}" />
  <circle cx="22" cy="538" r="5" fill="${secondaryColor}" />
  <circle cx="378" cy="538" r="5" fill="${secondaryColor}" />
  <rect x="36" y="36" width="328" height="488" fill="${accentBg}" rx="8" opacity="0.96" />
  <rect x="42" y="42" width="316" height="476" fill="none" stroke="${secondaryColor}" stroke-opacity="0.45" stroke-dasharray="4 3" rx="6" />
  <circle cx="200" cy="80" r="20" fill="${primaryColor}" fill-opacity="0.12" />
  <text x="200" y="86" font-family="serif" font-size="18" fill="${primaryColor}" text-anchor="middle">卐</text>
  <text x="200" y="122" font-family="serif" font-size="11" font-weight="bold" fill="${primaryColor}" letter-spacing="1" text-anchor="middle">${safeHeader}</text>
  <line x1="80" y1="135" x2="320" y2="135" stroke="${secondaryColor}" stroke-width="1.5" />
  <text x="200" y="172" font-family="'Cinzel', 'Georgia', serif" font-size="19" font-weight="bold" fill="${primaryColor}" text-anchor="middle">${safeTitle}</text>
  <text x="200" y="196" font-family="'Cinzel', serif" font-size="10" font-weight="600" fill="${secondaryColor}" letter-spacing="2" text-anchor="middle">${safeStyle.toUpperCase()} BIODATA DESIGN</text>
  <rect x="60" y="224" width="130" height="8" rx="4" fill="${primaryColor}" fill-opacity="0.2" />
  <rect x="60" y="242" width="110" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="60" y="256" width="125" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="60" y="270" width="95" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="60" y="296" width="130" height="8" rx="4" fill="${primaryColor}" fill-opacity="0.2" />
  <rect x="60" y="314" width="120" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="60" y="328" width="105" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="220" y="224" width="120" height="150" rx="8" fill="${primaryColor}" fill-opacity="0.08" stroke="${secondaryColor}" stroke-width="1.5" />
  <circle cx="280" cy="280" r="26" fill="${primaryColor}" fill-opacity="0.18" />
  <path d="M 254 340 C 254 310 306 310 306 340 Z" fill="${primaryColor}" fill-opacity="0.18" />
  <line x1="60" y1="398" x2="340" y2="398" stroke="${secondaryColor}" stroke-width="1" stroke-opacity="0.5" />
  <rect x="60" y="412" width="140" height="8" rx="4" fill="${primaryColor}" fill-opacity="0.2" />
  <rect x="60" y="430" width="280" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <rect x="60" y="444" width="250" height="6" rx="3" fill="#555" fill-opacity="0.2" />
  <!-- Bottom Origin Badge / Identifier -->
  <rect x="110" y="476" width="180" height="20" rx="10" fill="${primaryColor}" />
  <text x="200" y="490" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="white" letter-spacing="1" text-anchor="middle">A4 PRINT READY</text>
  <!-- From Identifier / Brand Origin Label -->
  <rect x="70" y="502" width="260" height="20" rx="10" fill="${secondaryColor}" fill-opacity="0.2" />
  <text x="200" y="516" font-family="'Cinzel', 'Georgia', serif" font-size="9" font-weight="bold" fill="${primaryColor}" letter-spacing="1.5" text-anchor="middle">FROM BIODATACRAFT • BIODATACRAFT.IN</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a guaranteed valid thumbnail URL for any template.
 * If the template has a custom uploaded image (data URL or http/https), it returns it.
 * If the template points to an unhosted dummy path or has no thumbnail, returns
 * an authentic SVG preview vector.
 */
export function getTemplateDisplayThumbnail(template: Template): string {
  if (
    template.thumbnail &&
    !template.thumbnail.startsWith('/templates/') &&
    (template.thumbnail.startsWith('http://') ||
      template.thumbnail.startsWith('https://') ||
      template.thumbnail.startsWith('data:image/'))
  ) {
    return template.thumbnail;
  }

  if (
    template.previewImage &&
    !template.previewImage.startsWith('/templates/') &&
    (template.previewImage.startsWith('http://') ||
      template.previewImage.startsWith('https://') ||
      template.previewImage.startsWith('data:image/'))
  ) {
    return template.previewImage;
  }

  return generateTemplateSvgDataUri(
    template.name,
    template.templateConfig?.primaryColor,
    template.templateConfig?.secondaryColor,
    template.templateConfig?.accentBg,
    template.style,
    template.templateConfig?.defaultHeaderTitle
  );
}
