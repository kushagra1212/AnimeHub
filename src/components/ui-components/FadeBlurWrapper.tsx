import React from 'react';
import { View, StyleSheet } from 'react-native';
const FadeBlurWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.fade} />
      <View style={styles.blur} />
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomWidth: 100,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
    transform: [{ translateY: -100 }],
  },
});

export default FadeBlurWrapper;
