import * as appTypes from '../types/app-types';

export const changeAppStateInitial = initializing => ({
  type: appTypes.APP_INITIALIZING_CHANGED,
  initializing,
});
