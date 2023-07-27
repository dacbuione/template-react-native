import {Navigation} from 'react-native-navigation';
import Screens from './configs';

export const setMainScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: Screens.HomeScreen,
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
  return Screens.HomeScreen;
};
