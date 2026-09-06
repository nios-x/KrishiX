import React, { createContext, useContext, useState } from 'react';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const [farmInfo, setFarmInfo] = useState({
    state: "Punjab",
    district: "LUDHIANA",
    area: 3.5,
    currentCrop: "Wheat"
  });

  const [soilParams, setSoilParams] = useState({
    n: 90,
    p: 42,
    k: 43,
    temperature: 24.5,
    humidity: 78.0,
    ph: 6.5,
    rainfall: 820.0
  });

  const [latestRecommendation, setLatestRecommendation] = useState(null);
  const [latestHealth, setLatestHealth] = useState(null);
  const [latestYield, setLatestYield] = useState(null);
  const [farmReport, setFarmReport] = useState(null);

  const loadDemoScenario = (scenario) => {
    if (scenario === 1) {
      // Crop Recommendation Demo
      setSoilParams({
        n: 85,
        p: 58,
        k: 41,
        temperature: 21.7,
        humidity: 80.3,
        ph: 6.8,
        rainfall: 226.5
      });
      setFarmInfo(prev => ({ ...prev, state: "West Bengal", district: "BURDWAN", area: 2.0, currentCrop: "Rice" }));
    } else if (scenario === 2) {
      // Disease Detection Demo
      setFarmInfo(prev => ({ ...prev, currentCrop: "Potato" }));
    } else if (scenario === 3) {
      // Production Intelligence Demo
      setFarmInfo(prev => ({ ...prev, state: "Maharashtra", district: "NASHIK", area: 4.0, currentCrop: "Sugarcane" }));
    } else if (scenario === 4) {
      // Complete Farm Analysis Demo
      setFarmInfo({
        state: "Punjab",
        district: "LUDHIANA",
        area: 3.0,
        currentCrop: "Rice"
      });
      setSoilParams({
        n: 90,
        p: 42,
        k: 43,
        temperature: 25.0,
        humidity: 80.0,
        ph: 6.5,
        rainfall: 850.0
      });
    }
  };

  return (
    <FarmContext.Provider value={{
      farmInfo,
      setFarmInfo,
      soilParams,
      setSoilParams,
      latestRecommendation,
      setLatestRecommendation,
      latestHealth,
      setLatestHealth,
      latestYield,
      setLatestYield,
      farmReport,
      setFarmReport,
      loadDemoScenario
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
