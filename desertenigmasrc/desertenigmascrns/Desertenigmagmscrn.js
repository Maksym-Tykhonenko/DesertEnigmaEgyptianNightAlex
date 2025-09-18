import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { desertenigmagmlvsl } from '../desertenigmacnsts/desertenigmagmlvsl';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Desertenigmabtn from '../desertenigmacmpnts/Desertenigmabtn';
import { BlurView } from '@react-native-community/blur';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  ScrollView,
} from 'react-native';

const STORAGE_KEY = 'desert_enigma_game_progress';

const Desertenigmagmscrn = ({ route }) => {
  const selectedDesertEnigmaGmLvl = route.params;
  const [desertEnigmaLevelIndex, setDesertEnigmaLevelIndex] = useState(
    selectedDesertEnigmaGmLvl,
  );
  const [desertEnigmaRiddleIndex, setDesertEnigmaRiddleIndex] = useState(0);
  const [desertEnigmaInputs, setDesertEnigmaInputs] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [lettersLeft, setLettersLeft] = useState(3);
  const enigmanav = useNavigation();
  const [revealWordUsed, setRevealWordUsed] = useState(false);
  const [prevLevelIndex, setPrevLevelIndex] = useState(desertEnigmaLevelIndex);
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [wordSolved, setWordSolved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [revealWordsLeft, setRevealWordsLeft] = useState(1);
  const [isVisDesertEnigmaMdl, setIsVisDesertEnigmaMdl] = useState(false);

  useEffect(() => {
    loadDesertEnigmaProgress();
  }, []);

  useEffect(() => {
    const currentRiddle = getCurrentRiddle();
    if (currentRiddle) {
      setDesertEnigmaInputs(Array(currentRiddle.answer.length).fill(''));
      setRevealedLetters([]);

      if (prevLevelIndex !== desertEnigmaLevelIndex) {
        setRevealWordUsed(false);
        setLettersLeft(3);
        setPrevLevelIndex(desertEnigmaLevelIndex);
      }
    }
  }, [desertEnigmaLevelIndex, desertEnigmaRiddleIndex]);

  const getCurrentRiddle = () => {
    return desertenigmagmlvsl[desertEnigmaLevelIndex]?.riddles[
      desertEnigmaRiddleIndex
    ];
  };

  const saveDesertEnigmaProgress = async (
    newUnlockedLevels,
    newLettersLeft,
    newRevealWordsLeft,
  ) => {
    try {
      const data = {
        unlockedLevels: newUnlockedLevels,
        lettersLeft: newLettersLeft,
        revealWordsLeft: newRevealWordsLeft,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const loadDesertEnigmaProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedLevels) setUnlockedLevels(parsed.unlockedLevels);
        if (parsed.lettersLeft !== undefined)
          setLettersLeft(parsed.lettersLeft);
        if (parsed.revealWordsLeft !== undefined)
          setRevealWordsLeft(parsed.revealWordsLeft);
      }
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const handleDesertEnigmaChange = (text, index) => {
    const currentRiddle = getCurrentRiddle();
    if (!currentRiddle) return;

    const newInputs = [...desertEnigmaInputs];
    newInputs[index] = text.toUpperCase();
    setDesertEnigmaInputs(newInputs);

    const normalizedUserInput = newInputs
      .join('')
      .replace(/\s/g, '')
      .toLowerCase();
    const normalizedAnswer = currentRiddle.answer
      .replace(/\s/g, '')
      .toLowerCase();

    if (normalizedUserInput === normalizedAnswer) {
      setWordSolved(true);
    }
  };

  const goToNextRiddle = () => {
    setWordSolved(false);

    if (
      desertEnigmaRiddleIndex + 1 <
      desertenigmagmlvsl[desertEnigmaLevelIndex].riddles.length
    ) {
      setDesertEnigmaRiddleIndex(desertEnigmaRiddleIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const nextDesertEnigmaLvl = () => {
    const nextLevelIndex = desertEnigmaLevelIndex + 1;
    if (nextLevelIndex < desertenigmagmlvsl.length) {
      const newUnlockedLevels = [...unlockedLevels];
      if (!newUnlockedLevels.includes(nextLevelIndex)) {
        newUnlockedLevels.push(nextLevelIndex);
      }

      const newLettersLeft = lettersLeft + 3;
      const newRevealWordsLeft = revealWordsLeft + 1;

      setUnlockedLevels(newUnlockedLevels);
      setDesertEnigmaLevelIndex(nextLevelIndex);
      setDesertEnigmaRiddleIndex(0);
      setIsCompleted(false);
      setLettersLeft(newLettersLeft);
      setRevealWordsLeft(newRevealWordsLeft);

      saveDesertEnigmaProgress(
        newUnlockedLevels,
        newLettersLeft,
        newRevealWordsLeft,
      );
    }
  };

  const revealRandomLetter = () => {
    const currentRiddle = getCurrentRiddle();
    if (!currentRiddle) return;

    const answer = currentRiddle.answer;
    const upperAnswer = answer.toUpperCase();

    let unrevealedIndexes = [];
    for (let i = 0; i < upperAnswer.length; i++) {
      if (
        upperAnswer[i] !== ' ' &&
        desertEnigmaInputs[i]?.toUpperCase() !== upperAnswer[i] &&
        !revealedLetters.includes(i)
      ) {
        unrevealedIndexes.push(i);
      }
    }

    if (unrevealedIndexes.length > 0 && lettersLeft > 0) {
      const randomIndex =
        unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];

      const newInputs = [...desertEnigmaInputs];
      newInputs[randomIndex] = upperAnswer[randomIndex];
      setDesertEnigmaInputs(newInputs);

      setRevealedLetters([...revealedLetters, randomIndex]);
      setLettersLeft(lettersLeft - 1);

      const normalizedUserInput = newInputs
        .join('')
        .replace(/\s/g, '')
        .toLowerCase();
      const normalizedAnswer = answer.replace(/\s/g, '').toLowerCase();

      if (normalizedUserInput === normalizedAnswer) {
        setWordSolved(true);
      }
    }
  };

  const revealWord = () => {
    if (revealWordUsed) return;

    const currentRiddle = getCurrentRiddle();
    if (!currentRiddle) return;

    const answer = currentRiddle.answer;
    const upperAnswer = answer.toUpperCase();

    const words = answer.split(' ');
    let unrevealedWords = [];
    let startIndex = 0;

    words.forEach(word => {
      const endIndex = startIndex + word.length;
      const wordAlreadyRevealed =
        desertEnigmaInputs
          .slice(startIndex, endIndex)
          .join('')
          .toLowerCase() === word;
      if (!wordAlreadyRevealed) {
        unrevealedWords.push({ start: startIndex, end: endIndex });
      }
      startIndex = endIndex + 1;
    });

    if (unrevealedWords.length > 0) {
      setRevealWordUsed(true);

      setRevealWordsLeft(prev => Math.max(prev - 1, 0));
    }

    if (unrevealedWords.length > 0) {
      const randomWord =
        unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
      const newInputs = [...desertEnigmaInputs];

      for (let i = randomWord.start; i < randomWord.end; i++) {
        newInputs[i] = upperAnswer[i];
      }

      setDesertEnigmaInputs(newInputs);
      setRevealWordUsed(true);

      const normalizedUserInput = newInputs
        .join('')
        .replace(/\s/g, '')
        .toLowerCase();
      const normalizedAnswer = answer.replace(/\s/g, '').toLowerCase();

      if (normalizedUserInput === normalizedAnswer) {
        setWordSolved(true);
      }
    }
  };

  return (
    <>
      {!isCompleted ? (
        <ImageBackground
          style={{ flex: 1 }}
          source={require('../../assets/images/desertenigmahmbg.png')}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.desertenigmacont}>
              <View style={styles.desertenigmahdr}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => enigmanav.goBack()}
                >
                  <Image
                    source={require('../../assets/images/desertenigmabck.png')}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={revealRandomLetter}
                    disabled={lettersLeft === 0}
                  >
                    <Image
                      source={require('../../assets/images/desertenigmaboard.png')}
                    />
                    <View style={styles.desertenigmawrap}>
                      <Image
                        source={require('../../assets/images/desertenigmaa.png')}
                      />
                      <Text style={styles.desertenigmarwrdtxt}>
                        {lettersLeft}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={revealWord}
                    disabled={revealWordUsed}
                  >
                    <Image
                      source={require('../../assets/images/desertenigmaboard.png')}
                    />
                    <View style={styles.desertenigmawrap}>
                      <Image
                        source={require('../../assets/images/desertenigmacrs.png')}
                      />
                      <Text style={styles.desertenigmarwrdtxt}>
                        {revealWordsLeft}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setIsVisDesertEnigmaMdl(true)}
                >
                  <Image
                    source={require('../../assets/images/desertenigmaps.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.desertenigmattl}>
                Riddle {desertEnigmaRiddleIndex + 1}/
                {desertenigmagmlvsl[desertEnigmaLevelIndex].riddles.length}
              </Text>

              <LinearGradient
                style={[styles.desertenigmabrdrs]}
                colors={['#F08D1D', '#FFF29E']}
              >
                <View style={[styles.desertenigmagrdcnt]}>
                  <Text style={styles.desertenigmatxt}>
                    {getCurrentRiddle()?.question}
                  </Text>
                </View>
              </LinearGradient>

              <View style={styles.desertenigmaanswcnt}>
                {getCurrentRiddle()
                  ?.answer.split('')
                  .map((char, index) => (
                    <TextInput
                      key={index}
                      style={[
                        styles.desertenigmainpt,
                        desertEnigmaInputs[index] ===
                          getCurrentRiddle().answer[index].toUpperCase() &&
                        getCurrentRiddle().answer[index] !== ' '
                          ? styles.desertenigmacorr
                          : null,
                        getCurrentRiddle().answer[index] === ' '
                          ? styles.desertenigmaspc
                          : null,
                      ]}
                      value={desertEnigmaInputs[index] || ''}
                      maxLength={1}
                      onChangeText={text =>
                        handleDesertEnigmaChange(text, index)
                      }
                    />
                  ))}
              </View>

              <View style={{ alignItems: 'center', marginTop: 50 }}>
                {wordSolved && (
                  <Desertenigmabtn
                    buttonWidth={283}
                    buttonHeight={100}
                    enigmaPropsLabel={'Next'}
                    fontSize={20}
                    onPress={goToNextRiddle}
                  />
                )}
              </View>
            </View>
            {isVisDesertEnigmaMdl && (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={1}
              />
            )}
            <Modal transparent visible={isVisDesertEnigmaMdl}>
              <View style={styles.desertenigmamdlcnt}>
                <LinearGradient
                  style={[styles.desertenigmabrdrs]}
                  colors={['#F08D1D', '#FFF29E']}
                >
                  <View style={[styles.desertenigmagrdcnt]}>
                    <Text style={[styles.desertenigmatxt, { marginTop: 10 }]}>
                      Paused
                    </Text>
                    <Text
                      style={styles.desertenigmarwrtxt}
                    >{`The desert grows quiet. Level ${
                      desertEnigmaLevelIndex + 1
                    } — Riddle ${desertEnigmaRiddleIndex + 1}/${
                      desertenigmagmlvsl[desertEnigmaLevelIndex].riddles.length
                    }. Your progress is saved.`}</Text>
                    <View style={styles.desertenigmamdlbtnswrp}></View>
                    <Desertenigmabtn
                      buttonWidth={160}
                      buttonHeight={65}
                      enigmaPropsLabel={'Resume'}
                      fontSize={16}
                      onPress={() => setIsVisDesertEnigmaMdl(false)}
                    />

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        enigmanav.popToTop();
                        setIsVisDesertEnigmaMdl(false);
                      }}
                    >
                      <Text style={styles.desertenigmahmbtn}>Home</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </Modal>
          </ScrollView>
        </ImageBackground>
      ) : (
        <ImageBackground
          style={{ flex: 1 }}
          source={require('../../assets/images/desertenigmacmplt.png')}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.desertenigmacont}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../assets/images/desertenigmacmplimg.png')}
                  style={{ top: 80 }}
                />
              </View>

              <LinearGradient
                style={[styles.desertenigmabrdrs]}
                colors={['#F08D1D', '#FFF29E']}
              >
                <View style={[styles.desertenigmagrdcnt]}>
                  <Image
                    source={require('../../assets/images/desertenigmatxt.png')}
                  />
                  <Text style={[styles.desertenigmatxt, { marginTop: 10 }]}>
                    The temple doors open
                  </Text>
                  <Text style={styles.desertenigmarwrtxt}>Reward</Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                      marginBottom: 20,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={revealRandomLetter}
                      disabled={lettersLeft === 0}
                    >
                      <Image
                        source={require('../../assets/images/desertenigmaboard.png')}
                      />
                      <View style={styles.desertenigmawrap}>
                        <Image
                          source={require('../../assets/images/desertenigmaa.png')}
                        />
                        <Text style={styles.desertenigmarwrdtxt}>3</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={revealWord}
                      disabled={revealWordUsed}
                    >
                      <Image
                        source={require('../../assets/images/desertenigmaboard.png')}
                      />
                      <View style={styles.desertenigmawrap}>
                        <Image
                          source={require('../../assets/images/desertenigmacrs.png')}
                        />
                        <Text style={styles.desertenigmarwrdtxt}>1</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Desertenigmabtn
                    buttonWidth={160}
                    buttonHeight={65}
                    enigmaPropsLabel={'Next Level'}
                    fontSize={16}
                    onPress={nextDesertEnigmaLvl}
                  />

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => enigmanav.popToTop()}
                  >
                    <Text style={styles.desertenigmahmbtn}>Home</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  desertenigmacont: {
    flex: 1,
    padding: 24,
    marginTop: 70,
  },
  desertenigmaanswcnt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  desertenigmainpt: {
    borderColor: '#F08D1D',
    width: 53,
    height: 64,
    margin: 2,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#FCD253',
  },
  desertenigmahdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  desertenigmawrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  desertenigmattl: {
    fontWeight: '600',
    fontSize: 20,
    color: '#FFF7C4',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  desertenigmabrdrs: {
    borderRadius: 22,
    width: '100%',
    marginTop: 16,
    marginBottom: 30,
  },
  desertenigmagrdcnt: {
    padding: 15,
    backgroundColor: '#14328F',
    margin: 3,
    borderRadius: 22,
    alignItems: 'center',
  },
  desertenigmatxt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  desertenigmarwrtxt: {
    fontWeight: '600',
    color: '#D0D823',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  desertenigmarwrdtxt: {
    fontWeight: '600',
    color: '#A64B05',
    fontSize: 16,
    fontStyle: 'italic',
  },
  desertenigmahmbtn: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 15,
  },
  desertenigmamdlcnt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  desertenigmamdlbtnswrp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  desertenigmacorr: { backgroundColor: '#D0D823', borderColor: '#008E26' },
  desertenigmaspc: { backgroundColor: 'transparent', borderWidth: 0 },
});

export default Desertenigmagmscrn;
