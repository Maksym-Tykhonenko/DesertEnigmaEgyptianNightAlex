import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet } from 'react-native';

const Desertenigmaldr = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // прозорість
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // масштаб

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <ImageBackground
      source={require('../../assets/images/desertenigmafirstbg.png')}
      style={styles.bg}
    >
      <Animated.Image
        source={require('../../assets/images/desertenigmaldr.png')}
        style={[
          styles.image,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 300, height: 300, resizeMode: 'contain' },
});

export default Desertenigmaldr;
