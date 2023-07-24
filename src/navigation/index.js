import {Navigation} from 'react-native-navigation';
import Screens from './configs';

export const setSignInScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: Screens.SignInScreen,
              options: {
                statusBar: {
                  visible: false,
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
        ],
      },
    },
  });
  return Screens.SignInScreen;
};
