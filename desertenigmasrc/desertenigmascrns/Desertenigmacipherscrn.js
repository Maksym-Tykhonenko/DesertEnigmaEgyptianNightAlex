import { useEffect, useState } from 'react';
import Desertenigmabtn from '../desertenigmacmpnts/Desertenigmabtn';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDesertEnigmaCntx } from '../desertenigmastr/desertenigmacntx';
import Toast from 'react-native-toast-message';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Share,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Desertenigmacipherscrn = () => {
  const [isVisibleDesertEnigmaInfo, setIsVisibleDesertEnigmaInfo] =
    useState(false);
  const [desertEnigmaInputText, setDesertEnigmaInputText] = useState('');
  const [desertEnigmaEncryptedText, setDesertEnigmaEncryptedText] =
    useState('');
  const enigmanav = useNavigation();
  const [isEncryptMode, setIsEncryptMode] = useState(true);
  const [isDesertEnigmaOpenPck, setIsDesertEnigmaOpenPck] = useState(false);
  const [cipherType, setCipherType] = useState('substitution');
  const [desertEnigmaShift, setDesertEnigmaShift] = useState(1);
  const {
    isEnableDesertEnigmaNotification,
    setIsEnableDesertEnigmaNotification,
  } = useDesertEnigmaCntx();
  const [desertEnigmaCipers, setDesertEnigmaCipers] = useState([
    { label: 'Caesar', value: 'caesar' },
    { label: 'Substitution', value: 'substitution' },
    { label: 'Reverse', value: 'reverse' },
  ]);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const shuffled = 'qwertyuiopasdfghjklzxcvbnm';

  const capitalizeFirst = str =>
    str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  const rotateString = (str, shiftValue) => {
    const s = shiftValue % str.length;
    return str.slice(s) + str.slice(0, s);
  };

  const encryptDesertEnigmaTxt = input => {
    switch (cipherType) {
      case 'substitution': {
        const rotated = rotateString(shuffled, desertEnigmaShift);
        return capitalizeFirst(
          input
            .toLowerCase()
            .split('')
            .map(char => {
              const index = alphabet.indexOf(char);
              return index !== -1 ? rotated[index] : char;
            })
            .join(''),
        );
      }
      case 'caesar':
        return capitalizeFirst(
          input
            .toLowerCase()
            .split('')
            .map(char => {
              const index = alphabet.indexOf(char);
              return index !== -1
                ? alphabet[(index + desertEnigmaShift) % 26]
                : char;
            })
            .join(''),
        );
      case 'reverse':
        return capitalizeFirst(
          desertEnigmaShift % 2 === 1
            ? input.split('').reverse().join('')
            : input,
        );
      default:
        return input;
    }
  };

  const decryptDesertEnigmaTxt = input => {
    switch (cipherType) {
      case 'substitution': {
        const rotated = rotateString(shuffled, desertEnigmaShift);
        return capitalizeFirst(
          input
            .toLowerCase()
            .split('')
            .map(char => {
              const index = rotated.indexOf(char);
              return index !== -1 ? alphabet[index] : char;
            })
            .join(''),
        );
      }
      case 'caesar':
        return capitalizeFirst(
          input
            .toLowerCase()
            .split('')
            .map(char => {
              const index = alphabet.indexOf(char);
              return index !== -1
                ? alphabet[(index - desertEnigmaShift + 26) % 26]
                : char;
            })
            .join(''),
        );
      case 'reverse':
        return capitalizeFirst(
          desertEnigmaShift % 2 === 1
            ? input.split('').reverse().join('')
            : input,
        );
      default:
        return input;
    }
  };

  const handleDesertEnigmaModeChange = input => {
    setDesertEnigmaInputText(input);
    setDesertEnigmaEncryptedText(
      isEncryptMode
        ? encryptDesertEnigmaTxt(input)
        : decryptDesertEnigmaTxt(input),
    );
  };

  const toggleDesertEnigmaMode = () => {
    const newMode = !isEncryptMode;

    if (isEnableDesertEnigmaNotification) {
      Toast.show({
        text1: !isEncryptMode
          ? 'Encrypt mode selected!'
          : 'Decrypt mode selected!',
      });
    }

    setIsEncryptMode(newMode);
    if (desertEnigmaInputText) {
      setDesertEnigmaEncryptedText(
        newMode
          ? encryptDesertEnigmaTxt(desertEnigmaInputText)
          : decryptDesertEnigmaTxt(desertEnigmaInputText),
      );
    }
  };

  const handleCipherChange = value => {
    setCipherType(value);
    if (desertEnigmaInputText) {
      setDesertEnigmaEncryptedText(
        isEncryptMode
          ? encryptDesertEnigmaTxt(desertEnigmaInputText)
          : decryptDesertEnigmaTxt(desertEnigmaInputText),
      );
    }
  };

  const updateShift = change => {
    setDesertEnigmaShift(prev => {
      let newShift = prev + change;
      if (newShift < 1) newShift = 1;
      if (newShift > 10) newShift = 10;
      if (desertEnigmaInputText) {
        setDesertEnigmaEncryptedText(
          isEncryptMode
            ? encryptDesertEnigmaTxt(desertEnigmaInputText)
            : decryptDesertEnigmaTxt(desertEnigmaInputText),
        );
      }
      return newShift;
    });
  };

  const shareDesertEnigmaCiper = async () => {
    try {
      await Share.share({
        message: `${desertEnigmaInputText}
${desertEnigmaEncryptedText}`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const copyDesertEnigmaCiper = () => {
    Clipboard.setString(`${desertEnigmaInputText}
${desertEnigmaEncryptedText}`);

    if (isEnableDesertEnigmaNotification) {
      Toast.show({
        text1: 'Text has been copied to clipboard',
      });
    }
  };

  return (
    <ImageBackground
      style={styles.desertenigmabgimg}
      source={require('../../assets/images/desertenigmacipherbg.png')}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.desertenigmacontainer}>
          <View style={styles.desertenigmahdr}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => enigmanav.goBack()}
            >
              <Image
                source={require('../../assets/images/desertenigmabck.png')}
              />
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/desertenigmaonbimg.png')}
              style={{ width: 219, height: 208 }}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setIsVisibleDesertEnigmaInfo(!isVisibleDesertEnigmaInfo);
                setTimeout(() => {
                  setIsVisibleDesertEnigmaInfo(false);
                }, 3000);
              }}
            >
              <Image
                source={require('../../assets/images/desertenigmainfo.png')}
              />
            </TouchableOpacity>

            {isVisibleDesertEnigmaInfo && (
              <Image
                source={require('../../assets/images/desertenigmanot.png')}
                style={{ position: 'absolute', right: 0, top: 58 }}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', top: -14 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.desertenigmabrdrs]}
              onPress={toggleDesertEnigmaMode}
            >
              <LinearGradient
                colors={['#F08D1D', '#FFF29E']}
                style={{ borderRadius: 55 }}
              >
                <View
                  style={[
                    styles.desertenigmagrdcnt,
                    !isEncryptMode && { backgroundColor: '#FCD253' },
                  ]}
                >
                  <Text
                    style={[
                      styles.desertenigmatxt,
                      !isEncryptMode && { color: '#A64B05' },
                    ]}
                  >
                    Encrypt
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.desertenigmabrdrs]}
              onPress={toggleDesertEnigmaMode}
            >
              <LinearGradient
                colors={['#F08D1D', '#FFF29E']}
                style={{ borderRadius: 55 }}
              >
                <View
                  style={[
                    styles.desertenigmagrdcnt,
                    isEncryptMode && { backgroundColor: '#FCD253' },
                  ]}
                >
                  <Text
                    style={[
                      styles.desertenigmatxt,
                      isEncryptMode && { color: '#A64B05' },
                    ]}
                  >
                    Decrypt
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <DropDownPicker
            open={isDesertEnigmaOpenPck}
            value={cipherType}
            items={desertEnigmaCipers}
            setOpen={setIsDesertEnigmaOpenPck}
            setValue={setCipherType}
            onChangeValue={handleCipherChange}
            listMode="SCROLLVIEW"
            labelStyle={styles.desertenigmalbl}
            listItemLabelStyle={styles.listItemLabel}
            selectedItemLabelStyle={styles.desertenigmasellbl}
            setItems={setDesertEnigmaCipers}
            ArrowDownIconComponent={() => (
              <Image
                source={require('../../assets/images/desertenigmadwn.png')}
              />
            )}
            ArrowUpIconComponent={() => (
              <Image
                source={require('../../assets/images/desertenigmaup.png')}
              />
            )}
            style={styles.desertenigmapicker}
            dropDownContainerStyle={styles.desertenigmadropdownbox}
          />

          <View style={styles.desertenigmasftcnt}>
            <Text style={styles.desertenigmalbl}>Shift</Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Text style={styles.desertenigmalbl}>{desertEnigmaShift}</Text>
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateShift(1)}
                >
                  <Image
                    source={require('../../assets/images/desertenigmaup.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateShift(-1)}
                >
                  <Image
                    source={require('../../assets/images/desertenigmadwn.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <LinearGradient
              colors={['#F08D1D', '#FFF29E']}
              style={{ borderRadius: 20 }}
            >
              <View
                style={[
                  styles.desertenigmagrdcnt,
                  { backgroundColor: '#FCD253', borderRadius: 17 },
                ]}
              >
                <TextInput
                  style={styles.desertenigmainpt}
                  textAlignVertical="top"
                  multiline
                  onChangeText={handleDesertEnigmaModeChange}
                  value={desertEnigmaInputText}
                />
              </View>
            </LinearGradient>

            <LinearGradient
              colors={['#F08D1D', '#FFF29E']}
              style={{ borderRadius: 20 }}
            >
              <View
                style={[
                  styles.desertenigmagrdcnt,
                  { backgroundColor: '#FCD253', borderRadius: 17 },
                ]}
              >
                <View style={{ height: 127 }}>
                  <Text style={styles.desertenigmarestxt}>
                    {desertEnigmaEncryptedText}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.desertenigmabtnwrapper}>
            <Desertenigmabtn
              buttonWidth={160}
              buttonHeight={65}
              enigmaPropsLabel={'Copy'}
              fontSize={16}
              enigmaPropsIcon={require('../../assets/images/desertenigmacopy.png')}
              onPress={copyDesertEnigmaCiper}
              isDisabled={!desertEnigmaInputText}
            />
            <Desertenigmabtn
              buttonWidth={160}
              buttonHeight={65}
              enigmaPropsLabel={'Share'}
              fontSize={16}
              enigmaPropsIcon={require('../../assets/images/desertenigmashr.png')}
              onPress={shareDesertEnigmaCiper}
              isDisabled={!desertEnigmaInputText}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  desertenigmadropdownbox: {
    borderWidth: 0,
    backgroundColor: '#D16509',
    borderRadius: 10,
  },
  desertenigmasellbl: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 16,
  },
  listItemLabel: { fontWeight: '600', color: '#FFF7C4', fontSize: 16 },
  desertenigmacontainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  desertenigmahdr: { flexDirection: 'row', justifyContent: 'space-between' },
  desertenigmabgimg: { flex: 1 },
  desertenigmabrdrs: {
    borderRadius: 50,
    width: '50%',
  },
  desertenigmagrdcnt: {
    padding: 15,
    backgroundColor: '#14328F',
    margin: 3,
    borderRadius: 50,
  },
  desertenigmatxt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  desertenigmasbt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  desertenigmainpt: {
    width: '100%',
    height: 127,
    backgroundColor: '#FCD253',
    fontWeight: '500',
    color: '#A64B05',
    fontSize: 16,
  },
  desertenigmarestxt: {
    fontWeight: '500',
    color: '#A64B05',
    fontSize: 16,
  },
  desertenigmalbl: {
    fontWeight: '600',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFF7C4',
  },
  desertenigmapicker: {
    backgroundColor: '#D16509',
    borderColor: '#F08D1D',
    borderRadius: 22,
    borderWidth: 3,
    marginBottom: 8,
  },
  desertenigmabtnwrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 12,
  },
  desertenigmasftcnt: {
    borderRadius: 22,
    backgroundColor: '#D16509',
    height: 50,
    borderWidth: 3,
    borderColor: '#F08D1D',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    flexDirection: 'row',
    marginBottom: 16,
  },
});

export default Desertenigmacipherscrn;
