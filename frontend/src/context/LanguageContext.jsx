import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    nav_home: "Home",
    nav_crop_rec: "Crop Recommendation",
    nav_crop_health: "Crop Health",
    nav_production: "Production Intelligence",
    nav_yield: "Yield Intelligence",
    nav_advisor: "AI Advisor",
    nav_farm_analysis: "Farm Analysis",
    nav_dashboard: "Dashboard",
    nav_models: "AI Models",
    nav_data_sources: "Data Sources",
    nav_about: "About",
    cta_get_started: "Get Started",
    cta_analyze_farm: "Analyze My Farm",
    cta_explore: "Explore Krishi Intelligence",
    cta_try_demo: "Try Demo",
    hero_title: "Grow Smarter with AI",
    hero_subtitle: "Krishi360 transforms soil data, crop intelligence and plant health information into actionable agricultural insights.",
    hero_tagline: "Smarter Farming. Better Decisions. Sustainable Growth.",
    stats_data_sources: "Integrated AI Data Sources",
    stats_plant_images: "Plant Health Images",
    stats_production_records: "Agricultural Production Records",
    stats_soil_params: "Core Soil & Climate Parameters",
    disclaimer_text: "Krishi360 provides AI-assisted agricultural insights based on available datasets and should not replace professional agricultural advice or field-level assessment."
  },
  hi: {
    nav_home: "मुख्य पृष्ठ",
    nav_crop_rec: "फसल संस्तुति",
    nav_crop_health: "फसल स्वास्थ्य",
    nav_production: "उत्पादन विश्लेषण",
    nav_yield: "उपज पूर्वानुमान",
    nav_advisor: "कृषिमित्र AI",
    nav_farm_analysis: "संपूर्ण खेत विश्लेषण",
    nav_dashboard: "डैशबोर्ड",
    nav_models: "AI मॉडल्स",
    nav_data_sources: "डेटा स्रोत",
    nav_about: "हमारे बारे में",
    cta_get_started: "शुरू करें",
    cta_analyze_farm: "मेरे खेत का विश्लेषण करें",
    cta_explore: "कृषि बुद्धिमत्ता देखें",
    cta_try_demo: "डेमो आज़माएं",
    hero_title: "AI के साथ स्मार्ट खेती करें",
    hero_subtitle: "कृषि360 मिट्टी के डेटा, फसल बुद्धिमत्ता और पौधों के स्वास्थ्य की जानकारी को व्यावहारिक कृषि निर्णयों में बदलता है।",
    hero_tagline: "स्मार्ट खेती। बेहतर निर्णय। सतत विकास।",
    stats_data_sources: "एकीकृत AI डेटा स्रोत",
    stats_plant_images: "पौध स्वास्थ्य पत्ती चित्र",
    stats_production_records: "कृषि उत्पादन रिकॉर्ड",
    stats_soil_params: "प्रमुख मृदा एवं जलवायु मानक",
    disclaimer_text: "कृषि360 उपलब्ध डेटासेट के आधार पर AI-सहायता प्राप्त कृषि जानकारी प्रदान करता है और इसे पेशेवर कृषि सलाह या विशेषज्ञ जांच का विकल्प नहीं माना जाना चाहिए।"
  },
  hinglish: {
    nav_home: "Home",
    nav_crop_rec: "Crop Recommendation",
    nav_crop_health: "Crop Health",
    nav_production: "Production Intelligence",
    nav_yield: "Yield Intelligence",
    nav_advisor: "KrishiMitra AI",
    nav_farm_analysis: "Full Farm Analysis",
    nav_dashboard: "Dashboard",
    nav_models: "AI Models",
    nav_data_sources: "Data Sources",
    nav_about: "About Krishi360",
    cta_get_started: "Get Started",
    cta_analyze_farm: "Apna Farm Analyze Karein",
    cta_explore: "Explore Intelligence",
    cta_try_demo: "Try Demo",
    hero_title: "Grow Smarter with AI",
    hero_subtitle: "Krishi360 soil data, crop intelligence aur plant health information ko actionable agricultural insights me badalta hai.",
    hero_tagline: "Smarter Farming. Better Decisions. Sustainable Growth.",
    stats_data_sources: "Integrated AI Data Sources",
    stats_plant_images: "Plant Health Images",
    stats_production_records: "Agricultural Production Records",
    stats_soil_params: "Core Soil & Climate Parameters",
    disclaimer_text: "Krishi360 verified datasets par based AI recommendations deta hai. Kisi bhi fertilizer ya chemical spray se pehle local KVK specialist se confirm karein."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('krishi360_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('krishi360_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
