import React from 'react';
import { CampaignInputs } from '../types';

interface InputSectionProps {
  inputs: CampaignInputs;
  setInputs: React.Dispatch<React.SetStateAction<CampaignInputs>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputField = ({ label, value, onChange, placeholder, isTextArea = false }: { 
  label: string; 
  value: string; 
  onChange: (e: string) => void; 
  placeholder: string;
  isTextArea?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase tracking-wider text-swiss-darkGray">{label}</label>
    {isTextArea ? (
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-swiss-gray p-4 text-sm outline-none focus:ring-2 focus:ring-swiss-black min-h-[100px] resize-none border border-transparent transition-all"
      />
    ) : (
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-swiss-gray p-4 text-sm outline-none focus:ring-2 focus:ring-swiss-black border border-transparent transition-all"
      />
    )}
  </div>
);

export const InputSection: React.FC<InputSectionProps> = ({ inputs, setInputs, onSubmit, isLoading }) => {
  const handleChange = (field: keyof CampaignInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="1. Brand Name" 
          value={inputs.brandName} 
          onChange={(v) => handleChange('brandName', v)}
          placeholder="e.g. Aquila Dynamics"
        />
        <InputField 
          label="2. Industry / Niche" 
          value={inputs.industry} 
          onChange={(v) => handleChange('industry', v)}
          placeholder="e.g. AI Fitness Personalized"
        />
      </div>

      <InputField 
        label="3. Tone of Voice" 
        value={inputs.tone} 
        onChange={(v) => handleChange('tone', v)}
        placeholder="e.g. Relatable, FAB framework, Genuine"
      />

      <InputField 
        label="4. Target Audience" 
        value={inputs.audience} 
        onChange={(v) => handleChange('audience', v)}
        placeholder="e.g. Busy workers needing routines"
      />

      <InputField 
        label="5. Product Description" 
        value={inputs.productDescription} 
        onChange={(v) => handleChange('productDescription', v)}
        placeholder="e.g. App that personalises workouts via smart wear"
        isTextArea
      />

      <InputField 
        label="6. Goal / Ethos" 
        value={inputs.goal} 
        onChange={(v) => handleChange('goal', v)}
        placeholder="e.g. Ethical investment for any customer"
      />

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-5 bg-swiss-black text-white text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </>
        ) : (
          'Initialize Campaign Engine'
        )}
      </button>
    </div>
  );
};