import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export const StoreContext = createContext();

export const useDesertEnigmaCntx = () => {
  return useContext(StoreContext);
};

export const DesertEnigmaContextProvider = ({ children }) => {
  const [
    isEnableDesertEnigmaNotification,
    setIsEnableDesertEnigmaNotification,
  ] = useState(false);
  const [soundLevel, updateSoundLevel] = useState(1.0);
  const [isDesertEnigmaMusicOn, setIsDesertEnigmaMusicOn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetchedVol = await AsyncStorage.getItem('volume');
        if (fetchedVol !== null && !isNaN(parseFloat(fetchedVol))) {
          updateSoundLevel(parseFloat(fetchedVol));
        }
      } catch (err) {
        console.log('Error retrieving stored volume data:', err);
      }
    })();
  }, []);

  const adjustVolumeLevel = async newLevel => {
    try {
      const stringifiedLevel = `${newLevel}`;
      await AsyncStorage.setItem('volume', stringifiedLevel);
      updateSoundLevel(newLevel);
    } catch (err) {
      console.log('Error while storing volume:', err);
    }
  };

  const desertEnigmaValues = {
    isEnableDesertEnigmaNotification,
    setIsEnableDesertEnigmaNotification,
    volume: soundLevel,
    setVolume: adjustVolumeLevel,
    isDesertEnigmaMusicOn,
    setIsDesertEnigmaMusicOn,
  };

  return (
    <StoreContext.Provider value={desertEnigmaValues}>
      {children}
    </StoreContext.Provider>
  );
};
