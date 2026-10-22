import React, { useState } from 'react';
import { BiodataData } from '../../types/biodata';
import { Phone, Mail, MapPin, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { INDIAN_STATES, validationUtils } from '../../utils/validation';

interface Step3ContactFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
  errors?: Record<string, string>;
}

const RELATION_OPTIONS = [
  'Father (पिता)',
  'Mother (माता)',
  'Brother (भाई)',
  'Uncle / Relative (चाचा/मामा/अभिभावक)',
  'Self (उम्मीदवार स्वयं)'
];

export const Step3ContactForm: React.FC<Step3ContactFormProps> = ({
  data,
  onChange,
  language,
  errors = {}
}) => {
  const isHindi = language === 'hi';
  const [sameAsMobile, setSameAsMobile] = useState<boolean>(
    Boolean(data.mobileNumber && data.whatsappNumber && data.mobileNumber === data.whatsappNumber)
  );

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const updates: Partial<BiodataData> = { mobileNumber: val };
    if (sameAsMobile) {
      updates.whatsappNumber = val;
    }
    onChange(updates);
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      onChange({ whatsappNumber: data.mobileNumber });
    }
  };

  const isMobileValid = validationUtils.isValidIndianMobile(data.mobileNumber);
  const isEmailValid = !data.email || validationUtils.isValidEmail(data.email);
  const isPinValid = !data.pincode || validationUtils.isValidIndianPincode(data.pincode);

  return (
    <div className="space-y-6">
      {/* 1. Primary Contact Person & Numbers Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-800 shrink-0" />
              <span>{isHindi ? 'संपर्क व्यक्ति व दूरभाष (Contact Person & Numbers)' : 'Contact Person & Phone Numbers'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi ? 'विवाह प्रस्ताव हेतु मुख्य संपर्क व्यक्ति एवं दूरभाष नंबर' : 'Primary point of contact for matrimonial correspondence'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
            * {isHindi ? 'अनिवार्य' : 'Required'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Person Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'संपर्क व्यक्ति का नाम (Contact Person) *' : 'Contact Person Name *'}</span>
            </label>
            <input
              type="text"
              value={data.contactPerson}
              onChange={(e) => onChange({ contactPerson: e.target.value })}
              placeholder={isHindi ? 'उदा. डॉ. राजेन्द्र कुमार शर्मा' : 'e.g. Dr. Devendra Sharma'}
              className={`w-full text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.contactPerson
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.contactPerson && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.contactPerson}</span>
              </p>
            )}
          </div>

          {/* Relation with Candidate */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'उम्मीदवार से संबंध (Relationship)' : 'Relationship with Candidate'}
            </label>
            <select
              value={data.relationWithCandidate || 'Father'}
              onChange={(e) => onChange({ relationWithCandidate: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              {RELATION_OPTIONS.map((r) => (
                <option key={r} value={r.split(' ')[0]}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number (with Indian validation) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                {isHindi ? 'मोबाइल नंबर (Mobile Number) *' : 'Primary Mobile Number *'}
              </label>
              {data.mobileNumber && (
                <span
                  className={`text-[10px] font-semibold flex items-center gap-1 ${
                    isMobileValid ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {isMobileValid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Valid Indian Mobile</span>
                    </>
                  ) : (
                    <span>10 Digits (Starts 6-9)</span>
                  )}
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-stone-500">
                +91
              </div>
              <input
                type="tel"
                value={(data.mobileNumber || '').replace(/^(\+91|91)/, '').trim()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                  handleMobileChange({ target: { value: raw } } as any);
                }}
                placeholder="9829012345"
                maxLength={10}
                className={`w-full pl-11 text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                  errors.mobileNumber
                    ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                    : isMobileValid
                    ? 'border-emerald-500 focus:border-emerald-600'
                    : 'border-stone-300 focus:border-amber-800'
                }`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.mobileNumber}</span>
              </p>
            )}
          </div>

          {/* WhatsApp Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                {isHindi ? 'व्हाट्सएप नंबर (WhatsApp Number)' : 'WhatsApp Number'}
              </label>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsMobile}
                  onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                  className="rounded text-amber-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span>{isHindi ? 'मोबाइल के समान' : 'Same as Mobile'}</span>
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-stone-500">
                +91
              </div>
              <input
                type="tel"
                disabled={sameAsMobile}
                value={(data.whatsappNumber || '').replace(/^(\+91|91)/, '').trim()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                  onChange({ whatsappNumber: raw });
                }}
                placeholder="9829012345"
                maxLength={10}
                className="w-full pl-11 text-sm border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white disabled:bg-stone-50 disabled:text-stone-500"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'ईमेल पता (Email Address)' : 'Email Address'}</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="e.g. sharma.matrimonial@gmail.com"
              className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Address & Postal Details Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-800" />
              <span>{isHindi ? 'निवास व पत्राचार का पता (Residential Address)' : 'Address & Location Details'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi ? 'घर का पता, शहर, राज्य एवं 6-अंकीय पिन कोड' : 'House address, city, state, and 6-digit postal PIN code'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            * {isHindi ? 'अनिवार्य' : 'Required'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Address Street / Locality */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'गली / मकान नं. / कॉलोनी (Street Address) *' : 'Address (Street / Society / House No.) *'}
            </label>
            <textarea
              rows={2}
              value={data.residentialAddress}
              onChange={(e) => onChange({ residentialAddress: e.target.value })}
              placeholder={isHindi ? 'उदा. मकान संख्या B-42, शांति निकेतन कॉलोनी' : 'e.g. B-42, Shanti Niketan Colony, Malviya Nagar'}
              className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.residentialAddress
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.residentialAddress && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.residentialAddress}</span>
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'शहर (City) *' : 'City *'}
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder={isHindi ? 'उदा. जयपुर / दिल्ली / पुणे' : 'e.g. Jaipur / Pune / Delhi'}
              className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.city
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.city && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'राज्य (State) *' : 'State *'}
            </label>
            <select
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.state
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            >
              <option value="">{isHindi ? '-- राज्य चुनें --' : '-- Select State --'}</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.state}</span>
              </p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                {isHindi ? 'पिन कोड (Pincode) *' : 'PIN Code *'}
              </label>
              {data.pincode && (
                <span className={`text-[10px] font-semibold ${isPinValid ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {isPinValid ? '✓ 6 Digits' : 'Invalid PIN'}
                </span>
              )}
            </div>

            <input
              type="text"
              maxLength={6}
              value={data.pincode || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                onChange({ pincode: raw });
              }}
              placeholder="302020"
              className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.pincode
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : isPinValid && Boolean(data.pincode && data.pincode.length === 6)
                  ? 'border-emerald-500 focus:border-emerald-600'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.pincode && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.pincode}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
