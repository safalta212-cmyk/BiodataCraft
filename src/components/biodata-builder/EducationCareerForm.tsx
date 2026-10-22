import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Briefcase, GraduationCap, Building2, IndianRupee, MapPin } from 'lucide-react';

interface EducationCareerFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const EducationCareerForm: React.FC<EducationCareerFormProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-800" />
          <span>{isHindi ? 'शिक्षा एवं करियर विवरण' : 'Education & Career'}</span>
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {isHindi
            ? 'उच्चतम डिग्री, कॉलेज, वर्तमान पद, कंपनी तथा वार्षिक आय'
            : 'Academic qualifications, university, current designation, and annual package'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Highest Education */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'उच्चतम शिक्षा (Highest Qualification) *' : 'Highest Qualification *'}</span>
          </label>
          <input
            type="text"
            value={data.highestEducation}
            onChange={(e) => onChange({ highestEducation: e.target.value })}
            placeholder={isHindi ? 'उदा. B.Tech in Computer Science / MBA' : 'e.g. B.Tech in CS / MBBS / CA / MBA'}
            className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* College / University */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'कॉलेज / विश्वविद्यालय (College / University)' : 'College / University'}
          </label>
          <input
            type="text"
            value={data.collegeUniversity}
            onChange={(e) => onChange({ collegeUniversity: e.target.value })}
            placeholder={isHindi ? 'उदा. IIT Delhi / दिल्ली विश्वविद्यालय' : 'e.g. IIT Delhi / Delhi University'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Additional Degrees */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'अन्य शैक्षणिक योग्यताएं (Additional Degrees / Schooling)' : 'Additional Qualifications'}
          </label>
          <input
            type="text"
            value={data.additionalDegrees}
            onChange={(e) => onChange({ additionalDegrees: e.target.value })}
            placeholder={isHindi ? 'उदा. CFA Level 2, Schooling from DPS R.K. Puram' : 'e.g. Executive MBA, Schooling from St. Xavier\'s'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Job Title / Role */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'पद / पदनाम (Designation / Role) *' : 'Designation / Job Title *'}</span>
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            placeholder={isHindi ? 'उदा. सीनियर सॉफ्टवेयर इंजीनियर, बैंक मैनेजर' : 'e.g. Senior Software Engineer / Manager / Doctor'}
            className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Company / Employer */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'कंपनी / संगठन का नाम (Company / Employer)' : 'Company / Employer'}</span>
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder={isHindi ? 'उदा. Microsoft India, SBI, खुद का व्यवसाय' : 'e.g. Microsoft / HDFC / Own Business / Govt. Dept'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'वार्षिक पैकेज (Annual Income)' : 'Annual Income / Package'}</span>
          </label>
          <input
            type="text"
            value={data.annualIncome}
            onChange={(e) => onChange({ annualIncome: e.target.value })}
            placeholder={isHindi ? 'उदा. ₹ 24,00,000 प्रति वर्ष (24 LPA)' : 'e.g. ₹ 24,00,000 P.A. or 24 LPA'}
            className="w-full text-sm font-medium border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Work Location */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'कार्यस्थल / शहर (Work Location)' : 'Work Location'}</span>
          </label>
          <input
            type="text"
            value={data.workLocation}
            onChange={(e) => onChange({ workLocation: e.target.value })}
            placeholder={isHindi ? 'उदा. बेंगलुरु / गुरुग्राम / लंदन' : 'e.g. Bengaluru / Delhi NCR / Mumbai / London'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
