import React from 'react';
import {Provider} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import Screens from '@/navigation/configs';
import {HomeScreen, SignInScreen} from '@/screens';

const registerScreen = (screenName, Component, store = null) => {
  console.log('registerScreen', screenName, <Component/>, store);
  if (store) {
    Navigation.registerComponent(
      screenName,
      () => props =>
        (
          <Provider store={store}>
            <Component {...props} />
          </Provider>
        ),
      () => Component,
    );
  } else {
    Navigation.registerComponent(
      screenName,
      () => props => <Component {...props} />,
      () => Component,
    );
  }
};

export const registerScreens = store => {
  registerScreen(Screens.SignInScreen, SignInScreen, store);
  registerScreen(Screens.HomeScreen, HomeScreen, store);
};
