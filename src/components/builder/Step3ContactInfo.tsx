import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Input, Textarea, Select } from '../ui/Form';
import { Phone, Mail, MapPin, User, MessageCircle, Copy } from 'lucide-react';

interface Step3ContactInfoProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  errors: Record<string, string>;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Other / NRI'
];

export const Step3ContactInfo: React.FC<Step3ContactInfoProps> = ({
  data,
  onChange,
  errors
}) => {
  const handleCopyMobileToWhatsapp = () => {
    if (data.mobileNumber) {
      onChange({ whatsappNumber: data.mobileNumber });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-bold text-stone-900 font-cinzel flex items-center gap-2">
          <Phone className="w-5 h-5 text-amber-800" />
          <span>Step 3: Contact & Communication Details</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Enter direct communication channels, guardian details, and residential postal coordinates.
        </p>
      </div>

      {/* 1. Phone & WhatsApp */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Phone & Messaging
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Primary Mobile Number"
              required
              placeholder="+91 98290 12345"
              value={data.mobileNumber}
              onChange={(e) => onChange({ mobileNumber: e.target.value })}
              error={errors.mobileNumber}
              hint="10-digit Indian mobile number (e.g. +91 9829012345 or 9829012345)"
              leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">
                WhatsApp Number
              </label>
              <button
                type="button"
                onClick={handleCopyMobileToWhatsapp}
                className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Same as Mobile</span>
              </button>
            </div>
            <Input
              placeholder="+91 98290 12345"
              value={data.whatsappNumber}
              onChange={(e) => onChange({ whatsappNumber: e.target.value })}
              leftIcon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sharma.matrimonial.jaipur@gmail.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
              hint="For sending detailed bio-data, horoscopes, and photographs"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Person & Guardian */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Point of Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Person Name"
            required
            placeholder="e.g. Dr. Devendra Sharma (Father)"
            value={data.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            error={errors.contactPerson}
            leftIcon={<User className="w-4 h-4 text-stone-400" />}
            hint="Primary person who will handle matrimonial phone inquiries"
          />

          <Select
            label="Relationship with Candidate"
            value={data.relationWithCandidate || 'Father'}
            onChange={(e) => onChange({ relationWithCandidate: e.target.value })}
            options={[
              { value: 'Father', label: 'Father (पिताजी)' },
              { value: 'Mother', label: 'Mother (माताजी)' },
              { value: 'Brother', label: 'Brother (भाई)' },
              { value: 'Self', label: 'Self (स्वयं)' },
              { value: 'Guardian', label: 'Guardian / Uncle' }
            ]}
          />
        </div>
      </div>

      {/* 3. Residential Address Coordinates */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Residential Address
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Textarea
              label="House / Street Address"
              placeholder="e.g. B-14, Surya Enclave, Vaishali Nagar"
              value={data.residentialAddress}
              onChange={(e) => onChange({ residentialAddress: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Input
              label="City"
              placeholder="e.g. Jaipur"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <Select
              label="State"
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              options={[
                { value: '', label: '-- Select State --' },
                ...INDIAN_STATES.map((s) => ({ value: s, label: s }))
              ]}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Pincode"
              placeholder="e.g. 302021"
              value={data.pincode}
              onChange={(e) => onChange({ pincode: e.target.value })}
              error={errors.pincode}
              hint="6-digit Indian Postal PIN Code"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
