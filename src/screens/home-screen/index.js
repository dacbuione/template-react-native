import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {HeaderDefault} from '@/components'
import {t} from 'i18next';

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <HeaderDefault />
    </SafeAreaView>
  );
};

export default HomeScreen;


HomeScreen.options = () => ({
  statusBar: {
    visible: true,
    drawBehind: true,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    left: {
      enabled: true,
    },
  },
});
