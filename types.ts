export interface CampaignInputs {
  brandName: string;
  industry: string;
  tone: string;
  audience: string;
  productDescription: string;
  goal: string;
}

// Data structure for the generated content
export interface GeneratedAsset {
  category: string;
  channel: string;
  content: string;
  visualNotes: string;
}

export interface CampaignOutput {
  brandName: string;
  webHero: {
    headline: string;
    subhead: string;
    cta: string;
  };
  productPage: {
    valueProp: string;
    benefits: string[];
    description: string;
  };
  socialMedia: {
    caption: string;
    imagePrompt: string;
  }[];
  blogIntro: string;
  emailSequence: {
    subject: string;
    body: string;
  }[];
  ads: {
    framework: string; // AIDA or PAS
    headline: string;
    body: string;
  }[];
  tiktokScript: string;
  proximityPack: {
    qrLanding: string;
    whatsappMsg: string;
    incentive: string;
  };
  strategy: {
    toneGuide: string;
    personaDefinition: string;
  };
  aioGeo: string;
}

export enum ViewMode {
  DOCS = 'DOCS',
  SHEETS = 'SHEETS',
}