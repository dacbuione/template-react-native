import {Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const DEFAULT_CHANNEL_ID = 'vone-default-notification-channel-id';
const DEFAULT_CHANNEL_NAME = 'vone-default-notification-channel-name';

class LocalNotificationService {
  configure = onOpenNotification => {
    // create channel
    PushNotification.createChannel(
      {
        channelId: DEFAULT_CHANNEL_ID,
        channelName: DEFAULT_CHANNEL_NAME,
        channelDescription: DEFAULT_CHANNEL_NAME,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created =>
        console.log(
          `createChannel ${DEFAULT_CHANNEL_ID} returned '${created}'`,
        ),
    );
    // configure
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log(
          '[LocalNotificationService] onNotification:',
          notification.foreground,
        );
        if (!notification?.userInteraction) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(notification.data);
        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      // IOS ONLY (optional): default: all — Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * — Specified if permissions (ios) and token (android and ios) will requested or not,
       * — if not, you must call PushNotificationsHandler.requestPermissions() later
       * — if you are not using remote notification or do not have Firebase installed, use this:
       * requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  unregister = () => {
    PushNotification.unregister();
  };
  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(options),
      /* iOS and Android properties */
      ...this.buildIOSNotification(options),
      /* iOS and Android properties */
      id: id,
      title: title || '',
      message: message || '',
      userInfo: data,
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    });
  };

  showNotificationSchedule = (
    id,
    title,
    message,
    date,
    data = {},
    options = {},
  ) => {
    PushNotification.localNotificationSchedule({
      /* Android Only Properties */
      ...this.buildAndroidNotification(options),
      /* iOS and Android properties */
      ...this.buildIOSNotification(options),
      /* iOS and Android properties */
      id: id,
      title: title,
      message: message,
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      repeatTime: options.repeatTime || undefined,
      repeatType: options.repeatType || undefined,
      date: date,
      allowWhileIdle: false,
      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    });
  };
  buildAndroidNotification = (options = {}) => {
    // console.log('data title title', title);
    return {
      channelId: DEFAULT_CHANNEL_ID,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
    };
  };
  buildIOSNotification = (options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
    };
  };
  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeAllPendingNotification = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllPendingNotificationRequests();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };
  removeDeliveredNotificationByID = notificationId => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID: ',
      notificationId,
    );
    PushNotification.cancelLocalNotification(notificationId);
  };
}
const localNotificationService = new LocalNotificationService();
export default localNotificationService;
