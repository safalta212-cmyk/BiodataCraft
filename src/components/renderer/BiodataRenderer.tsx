import React from 'react';
import { BiodataData } from '../../types/biodata';
import { TemplateConfig } from '../../types/template';
import { INITIAL_TEMPLATES } from '../../data/templateData';
import { TEMPLATES } from '../../data/initialBiodata';

import { BiodataPage } from './BiodataPage';
import { BiodataHeader } from './BiodataHeader';
import { BiodataFooter } from './BiodataFooter';
import { BiodataSection } from './BiodataSection';
import { BiodataField } from './BiodataField';
import { BiodataPhoto } from './BiodataPhoto';

import {
  User,
  GraduationCap,
  Users,
  Phone,
  Compass,
  Heart,
  FileText
} from 'lucide-react';

export interface BiodataRendererProps {
  data: BiodataData;
  templateConfig?: TemplateConfig;
  scale?: number;
  id?: string;
  isPrintMode?: boolean;
  pageMode?: 'auto' | 'single' | 'multi';
  className?: string;
  onPageCountChange?: (pages: number) => void;
}

/**
 * Helper to resolve template configuration safely
 */
export function resolveTemplateConfig(
  templateId: string,
  overrideConfig?: Partial<TemplateConfig>
): TemplateConfig {
  const match =
    INITIAL_TEMPLATES.find((t) => t.slug === templateId || t.id === templateId) ||
    INITIAL_TEMPLATES[0];

  const fallbackTmpl =
    TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  const baseConfig: TemplateConfig = match?.templateConfig || {
    primaryColor: fallbackTmpl.primaryColor,
    secondaryColor: fallbackTmpl.secondaryColor,
    accentBg: fallbackTmpl.accentBg,
    cardBorder: fallbackTmpl.cardBorder,
    fontFamily: 'cinzel',
    borderStyle: 'ornate',
    cornerStyle: 'fluted',
    headerStyle: 'royal',
    defaultSymbol: 'ganesh',
    defaultHeaderTitle: '॥ श्री गणेशाय नमः ॥',
    photoFrameStyle: 'arch',
    columns: 2
  };

  return {
    ...baseConfig,
    ...overrideConfig
  };
}

/**
 * Reusable BiodataRenderer component
 * Implements Phase 5 Live Biodata Preview requirements:
 * 1. Live preview
 * 2. Desktop preview
 * 3. Mobile preview
 * 4. A4 document proportions
 * 5. Correct image rendering
 * 6. Hindi Unicode support
 * 7. Long text wrapping
 * 8. Long addresses without overflow
 * 9. Long family information without breaking layout
 * 10. Empty fields do not produce ugly blank sections
 * 11. Optional sections disappear when empty
 * 12. Custom fields render automatically
 * 13. Multiple pages supported
 * 14. Controlled page breaks
 * 15. Template-specific styles
 */
