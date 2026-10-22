import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Phone, Mail, MapPin, HeartHandshake } from 'lucide-react';

interface ContactPreferencesFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const ContactPreferencesForm: React.FC<ContactPreferencesFormProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="space-y-6">
      {/* 1. Contact Information Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'संपर्क सूत्र (Contact Details)' : 'Contact Information'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi
              ? 'प्रस्ताव हेतु संपर्क सूत्र, फोन नंबर व पत्राचार का पता'
              : 'Direct communication channels for matrimonial correspondence'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Person */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'संपर्क व्यक्ति का नाम (Contact Person) *' : 'Contact Person *'}
            </label>
            <input
              type="text"
              value={data.contactPerson}
              onChange={(e) => onChange({ contactPerson: e.target.value })}
              placeholder={isHindi ? 'उदा. डॉ. देवेन्द्र शर्मा (पिताजी)' : 'e.g. Dr. Devendra Sharma (Father)'}
              className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Relation with Candidate */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'उम्मीदवार से संबंध (Relationship)' : 'Relationship with Candidate'}
            </label>
            <select
              value={data.relationWithCandidate}
              onChange={(e) => onChange({ relationWithCandidate: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              <option value="Father">{isHindi ? 'पिता (Father)' : 'Father'}</option>
              <option value="Mother">{isHindi ? 'माता (Mother)' : 'Mother'}</option>
              <option value="Brother">{isHindi ? 'भाई (Brother)' : 'Brother'}</option>
              <option value="Self">{isHindi ? 'स्वयं (Self)' : 'Self'}</option>
              <option value="Guardian">{isHindi ? 'अभिभावक (Guardian)' : 'Guardian'}</option>
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'प्राथमिक मोबाइल नंबर (Primary Mobile) *' : 'Primary Mobile *'}</span>
            </label>
            <input
              type="tel"
              value={data.mobileNumber}
              onChange={(e) => onChange({ mobileNumber: e.target.value })}
              placeholder="+91 98290 12345"
              className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'व्हाट्सएप नंबर (WhatsApp Number)' : 'WhatsApp Number'}
            </label>
            <input
              type="tel"
              value={data.whatsappNumber}
              onChange={(e) => onChange({ whatsappNumber: e.target.value })}
              placeholder="+91 98290 12345"
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'ईमेल (Email Address)' : 'Email Address'}</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="e.g. sharma.family.jaipur@gmail.com"
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Residential Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'निवास का पूरा पता (Address)' : 'Residential Address'}</span>
            </label>
            <textarea
              rows={2}
              value={data.residentialAddress}
              onChange={(e) => onChange({ residentialAddress: e.target.value })}
              placeholder={isHindi ? 'मकान नं., कॉलोनी, शहर, पिन कोड' : 'House No., Locality, City, State, PIN Code'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Partner Preferences Card (Optional) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-800" />
              <span>{isHindi ? 'जीवनसाथी की अपेक्षाएं (Partner Preferences)' : 'Partner Expectations (Optional)'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'वर/वधू से जुड़ी सामान्य प्राथमिकताएं'
                : 'Desired partner traits, age preferences, education, and location'}
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-600 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
            <input
              type="checkbox"
              checked={data.sectionsVisible.preferences}
              onChange={(e) =>
                onChange({
                  sectionsVisible: {
                    ...data.sectionsVisible,
                    preferences: e.target.checked
                  }
                })
              }
              className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4 cursor-pointer"
            />
            <span>{isHindi ? 'बायोडेटा में शामिल करें' : 'Include in Biodata'}</span>
          </label>
        </div>

        {data.sectionsVisible.preferences && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'आयु वर्ग (Preferred Age Range)' : 'Preferred Age Range'}
              </label>
              <input
                type="text"
                value={data.partnerAgeRange || ''}
                onChange={(e) => onChange({ partnerAgeRange: e.target.value })}
                placeholder="e.g. 24 - 28 Years"
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'ऊंचाई वर्ग (Preferred Height Range)' : 'Preferred Height Range'}
              </label>
              <input
                type="text"
                value={data.partnerHeightRange || ''}
                onChange={(e) => onChange({ partnerHeightRange: e.target.value })}
                placeholder={"e.g. 5'3\" to 5'8\""}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'अपेक्षित शिक्षा (Education)' : 'Education Preference'}
              </label>
              <input
                type="text"
                value={data.partnerEducation || ''}
                onChange={(e) => onChange({ partnerEducation: e.target.value })}
                placeholder="e.g. Engineer / Doctor / CA / MBA / Graduate"
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'शहर / कार्यक्षेत्र (Location)' : 'Location Preference'}
              </label>
              <input
                type="text"
                value={data.partnerLocation || ''}
                onChange={(e) => onChange({ partnerLocation: e.target.value })}
                placeholder="e.g. Delhi NCR / Rajasthan / Metro Cities"
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'संक्षिप्त अपेक्षाएं / टिप्पणी (Notes)' : 'Expectations / Family Notes'}
              </label>
              <textarea
                rows={2}
                value={data.partnerExpectationsNotes || ''}
                onChange={(e) => onChange({ partnerExpectationsNotes: e.target.value })}
                placeholder={isHindi ? 'उदा. सुसंस्कृत, परिवार का आदर करने वाले सुयोग्य जीवनसाथी की तलाश।' : 'e.g. Seeking a cultured, broad-minded, and family-oriented companion.'}
                className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
