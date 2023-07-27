import React from 'react';
import {Text, View} from 'react-native';
import {t} from 'i18next';

const SignInScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{t('hello')} </Text>
      <Text>SignIn Screen </Text>
      <Text>SignIn Screen </Text>
      <Text>SignIn Screen </Text>
      <Text>SignIn Screen </Text>
      <Text>SignIn Screen </Text>
      <Text>SignIn Screen </Text>
    </View>
  );
};

export default SignInScreen;