const BiodataRendererComponent: React.FC<BiodataRendererProps> = ({
  data,
  templateConfig: explicitConfig,
  scale = 1,
  id = 'biodata-print-container',
  isPrintMode = false,
  pageMode = 'auto',
  className = '',
  onPageCountChange
}) => {
  // 1. Resolve template configuration
  const config = resolveTemplateConfig(data.templateId, explicitConfig);

  const primaryColor = data.themeColor || config.primaryColor;
  const secondaryColor = config.secondaryColor;
  const activeFont = data.fontFamily || config.fontFamily || 'cinzel';

  const isHindi = data.language === 'hi';
  const isBilingual = data.language === 'bilingual';

  // Font family determination
  const fontClass =
    activeFont === 'cinzel'
      ? 'font-cinzel'
      : activeFont === 'rozha'
      ? 'font-rozha'
      : activeFont === 'playfair'
      ? 'font-playfair'
      : activeFont === 'sans'
      ? 'font-sans'
      : 'font-devanagari';

  // Section style variant based on headerStyle
  const sectionVariant: 'banner' | 'underline' | 'pill' | 'minimal' =
    config.headerStyle === 'royal'
      ? 'banner'
      : config.headerStyle === 'traditional'
      ? 'pill'
      : config.headerStyle === 'minimal'
      ? 'minimal'
      : 'underline';

  // Check section content presence (Requirement 11)
  const hasHoroscope = Boolean(
    data.sectionsVisible?.horoscope !== false &&
      (data.rashi ||
        data.nakshatra ||
        data.gotra ||
        data.kuldevi ||
        data.manglik ||
        data.charan ||
        data.gan ||
        data.nadi ||
        data.customFields?.some((f) => f.section === 'horoscope' && f.value))
  );

  const hasEducationCareer = Boolean(
    data.sectionsVisible?.education !== false &&
      (data.highestEducation ||
        data.collegeUniversity ||
        data.additionalDegrees ||
        data.occupation ||
        data.companyName ||
        data.annualIncome ||
        data.workLocation ||
        data.customFields?.some((f) => f.section === 'education' && f.value))
  );

  const hasFamily = Boolean(
    data.sectionsVisible?.family !== false &&
      (data.fatherName ||
        data.fatherOccupation ||
        data.motherName ||
        data.motherOccupation ||
        (data.brothersList && data.brothersList.length > 0) ||
        (data.sistersList && data.sistersList.length > 0) ||
        data.familyType ||
        data.familyStatus ||
        data.familyLocation ||
        data.familyDescription ||
        data.nativePlace ||
        data.customFields?.some((f) => f.section === 'family' && f.value))
  );

  const hasPreferences = Boolean(
    data.sectionsVisible?.preferences !== false &&
      (data.partnerAgeRange ||
        data.partnerHeightRange ||
        data.partnerEducation ||
        data.partnerOccupation ||
        data.partnerLocation ||
        data.partnerDiet ||
        data.partnerExpectationsNotes ||
        data.customFields?.some((f) => f.section === 'preferences' && f.value))
  );

  const hasContact = Boolean(
    data.sectionsVisible?.contact !== false &&
      (data.contactPerson ||
        data.mobileNumber ||
        data.whatsappNumber ||
        data.email ||
        data.residentialAddress ||
        data.city ||
        data.state ||
        data.pincode ||
        data.customFields?.some((f) => f.section === 'contact' && f.value))
  );

  const generalCustomFields = (data.customFields || []).filter(
    (f) =>
      (!f.section || f.section === 'custom') &&
      Boolean(f.value && f.value.trim())
  );
  const hasGeneralCustom = generalCustomFields.length > 0;

  // Determine pagination (Requirement 13: Multiple pages supported)
  // Calculate content weight
  const brothersCount = data.brothersList?.length || 0;
  const sistersCount = data.sistersList?.length || 0;
  const totalSiblings = brothersCount + sistersCount;
  const hasLongFamilyDesc = Boolean(
    data.familyDescription && data.familyDescription.length > 80
  );
  const hasLongPartnerNotes = Boolean(
    data.partnerExpectationsNotes && data.partnerExpectationsNotes.length > 80
  );
  const totalCustomFieldsCount = data.customFields?.length || 0;

  const isLongBiodata =
    totalSiblings >= 3 ||
    (hasPreferences && hasLongPartnerNotes) ||
    hasLongFamilyDesc ||
    totalCustomFieldsCount >= 4;

  const shouldUseMultiPage =
    pageMode === 'multi' || (pageMode === 'auto' && isLongBiodata);

  const totalPages = shouldUseMultiPage ? 2 : 1;

  // Notify parent of page count if callback provided
  React.useEffect(() => {
    onPageCountChange?.(totalPages);
  }, [totalPages, onPageCountChange]);

  // Section 1: Personal & Astrological Content
  const renderPersonalSection = () => {
    const hasPhoto = Boolean(data.sectionsVisible?.photo !== false && data.photoUrl);

    return (
      <BiodataSection
        title="Personal Details"
        hindiTitle="व्यक्तिगत विवरण"
        icon={<User className="w-3.5 h-3.5" />}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        variant={sectionVariant}
        isHindi={isHindi}
        columns={1}
      >
        <div className={`flex flex-col ${hasPhoto ? 'sm:flex-row gap-4 items-start' : ''}`}>
          {hasPhoto && (
            <div className="shrink-0 mx-auto sm:mx-0 mb-3 sm:mb-0">
              <BiodataPhoto
                photoUrl={data.photoUrl}
                photoConfig={data.photoConfig}
                candidateName={data.fullName || 'Candidate'}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                size={shouldUseMultiPage ? 'md' : 'sm'}
                frameStyleOverride={config.photoFrameStyle}
              />
            </div>
          )}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
            <BiodataField
              label="Gender"
              hindiLabel="लिंग"
              value={
                data.gender
                  ? data.gender === 'male'
                    ? isHindi ? 'वर (पुरुष)' : 'Male'
                    : data.gender === 'female'
                    ? isHindi ? 'कन्या (महिला)' : 'Female'
                    : data.gender
                  : undefined
              }
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Date of Birth"
              hindiLabel="जन्म तिथि"
              value={data.dob ? `${data.dob}${data.age ? ` (${data.age})` : ''}` : undefined}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Time of Birth"
              hindiLabel="जन्म समय"
              value={data.timeOfBirth}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Place of Birth"
              hindiLabel="जन्म स्थान"
              value={data.placeOfBirth}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Height"
              hindiLabel="कद / ऊंचाई"
              value={data.height}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Weight"
              hindiLabel="वजन"
              value={data.weight}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Complexion"
              hindiLabel="रंग-रूप"
              value={data.complexion}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Blood Group"
              hindiLabel="रक्त समूह"
              value={data.bloodGroup}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Marital Status"
              hindiLabel="वैवाहिक स्थिति"
              value={data.maritalStatus}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Mother Tongue"
              hindiLabel="मातृभाषा"
              value={data.motherTongue}
              isHindi={isHindi}
              bilingual={isBilingual}
            />
            <BiodataField
              label="Dietary Habits"
              hindiLabel="खान-पान"
              value={data.dietaryHabits}
              isHindi={isHindi}
              bilingual={isBilingual}
            />

            {/* Custom personal fields */}
            {(data.customFields || [])
              .filter((f) => f.section === 'personal' && f.value)
              .map((f) => (
                <BiodataField
                  key={f.id}
                  label={f.name || f.label || 'Detail'}
                  value={f.value}
                  isHindi={isHindi}
                />
              ))}
          </div>
        </div>
      </BiodataSection>
    );
  };

  // Section 2: Horoscope / Astrological Details
  const renderHoroscopeSection = () => (
    <BiodataSection
      title="Horoscope & Kundali"
      hindiTitle="कुंडली एवं ज्योतिष विवरण"
      icon={<Compass className="w-3.5 h-3.5" />}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      variant={sectionVariant}
      isHindi={isHindi}
      isEmpty={!hasHoroscope}
      columns={config.columns || 2}
    >
      <BiodataField
        label="Religion / Caste"
        hindiLabel="धर्म / जाति"
        value={
          data.religion
            ? `${data.religion}${data.caste ? ` / ${data.caste}` : ''}`
            : undefined
        }
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Sub Caste"
        hindiLabel="उप-जाति"
        value={data.subCaste}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Gotra"
        hindiLabel="गोत्र"
        value={data.gotra}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Kuldevi / Deity"
        hindiLabel="कुलदेवी / इष्टदेव"
        value={data.kuldevi}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Rashi"
        hindiLabel="राशि"
        value={data.rashi}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Nakshatra"
        hindiLabel="नक्षत्र"
        value={data.nakshatra}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Charan"
        hindiLabel="चरण"
        value={data.charan}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Manglik Status"
        hindiLabel="मांगलिक स्थिति"
        value={data.manglik}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Gan / Nadi"
        hindiLabel="गण / नाड़ी"
        value={
          data.gan ? `${data.gan}${data.nadi ? ` / ${data.nadi}` : ''}` : data.nadi
        }
        isHindi={isHindi}
        bilingual={isBilingual}
      />

      {/* Custom horoscope fields */}
      {(data.customFields || [])
        .filter((f) => f.section === 'horoscope' && f.value)
        .map((f) => (
          <BiodataField
            key={f.id}
            label={f.name || f.label || 'Astro Detail'}
            value={f.value}
            isHindi={isHindi}
          />
        ))}
    </BiodataSection>
  );

  // Section 3: Education & Career
  const renderEducationCareerSection = () => (
    <BiodataSection
      title="Education & Profession"
      hindiTitle="शिक्षा एवं व्यवसाय"
      icon={<GraduationCap className="w-3.5 h-3.5" />}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      variant={sectionVariant}
      isHindi={isHindi}
      isEmpty={!hasEducationCareer}
      columns={config.columns || 2}
    >
      <BiodataField
        label="Highest Degree"
        hindiLabel="उच्चतम शिक्षा"
        value={data.highestEducation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="College / University"
        hindiLabel="कॉलेज / संस्थान"
        value={data.collegeUniversity}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Additional Degrees"
        hindiLabel="अन्य योग्यता"
        value={data.additionalDegrees}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Occupation"
        hindiLabel="व्यवसाय / कार्य"
        value={data.occupation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Designation / Role"
        hindiLabel="पद / रोल"
        value={data.jobTitle}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Company / Firm"
        hindiLabel="कंपनी / संस्था"
        value={data.companyName}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Annual Income"
        hindiLabel="वार्षिक आय"
        value={data.annualIncome}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Work Location"
        hindiLabel="कार्य स्थल"
        value={data.workLocation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />

      {/* Custom education fields */}
      {(data.customFields || [])
        .filter((f) => f.section === 'education' && f.value)
        .map((f) => (
          <BiodataField
            key={f.id}
            label={f.name || f.label || 'Education'}
            value={f.value}
            isHindi={isHindi}
          />
        ))}
    </BiodataSection>
  );

  // Section 4: Family Details (Requirement 9: Long family info must not break layout)
  const renderFamilySection = () => (
    <BiodataSection
      title="Family Background"
      hindiTitle="पारिवारिक पृष्ठभूमि"
      icon={<Users className="w-3.5 h-3.5" />}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      variant={sectionVariant}
      isHindi={isHindi}
      isEmpty={!hasFamily}
      columns={1}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
        <BiodataField
          label="Father's Name"
          hindiLabel="पिता का नाम"
          value={data.fatherName}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Father's Occupation"
          hindiLabel="पिता का व्यवसाय"
          value={data.fatherOccupation}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Mother's Name"
          hindiLabel="माता का नाम"
          value={data.motherName}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Mother's Occupation"
          hindiLabel="माता का व्यवसाय"
          value={data.motherOccupation}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Family Type / Status"
          hindiLabel="परिवार प्रकार / स्तर"
          value={
            data.familyType
              ? `${data.familyType}${data.familyStatus ? ` (${data.familyStatus})` : ''}`
              : data.familyStatus
          }
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Native Place"
          hindiLabel="मूल निवास"
          value={data.nativePlace || data.familyLocation}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
      </div>

      {/* Repeatable Brothers List - Requirement 9 */}
      {data.brothersList && data.brothersList.length > 0 && (
        <div className="mt-1.5 pt-1 border-t border-stone-100 break-inside-avoid">
          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wide mb-1">
            {isHindi ? 'भाई का विवरण' : 'Brother(s) Details'}:
          </div>
          <div className="space-y-1">
            {data.brothersList.map((b, idx) => (
              <div
                key={b.id || idx}
                className="flex flex-wrap items-center justify-between text-xs px-2.5 py-1 rounded bg-stone-50/80 border border-stone-200/60"
              >
                <div className="font-semibold text-stone-900 break-words [overflow-wrap:anywhere] mr-2">
                  {b.name || `${isHindi ? 'भाई' : 'Brother'} ${idx + 1}`}
                  {b.relationType && (
                    <span className="text-[10px] text-stone-500 font-normal ml-1">
                      ({b.relationType})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-600">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-medium">
                    {b.maritalStatus}
                  </span>
                  {b.occupation && (
                    <span className="font-medium text-stone-700 break-words">
                      • {b.occupation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repeatable Sisters List - Requirement 9 */}
      {data.sistersList && data.sistersList.length > 0 && (
        <div className="mt-1.5 pt-1 border-t border-stone-100 break-inside-avoid">
          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wide mb-1">
            {isHindi ? 'बहन का विवरण' : 'Sister(s) Details'}:
          </div>
          <div className="space-y-1">
            {data.sistersList.map((s, idx) => (
              <div
                key={s.id || idx}
                className="flex flex-wrap items-center justify-between text-xs px-2.5 py-1 rounded bg-stone-50/80 border border-stone-200/60"
              >
                <div className="font-semibold text-stone-900 break-words [overflow-wrap:anywhere] mr-2">
                  {s.name || `${isHindi ? 'बहन' : 'Sister'} ${idx + 1}`}
                  {s.relationType && (
                    <span className="text-[10px] text-stone-500 font-normal ml-1">
                      ({s.relationType})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-600">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-medium">
                    {s.maritalStatus}
                  </span>
                  {s.occupation && (
                    <span className="font-medium text-stone-700 break-words">
                      • {s.occupation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy/Text sibling fallbacks */}
      {(!data.brothersList || data.brothersList.length === 0) && (data.brothersCount || data.brothersDetails) && (
        <BiodataField
          label="Brothers"
          hindiLabel="भाई"
          value={
            data.brothersCount
              ? `${data.brothersCount}${data.brothersDetails ? ` (${data.brothersDetails})` : ''}`
              : data.brothersDetails
          }
          isHindi={isHindi}
          bilingual={isBilingual}
        />
      )}
      {(!data.sistersList || data.sistersList.length === 0) && (data.sistersCount || data.sistersDetails) && (
        <BiodataField
          label="Sisters"
          hindiLabel="बहन"
          value={
            data.sistersCount
              ? `${data.sistersCount}${data.sistersDetails ? ` (${data.sistersDetails})` : ''}`
              : data.sistersDetails
          }
          isHindi={isHindi}
          bilingual={isBilingual}
        />
      )}

      {/* Maternal Uncle / Mama Details if present */}
      {data.maternalUncleDetails && (
        <BiodataField
          label="Maternal Uncle (Nanihal)"
          hindiLabel="ननिहाल / मामा विवरण"
          value={data.maternalUncleDetails}
          isHindi={isHindi}
          fullWidth={true}
        />
      )}

      {data.familyValues && (
        <BiodataField
          label="Family Values"
          hindiLabel="पारिवारिक मूल्य"
          value={data.familyValues}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
      )}

      {/* Family Description if present */}
      {data.familyDescription && (
        <div className="mt-1 text-xs text-stone-600 italic leading-relaxed break-words [overflow-wrap:anywhere]">
          "{data.familyDescription}"
        </div>
      )}

      {/* Custom family fields */}
      {(data.customFields || [])
        .filter((f) => f.section === 'family' && f.value)
        .map((f) => (
          <BiodataField
            key={f.id}
            label={f.name || f.label || 'Family Detail'}
            value={f.value}
            isHindi={isHindi}
          />
        ))}
    </BiodataSection>
  );

  // Section 5: Partner Preferences (Requirement 11: Disappears when empty)
  const renderPreferencesSection = () => (
    <BiodataSection
      title="Partner Preferences"
      hindiTitle="अपेक्षित जीवनसाथी"
      icon={<Heart className="w-3.5 h-3.5" />}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      variant={sectionVariant}
      isHindi={isHindi}
      isEmpty={!hasPreferences}
      columns={config.columns || 2}
    >
      <BiodataField
        label="Age Range"
        hindiLabel="आयु सीमा"
        value={data.partnerAgeRange}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Height Range"
        hindiLabel="कद सीमा"
        value={data.partnerHeightRange}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Education"
        hindiLabel="शैक्षणिक योग्यता"
        value={data.partnerEducation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Occupation"
        hindiLabel="व्यवसाय / कार्य"
        value={data.partnerOccupation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Location"
        hindiLabel="स्थान / शहर"
        value={data.partnerLocation}
        isHindi={isHindi}
        bilingual={isBilingual}
      />
      <BiodataField
        label="Dietary Habit"
        hindiLabel="खान-पान"
        value={data.partnerDiet}
        isHindi={isHindi}
        bilingual={isBilingual}
      />

      {data.partnerExpectationsNotes && (
        <div className="col-span-full mt-1 p-2 rounded bg-amber-50/60 border border-amber-200/50 text-xs text-stone-700 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span className="font-semibold text-stone-900 block mb-0.5 text-[11px] uppercase tracking-wide">
            {isHindi ? 'अतिरिक्त अपेक्षाएं' : 'Expectations Note'}:
          </span>
          {data.partnerExpectationsNotes}
        </div>
      )}

      {/* Custom preference fields */}
      {(data.customFields || [])
        .filter((f) => f.section === 'preferences' && f.value)
        .map((f) => (
          <BiodataField
            key={f.id}
            label={f.name || f.label || 'Preference'}
            value={f.value}
            isHindi={isHindi}
          />
        ))}
    </BiodataSection>
  );

  // Section 6: Contact Information (Requirement 8: Long addresses must not overflow)
  const renderContactSection = () => {
    // Format full address cleanly
    const addressParts = [
      data.residentialAddress,
      data.city,
      data.state,
      data.pincode ? `PIN: ${data.pincode}` : ''
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');

    return (
      <BiodataSection
        title="Contact Details"
        hindiTitle="संपर्क विवरण"
        icon={<Phone className="w-3.5 h-3.5" />}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        variant={sectionVariant}
        isHindi={isHindi}
        isEmpty={!hasContact}
        columns={config.columns || 2}
      >
        <BiodataField
          label="Contact Person"
          hindiLabel="संपर्क व्यक्ति"
          value={
            data.contactPerson
              ? `${data.contactPerson}${
                  data.relationWithCandidate ? ` (${data.relationWithCandidate})` : ''
                }`
              : undefined
          }
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Primary Mobile"
          hindiLabel="मोबाइल नंबर"
          value={data.mobileNumber}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Alternate Mobile"
          hindiLabel="वैकल्पिक मोबाइल"
          value={data.alternateNumber}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="WhatsApp"
          hindiLabel="व्हाट्सएप"
          value={data.whatsappNumber}
          isHindi={isHindi}
          bilingual={isBilingual}
        />
        <BiodataField
          label="Email Address"
          hindiLabel="ईमेल पता"
          value={data.email}
          isHindi={isHindi}
          bilingual={isBilingual}
        />

        {/* Long Address spanning full width cleanly (Requirement 8) */}
        {fullAddress && (
          <div className="col-span-full pt-1">
            <BiodataField
              label="Address"
              hindiLabel="स्थायी पता"
              value={fullAddress}
              isHindi={isHindi}
              bilingual={isBilingual}
              fullWidth={true}
            />
          </div>
        )}

        {/* Custom contact fields */}
        {(data.customFields || [])
          .filter((f) => f.section === 'contact' && f.value)
          .map((f) => (
            <BiodataField
              key={f.id}
              label={f.name || f.label || 'Contact Detail'}
              value={f.value}
              isHindi={isHindi}
            />
          ))}
      </BiodataSection>
    );
  };

  // Section 7: General Custom Fields (Requirement 12: Custom fields render automatically)
  const renderGeneralCustomSection = () => (
    <BiodataSection
      title="Additional Information"
      hindiTitle="अन्य विशेष विवरण"
      icon={<FileText className="w-3.5 h-3.5" />}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      variant={sectionVariant}
      isHindi={isHindi}
      isEmpty={!hasGeneralCustom}
      columns={config.columns || 2}
    >
      {generalCustomFields.map((f) => (
        <BiodataField
          key={f.id}
          label={f.name || f.label || 'Detail'}
          value={f.value}
          isHindi={isHindi}
        />
      ))}
    </BiodataSection>
  );

  return (
    <div
      id={id}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center'
      }}
      className={`transition-transform duration-200 ${fontClass} ${
        isPrintMode ? 'w-full' : ''
      } ${className}`}
    >
      {/* ================= PAGE 1 ================= */}
      <BiodataPage
        id={`${id}-page-1`}
        templateConfig={config}
        pageNumber={1}
        totalPages={totalPages}
        isPrintMode={isPrintMode}
        showWatermark={data.showWatermark}
      >
        <div>
          {/* Header */}
          <BiodataHeader
            data={data}
            templateConfig={config}
            isHindi={isHindi}
            pageNumber={1}
            totalPages={totalPages}
          />

          {/* Core Sections on Page 1 */}
          {renderPersonalSection()}
          {renderHoroscopeSection()}
          {renderEducationCareerSection()}

          {/* If single page, also include family, contact, preferences, custom */}
          {!shouldUseMultiPage && (
            <>
              {renderFamilySection()}
              {renderPreferencesSection()}
              {renderContactSection()}
              {renderGeneralCustomSection()}
            </>
          )}
        </div>

        {/* Footer */}
        <BiodataFooter
          pageNumber={1}
          totalPages={totalPages}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          isHindi={isHindi}
        />
      </BiodataPage>

      {/* ================= PAGE 2 (If multi-page) ================= */}
      {shouldUseMultiPage && (
        <BiodataPage
          id={`${id}-page-2`}
          templateConfig={config}
          pageNumber={2}
          totalPages={2}
          isPrintMode={isPrintMode}
          showWatermark={data.showWatermark}
          className="mt-6"
        >
          <div>
            {/* Page 2 Running Header */}
            <BiodataHeader
              data={data}
              templateConfig={config}
              isHindi={isHindi}
              isSubsequentPage={true}
              pageNumber={2}
              totalPages={2}
            />

            {/* Page 2 Sections */}
            {renderFamilySection()}
            {renderPreferencesSection()}
            {renderContactSection()}
            {renderGeneralCustomSection()}
          </div>

          {/* Footer */}
          <BiodataFooter
            pageNumber={2}
            totalPages={2}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isHindi={isHindi}
          />
        </BiodataPage>
      )}
    </div>
  );
};

export const BiodataRenderer = React.memo(BiodataRendererComponent);

