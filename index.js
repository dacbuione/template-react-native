/**
 * Create by dac bui
 * Jul 23 2023
 * @format
 */
import {Navigation} from 'react-native-navigation';
import {registerScreens} from '@/navigation/configs/register-screens';
import configStore from '@/redux/config-store.js';
import App from '@/app';
import {SignInScreen} from '@/screens';
import './i18n';
import {setDefaultOptions} from '@/helpers';

const store = configStore();
registerScreens(store);

Navigation.events().registerAppLaunchedListener(async () => {
  setDefaultOptions();
  // start app
  await App(store);
});
