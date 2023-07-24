import {LogBox, Text, TextInput} from 'react-native';
import {setSignInScreen} from '@/navigation';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
LogBox.ignoreAllLogs(true);

const App = async store => {
  console.log('store', store);
  let currentRoot;

  const onStoreUpdate = () => {
    currentRoot = setSignInScreen();
    console.log('currentRoot', currentRoot);
  };
  store.subscribe(onStoreUpdate);
};

export default App;
