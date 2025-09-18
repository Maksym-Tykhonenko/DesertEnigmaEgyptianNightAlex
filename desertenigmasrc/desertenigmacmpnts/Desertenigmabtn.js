import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';

const Desertenigmabtn = ({
  enigmaPropsLabel,
  onPress,
  buttonWidth,
  buttonHeight,
  fontSize = 24,
  enigmaPropsIcon,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      <ImageBackground
        source={require('../../assets/images/desertenigmabt.png')}
        style={[
          styles.desertenigmabtn,
          { width: buttonWidth, height: buttonHeight },
        ]}
        resizeMode="stretch"
      >
        {enigmaPropsIcon && <Image source={enigmaPropsIcon} />}
        <Text style={[styles.desertenigmabtntxt, { fontSize }]}>
          {enigmaPropsLabel}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  desertenigmabtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
  },
  desertenigmabtntxt: {
    fontWeight: '600',
    color: '#FFF7C4',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Desertenigmabtn;
