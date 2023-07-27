import crashlytics from '@react-native-firebase/crashlytics';

const crashLog = log => {
  crashlytics().log(log);
};

const crashError = error => {
  crashlytics().recordError(error);
};

const crashForce = () => {
  crashlytics().crash();
};

const crashSetUserId = userId => {
  crashlytics().setUserId(userId);
};

export {crashLog, crashError, crashForce, crashSetUserId};
