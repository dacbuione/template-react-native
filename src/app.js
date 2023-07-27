import {LogBox, Text, TextInput} from 'react-native';
import {setMainScreen} from '@/navigation';
import fcmService from '../lib/notification/fcm-service';
import localNotificationService from '../lib/notification/local-notification-service';
import messaging from '@react-native-firebase/messaging';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
LogBox.ignoreAllLogs(true);

const initialNotification = store => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      '[Notification] Message handled in the background',
      remoteMessage,
    );
  });

  const onRegisterNotification = async token => {
    console.log('[Notification] token: ', token);
  };

  const onNotification = (notify, data) => {};

  const onOpenNotification = notify => {
    console.log('[Notification] App open notification:', notify);
  };

  fcmService.registerAppWithFCM();
  fcmService.register(onRegisterNotification, onNotification, null);
  localNotificationService.configure(onOpenNotification);
};
const App = async store => {
  let currentRoot;

  const onStoreUpdate = () => {
    currentRoot = setMainScreen();
  };

  // init notification handler
  initialNotification(store);

  store.subscribe(onStoreUpdate());
};

export default App;
