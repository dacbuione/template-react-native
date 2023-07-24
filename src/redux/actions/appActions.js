import * as appTypes from '../types/appTypes';

export const changeAppStateInitial = initializing => ({
  type: appTypes.APP_INITIALIZING_CHANGED,
  initializing,
});
