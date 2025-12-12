import React, { useState } from 'react';
import { CampaignOutput, ViewMode, GeneratedAsset } from '../types';

interface OutputDisplayProps {
  data: CampaignOutput;
}

// Helper to flatten data for the Table View
const flattenData = (data: CampaignOutput): GeneratedAsset[] => {
  const rows: GeneratedAsset[] = [];

  // Web Hero
  rows.push({ category: 'Web Hero', channel: 'Website', content: `Headline: ${data.webHero.headline}\nSubhead: ${data.webHero.subhead}\nCTA: ${data.webHero.cta}`, visualNotes: '-' });
  
  // Product Page
  rows.push({ category: 'Product Page', channel: 'Website', content: `Value Prop: ${data.productPage.valueProp}\nDescription: ${data.productPage.description}`, visualNotes: 'Benefits: ' + data.productPage.benefits.join(', ') });

  // Social
  data.socialMedia.forEach((post, i) => {
    rows.push({ category: `Social Post #${i+1}`, channel: 'Instagram', content: post.caption, visualNotes: post.imagePrompt });
  });

  // Blog
  rows.push({ category: 'Blog', channel: 'Blog/Newsletter', content: data.blogIntro, visualNotes: '-' });

  // Email
  data.emailSequence.forEach((email, i) => {
    rows.push({ category: `Email #${i+1}`, channel: 'Email', content: `Subject: ${email.subject}\n\n${email.body}`, visualNotes: '-' });
  });

  // Ads
  data.ads.forEach((ad, i) => {
    rows.push({ category: `Ad #${i+1} (${ad.framework})`, channel: 'Paid Social', content: `Headline: ${ad.headline}\n\n${ad.body}`, visualNotes: '-' });
  });

  // TikTok
  rows.push({ category: 'TikTok', channel: 'TikTok/Shorts', content: data.tiktokScript, visualNotes: '8-second duration' });

  // Proximity
  rows.push({ category: 'Proximity Pack', channel: 'Offline/Chat', content: `QR Text: ${data.proximityPack.qrLanding}\nWhatsApp: ${data.proximityPack.whatsappMsg}`, visualNotes: `Incentive: ${data.proximityPack.incentive}` });

  // Strategy
  rows.push({ category: 'Strategy', channel: 'Internal', content: `Tone: ${data.strategy.toneGuide}\nPersona: ${data.strategy.personaDefinition}`, visualNotes: '-' });

  // AIO
  rows.push({ category: 'AIO/GEO', channel: 'Search', content: data.aioGeo, visualNotes: 'Entity Description' });

  return rows;
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  const [mode, setMode] = useState<ViewMode>(ViewMode.DOCS);

  const copyToClipboard = () => {
    let textToCopy = "";
    if (mode === ViewMode.DOCS) {
      const el = document.getElementById('docs-view-content');
      if (el) textToCopy = el.innerText;
    } else {
      // Create CSV format for sheets
      const rows = flattenData(data);
      textToCopy = "Asset Category\tChannel\tContent / Script\tVisual/Notes\n";
      rows.forEach(r => {
        textToCopy += `${r.category}\t${r.channel}\t"${r.content.replace(/"/g, '""')}"\t"${r.visualNotes.replace(/"/g, '""')}"\n`;
      });
    }
    navigator.clipboard.writeText(textToCopy);
    alert('Copied to clipboard');
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 animate-fade-in-up pb-20">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-swiss-black pb-4 mb-8 gap-4">
        <h2 className="text-xl font-bold uppercase tracking-tight">Campaign Output // {data.brandName}</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-swiss-gray p-1 rounded-sm">
            <button 
              onClick={() => setMode(ViewMode.DOCS)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${mode === ViewMode.DOCS ? 'bg-swiss-black text-white shadow-sm' : 'text-swiss-darkGray hover:text-swiss-black'}`}
            >
              Mode A: Docs
            </button>
            <button 
              onClick={() => setMode(ViewMode.SHEETS)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${mode === ViewMode.SHEETS ? 'bg-swiss-black text-white shadow-sm' : 'text-swiss-darkGray hover:text-swiss-black'}`}
            >
              Mode B: Sheets
            </button>
          </div>
          <button 
            onClick={copyToClipboard}
            className="text-xs font-bold uppercase border border-swiss-black px-4 py-2 hover:bg-swiss-black hover:text-white transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white min-h-[500px]">
        {mode === ViewMode.DOCS ? (
          <div id="docs-view-content" className="prose prose-neutral max-w-none font-sans text-swiss-black">
            <h1 className="text-4xl font-bold mb-8 uppercase tracking-tighter"># {data.brandName}</h1>
            
            <Section title="1. Web Hero">
              <p><strong className="uppercase text-xs tracking-wider">Headline:</strong> {data.webHero.headline}</p>
              <p><strong className="uppercase text-xs tracking-wider">Subhead:</strong> {data.webHero.subhead}</p>
              <p><strong className="uppercase text-xs tracking-wider">CTA:</strong> {data.webHero.cta}</p>
            </Section>

            <Section title="2. Product Page">
              <p><strong className="uppercase text-xs tracking-wider">Value Prop:</strong> {data.productPage.valueProp}</p>
              <div className="my-4 pl-4 border-l-2 border-swiss-gray">
                {data.productPage.benefits.map((b, i) => (
                  <p key={i} className="mb-1">• {b}</p>
                ))}
              </div>
              <p className="whitespace-pre-wrap">{data.productPage.description}</p>
            </Section>

            <Section title="3. Social Media">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.socialMedia.map((post, i) => (
                  <div key={i} className="bg-swiss-gray p-4">
                    <div className="text-xs font-bold mb-2 uppercase text-swiss-darkGray">Post 0{i+1}</div>
                    <p className="text-sm mb-4">{post.caption}</p>
                    <p className="text-xs italic text-swiss-darkGray">Prompt: {post.imagePrompt}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="4. Blog Intro">
              <p className="whitespace-pre-wrap leading-relaxed">{data.blogIntro}</p>
            </Section>

            <Section title="5. Email Sequence">
              <div className="space-y-6">
                {data.emailSequence.map((email, i) => (
                  <div key={i} className="border border-swiss-gray p-6">
                    <p className="font-bold mb-2">Subject: {email.subject}</p>
                    <hr className="border-swiss-gray mb-4"/>
                    <p className="whitespace-pre-wrap text-sm">{email.body}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. Ads">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.ads.map((ad, i) => (
                  <div key={i} className="bg-swiss-black text-white p-6">
                    <div className="text-xs font-bold mb-4 uppercase opacity-50">{ad.framework} Framework</div>
                    <h4 className="text-xl font-bold mb-2">{ad.headline}</h4>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">{ad.body}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="7. TikTok Script (8s)">
              <div className="font-mono text-sm bg-swiss-gray p-4 border-l-4 border-swiss-black">
                {data.tiktokScript}
              </div>
            </Section>

            <Section title="8. Proximity Pack">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 border border-swiss-gray">
                  <strong className="block uppercase text-xs mb-2 text-swiss-darkGray">QR Landing</strong>
                  {data.proximityPack.qrLanding}
                </div>
                <div className="p-4 border border-swiss-gray">
                  <strong className="block uppercase text-xs mb-2 text-swiss-darkGray">WhatsApp</strong>
                  {data.proximityPack.whatsappMsg}
                </div>
                <div className="p-4 border border-swiss-gray">
                  <strong className="block uppercase text-xs mb-2 text-swiss-darkGray">Incentive</strong>
                  {data.proximityPack.incentive}
                </div>
              </div>
            </Section>

            <Section title="9. Strategy">
               <p><strong className="uppercase text-xs tracking-wider">Tone Guide:</strong> {data.strategy.toneGuide}</p>
               <p className="mt-2"><strong className="uppercase text-xs tracking-wider">Persona:</strong> {data.strategy.personaDefinition}</p>
            </Section>

            <Section title="10. AIO / GEO">
              <p className="p-4 bg-swiss-gray text-sm">{data.aioGeo}</p>
            </Section>

          </div>
        ) : (
          <div className="overflow-x-auto border border-swiss-gray">
            <table className="w-full text-left text-sm">
              <thead className="bg-swiss-black text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-medium border-r border-white/20">Asset Category</th>
                  <th className="p-4 font-medium border-r border-white/20">Channel</th>
                  <th className="p-4 font-medium border-r border-white/20 w-1/2">Content / Script</th>
                  <th className="p-4 font-medium">Visual/Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-swiss-gray">
                {flattenData(data).map((row, idx) => (
                  <tr key={idx} className="hover:bg-swiss-gray/30 transition-colors">
                    <td className="p-4 font-bold align-top">{row.category}</td>
                    <td className="p-4 text-swiss-darkGray align-top">{row.channel}</td>
                    <td className="p-4 whitespace-pre-wrap align-top font-mono text-xs">{row.content}</td>
                    <td className="p-4 text-swiss-darkGray align-top italic">{row.visualNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-xl font-bold uppercase border-b border-black mb-6 pb-2 tracking-tight">## {title}</h2>
    {children}
  </div>
);
