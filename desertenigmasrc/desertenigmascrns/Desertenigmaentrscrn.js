import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Desertenigmabtn from '../desertenigmacmpnts/Desertenigmabtn';
import { useNavigation } from '@react-navigation/native';

const Desertenigmaentrscrn = () => {
  const [desertEnigmaSld, setDesertEnigmaSld] = useState(1);
  const enigmanav = useNavigation();

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require('../../assets/images/desertenigmafirstbg.png')}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <View style={styles.desertenigmacnt}>
          {desertEnigmaSld === 2 && (
            <Image
              source={require('../../assets/images/desertenigmaonbimg.png')}
            />
          )}
          <LinearGradient
            style={[styles.desertenigmabrdrs]}
            colors={['#F08D1D', '#FFF29E']}
          >
            <View style={[styles.desertenigmagrdcnt]}>
              <Text style={styles.desertenigmatxt}>
                {[
                  desertEnigmaSld === 1 && 'Night at the Gate',
                  desertEnigmaSld === 2 && 'Speak in Secret Roads',
                ]}
              </Text>

              <Text style={styles.desertenigmasbt}>
                {[
                  desertEnigmaSld === 1 &&
                    'The desert hushes; torchlight climbs the walls. Each chamber holds a riddle carved in shadow. Type the answer—no sand-running timer, only your wit.',
                  desertEnigmaSld === 2 &&
                    'Cipher your messages like a court magician. Encode, copy, and share, even off the grid. These are festival tricks, not fortress locks—use for fun, traveler.',
                ]}
              </Text>
            </View>
          </LinearGradient>

          <Desertenigmabtn
            buttonWidth={283}
            buttonHeight={100}
            enigmaPropsLabel={[desertEnigmaSld === 1 ? 'Next' : 'Start']}
            onPress={() =>
              desertEnigmaSld === 2
                ? enigmanav.replace('Desertenigmahmscrn')
                : setDesertEnigmaSld(2)
            }
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  desertenigmacnt: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
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

export default Desertenigmaentrscrn;
