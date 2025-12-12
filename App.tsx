import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { OutputDisplay } from './components/OutputDisplay';
import { CampaignInputs, CampaignOutput } from './types';
import { generateCampaign } from './services/geminiService';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CampaignInputs>({
    brandName: '',
    industry: '',
    tone: '',
    audience: '',
    productDescription: '',
    goal: '',
  });

  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Basic validation
    if (!inputs.brandName || !inputs.industry) {
      setError("Brand Name and Industry are required to start.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await generateCampaign(inputs);
      setOutput(result);
    } catch (err) {
      setError("Failed to generate campaign. Please check your API configuration and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-swiss-black selection:bg-swiss-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-swiss-gray">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-swiss-red"></div>
            <h1 className="font-bold text-lg tracking-tight uppercase">Campaign Engine Core</h1>
          </div>
          <div className="text-xs font-mono text-swiss-darkGray uppercase tracking-widest hidden sm:block">
            System Ready
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* Intro */}
        {!output && !loading && (
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Swiss-Style Marketing<br/>Generation System
            </h2>
            <p className="text-swiss-darkGray text-lg">
              Enter your parameters below. The engine will generate a structured, minimalist asset pack ready for deployment.
            </p>
          </div>
        )}

        {/* Input Form - Hide if output exists to focus on results, or keep visible? 
            Let's keep visible but maybe collapsible or just present. 
            For "Swiss Style" functionality, maybe replace inputs with output, with a "Reset" button.
        */}
        
        {!output && (
          <InputSection 
            inputs={inputs} 
            setInputs={setInputs} 
            onSubmit={handleGenerate} 
            isLoading={loading}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-xl mx-auto mt-8 p-4 border border-swiss-red bg-red-50 text-swiss-red text-center text-sm font-bold">
            ERROR: {error}
          </div>
        )}

        {/* Loading State Overlay */}
        {loading && (
          <div className="mt-12 text-center animate-pulse">
            <div className="inline-block w-2 h-2 bg-swiss-black mx-1"></div>
            <div className="inline-block w-2 h-2 bg-swiss-black mx-1 animation-delay-200"></div>
            <div className="inline-block w-2 h-2 bg-swiss-black mx-1 animation-delay-400"></div>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-swiss-darkGray">Computing Assets...</p>
          </div>
        )}

        {/* Results */}
        {output && (
          <div className="animate-fade-in">
             <div className="flex justify-center mb-8">
                <button 
                  onClick={() => setOutput(null)}
                  className="text-xs text-swiss-darkGray hover:text-swiss-black underline uppercase tracking-widest"
                >
                  ← Start New Campaign
                </button>
             </div>
             <OutputDisplay data={output} />
          </div>
        )}

      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t border-swiss-gray py-4 text-center text-[10px] text-swiss-darkGray uppercase tracking-widest z-40">
        Engine Core v1.0.0 // Powered by Gemini 2.5
      </footer>
    </div>
  );
};

export default App;