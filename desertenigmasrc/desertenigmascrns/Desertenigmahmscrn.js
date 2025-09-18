import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Desertenigmabtn from '../desertenigmacmpnts/Desertenigmabtn';
import { useNavigation } from '@react-navigation/native';
import { useDesertEnigmaCntx } from '../desertenigmastr/desertenigmacntx';
import { useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const desertenigmahomenav = [
  {
    desertenigmabtntxt: 'Play',
    desertenigmascreen: 'Desertenigmalvlsscrn',
  },
  {
    desertenigmabtntxt: 'Cipher',
    desertenigmascreen: 'Desertenigmacipherscrn',
  },
  {
    desertenigmabtntxt: 'Settings',
    desertenigmascreen: 'Desertenigmastngsscrn',
  },
];

const Desertenigmahmscrn = () => {
  const enigmanav = useNavigation();
  const {
    volume,
    isDesertEnigmaMusicOn,
    setIsDesertEnigmaMusicOn,
    setIsEnableDesertEnigmaNotification,
  } = useDesertEnigmaCntx();
  const [sound, setSound] = useState(null);
  const [desertEnigmaTrackIndex, setDesertEnigmaTrackIndex] = useState(0);
  const desertEnigmaTracks = ['eastern-melody.wav', 'eastern-melody.wav'];

  useEffect(() => {
    playDesertEnigmaTrack(desertEnigmaTrackIndex);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [desertEnigmaTrackIndex]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(volume);
    }
  }, [volume]);

  const playDesertEnigmaTrack = index => {
    console.log('🎵 Platform:', Platform.OS);
    console.log('🎵 Volume:', volume);

    if (sound) {
      console.log('🎵 Stopping previous sound');
      sound.stop(() => {
        sound.release();
      });
    }

    const trackPath = desertEnigmaTracks[index];

    const newPartyDareSound = new Sound(trackPath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('❌ Error loading track:', error);
        return;
      }

      console.log('✅ Sound loaded successfully');

      newPartyDareSound.setVolume(volume);

      newPartyDareSound.play(success => {
        if (success) {
          console.log('✅ Sound playing successfully');
          setDesertEnigmaTrackIndex(
            prevIndex => (prevIndex + 1) % desertEnigmaTracks.length,
          );
        } else {
          console.log('❌ Error playing track');
        }
      });
      setSound(newPartyDareSound);
    });
  };

  useEffect(() => {
    loadEnigmaNotifications();
    loadDesertEnigmaMusic();
  }, []);

  const loadEnigmaNotifications = async () => {
    try {
      const enigmaNotifValue = await AsyncStorage.getItem('isEnigmaNotOn');
      if (enigmaNotifValue !== null) {
        const isEnigmaNotOn = JSON.parse(enigmaNotifValue);
        setIsEnableDesertEnigmaNotification(isEnigmaNotOn);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadDesertEnigmaMusic = async () => {
    try {
      const partyDareMusicValue = await AsyncStorage.getItem('isEnigmaMusicOn');
      console.log('partyDareMusicValue', partyDareMusicValue);

      const isPartyMusicOn = JSON.parse(partyDareMusicValue);
      setIsDesertEnigmaMusicOn(isPartyMusicOn);
      if (sound) {
        sound.setVolume(isPartyMusicOn ? volume : 0);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    const setVolumeBasedOnPartydareMusic = async () => {
      try {
        const partyDareMusicValue = await AsyncStorage.getItem(
          'isEnigmaMusicOn',
        );

        const isPartyMusicOn = JSON.parse(partyDareMusicValue);
        setIsDesertEnigmaMusicOn(isPartyMusicOn);
        if (sound) {
          sound.setVolume(isPartyMusicOn ? volume : 0);
        }
      } catch (error) {
        console.error('Error setting volume based on music enabled:', error);
      }
    };

    setVolumeBasedOnPartydareMusic();
  }, [sound, volume]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(isDesertEnigmaMusicOn ? volume : 0);
    }
  }, [volume, isDesertEnigmaMusicOn]);

  return (
    <ImageBackground
      style={styles.desertenigmabgimg}
      source={require('../../assets/images/desertenigmahmbg.png')}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.desertenigmacontainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../../assets/images/desertenigmaldr.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/egypticon.png')}
              style={{ width: 269, height: 267, borderRadius: 12 }}
            />
          )}

          <View style={{ gap: 14, marginTop: 68 }}>
            {desertenigmahomenav.map((btn, idx) => (
              <View key={idx}>
                <Desertenigmabtn
                  buttonWidth={283}
                  buttonHeight={100}
                  enigmaPropsLabel={btn.desertenigmabtntxt}
                  onPress={() => enigmanav.navigate(btn.desertenigmascreen)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  desertenigmacontainer: {
    flex: 1,
    paddingTop: height * 0.127,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  desertenigmabgimg: { flex: 1 },
  desertenigmabrdrs: {
    marginBottom: 18,
    borderRadius: 22,
    width: '100%',
  },
  desertenigmagrdcnt: {
    padding: 15,
    backgroundColor: '#14328F',
    margin: 3,
    borderRadius: 22,
  },
  desertenigmatxt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  desertenigmasbt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Desertenigmahmscrn;
