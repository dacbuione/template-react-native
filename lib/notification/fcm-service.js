import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

class FCMService {
  isPermissionEnabled = false;
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };
  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };
  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        this.isPermissionEnabled = enabled;
        if (this.isPermissionEnabled) {
          // User has permissions
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };
  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };
  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(authStatus => {
        console.log('[FCMService] Authorization status:', authStatus);
        this.isPermissionEnabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (this.isPermissionEnabled) {
          this.getToken(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  };
  deleteToken = () => {
    console.log('[FCMService] deleteToken ');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete token error ', error);
      });
  };
  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage && onOpenNotification) {
        onOpenNotification(remoteMessage);
        // this.removeDeliveredNotification(notification.notificationId)
      }
    });
    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage && onOpenNotification) {
          onOpenNotification(remoteMessage);
          // this.removeDeliveredNotification(notification.notificationId)
        }
      });
    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('[FCMService] A new FCM message arrived!', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        let data = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.notification;
          data = remoteMessage.data;
        } else {
          notification = remoteMessage.notification;
          data = remoteMessage.data;
        }
        onNotification(notification, data);
      }
    });
    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      console.log('[FCMService] New token refresh: ', fcmToken);
      onRegister(fcmToken);
    });
  };
  unregister = () => {
    this.messageListener();
  };
}
const fcmService = new FCMService();
export default fcmService;
