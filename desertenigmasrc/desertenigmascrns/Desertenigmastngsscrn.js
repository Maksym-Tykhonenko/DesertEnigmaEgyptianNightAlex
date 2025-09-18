import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDesertEnigmaCntx } from '../desertenigmastr/desertenigmacntx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Desertenigmastngsscrn = () => {
  const enigmanav = useNavigation();

  const {
    setIsEnableDesertEnigmaNotification,
    isEnableDesertEnigmaNotification,
    isDesertEnigmaMusicOn,
    setIsDesertEnigmaMusicOn,
  } = useDesertEnigmaCntx();

  const handleDesertEnigmaMusicToggle = async value => {
    try {
      await AsyncStorage.setItem('isEnigmaMusicOn', JSON.stringify(value));
      setIsDesertEnigmaMusicOn(value);
    } catch (error) {
      console.log('Error saving music setting:', error);
    }
  };

  const toggleDesertEnigmaNotifications = async value => {
    try {
      await AsyncStorage.setItem('isEnigmaNotOn', JSON.stringify(value));
      setIsEnableDesertEnigmaNotification(value);
    } catch (error) {
      console.log('Error saving not setting:', error);
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
          <Text style={styles.desertenigmahdttl}>Settings</Text>
          <TouchableOpacity
            style={{ position: 'absolute', left: 24, top: -12 }}
            activeOpacity={0.6}
            onPress={() => enigmanav.goBack()}
          >
            <Image
              source={require('../../assets/images/desertenigmabck.png')}
            />
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <View style={[styles.desertenigmabrdrs]}>
              <LinearGradient
                colors={['#F08D1D', '#FFF29E']}
                style={{ borderRadius: 50 }}
              >
                <View style={[styles.desertenigmagrdcnt]}>
                  <Text style={[styles.desertenigmatxt]}>Background Music</Text>
                  <Switch
                    onValueChange={handleDesertEnigmaMusicToggle}
                    value={isDesertEnigmaMusicOn}
                    trackColor={{ true: '#A64B05', false: 'grey' }}
                    thumbColor={'#fff'}
                  />
                </View>
              </LinearGradient>
            </View>
          )}

          <View style={[styles.desertenigmabrdrs, { marginBottom: 25 }]}>
            <LinearGradient
              colors={['#F08D1D', '#FFF29E']}
              style={{ borderRadius: 50 }}
            >
              <View style={[styles.desertenigmagrdcnt]}>
                <Text style={[styles.desertenigmatxt]}>Notifications</Text>
                <Switch
                  onValueChange={toggleDesertEnigmaNotifications}
                  value={isEnableDesertEnigmaNotification}
                  trackColor={{ true: '#A64B05', false: 'grey' }}
                  thumbColor={'#fff'}
                />
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.desertenigmabrdrs]}
            onPress={() =>
              Linking.openURL(
                'https://www.termsfeed.com/live/d2756b40-a87f-4caf-a1b2-4f7607fd2d6b',
              )
            }
          >
            <LinearGradient
              colors={['#F08D1D', '#FFF29E']}
              style={{ borderRadius: 55 }}
            >
              <View style={[styles.desertenigmagrdcnt]}>
                <Text style={[styles.desertenigmatxt]}>
                  Terms and Conditions
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  desertenigmacontainer: {
    flex: 1,
    marginTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  desertenigmabgimg: { flex: 1 },
  desertenigmabrdrs: {
    borderRadius: 50,
    width: '100%',
    marginBottom: 12,
  },
  desertenigmagrdcnt: {
    padding: 15,
    backgroundColor: '#FCD253',
    margin: 3,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desertenigmatxt: {
    fontWeight: '600',
    color: '#A64B05',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  desertenigmahdttl: {
    fontWeight: '600',
    fontSize: 24,
    color: '#FFF7C4',
    fontStyle: 'italic',
    marginBottom: 36,
    textAlign: 'center',
  },
});

export default Desertenigmastngsscrn;
