import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { desertenigmagmlvsl } from '../desertenigmacnsts/desertenigmagmlvsl';

const STORAGE_KEY = 'desert_enigma_game_progress';

const Desertenigmalvlsscrn = () => {
  const desertenigmanv = useNavigation();
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const enigmanav = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadDesertEnigmaProgress();
    }, []),
  );

  const loadDesertEnigmaProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedLevels) setUnlockedLevels(parsed.unlockedLevels);
      }
    } catch (e) {
      console.error('Failed', e);
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require('../../assets/images/desertenigmahmbg.png')}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.desertenigmacnt}>
          <TouchableOpacity
            style={{ position: 'absolute', left: 24, top: 8 }}
            activeOpacity={0.6}
            onPress={() => enigmanav.goBack()}
          >
            <Image
              source={require('../../assets/images/desertenigmabck.png')}
            />
          </TouchableOpacity>

          <Text style={styles.desertenigmahdttl}>Levels</Text>

          <View style={{ marginVertical: 10 }}>
            {desertenigmagmlvsl.map((_, idx) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={idx}
                onPress={() =>
                  desertenigmanv.navigate('Desertenigmagmscrn', idx)
                }
                disabled={!unlockedLevels.includes(idx)}
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image
                    source={require('../../assets/images/desertenigmalvlcnt.png')}
                  />
                  {unlockedLevels.includes(idx) ? (
                    <Text style={styles.desertenigmalvltxt}>{idx + 1}</Text>
                  ) : (
                    <Image
                      source={require('../../assets/images/desertenigmalckd.png')}
                      style={{ position: 'absolute', top: 43 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  desertenigmacnt: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    marginTop: 70,
  },
  desertenigmalvltxt: {
    fontWeight: '600',
    fontSize: 32,
    color: '#FFF7C4',
    fontStyle: 'italic',
    position: 'absolute',
    top: 36,
  },
  desertenigmahdttl: {
    fontWeight: '600',
    fontSize: 24,
    color: '#FFF7C4',
    fontStyle: 'italic',
    marginBottom: 33,
  },
});

export default Desertenigmalvlsscrn;
