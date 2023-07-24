import {
  Navigation,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {Dimensions, Platform} from 'react-native';

const flags = {
  showTextInputToTestKeyboardInteraction: false,
  useCustomAnimations: false,
  useSlowOpenScreenAnimations: false,
  useSlideAnimation: Platform.OS === 'android',
};

export let NAVIGATION_CONSTANT;

export const loadNavigationConstant = async () => {
  NAVIGATION_CONSTANT = await Navigation.constants();
};

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

const DEFAULT_DURATION = 300;
const SHOW_DURATION =
  DEFAULT_DURATION * (flags.useSlowOpenScreenAnimations ? 2 : 1);

const setDefaultOptions = () =>
  Navigation.setDefaultOptions({
    layout: {
      componentBackgroundColor: '#FFFFFF',
      orientation: ['landscape'],
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      animate: true,
      animateTabSelection: false,
    },
    bottomTab: {
      iconWidth:24,
      iconHeight: 24,
      textColor: '#000000',
      fontFamily: 'Nunito-Bold',
      fontWeight: '800',
      selectedTextColor: '#000000',
      ...(Platform.OS === 'android' && {fontSize: 12, selectedFontSize: 12}),
      ...(Platform.OS === 'ios' && {fontSize: 13, selectedFontSize: 13}),
      badgeColor: '#000000',
    },
    animations: {
      ...(flags.useSlideAnimation
        ? slideAnimations
        : flags.useCustomAnimations
        ? customAnimations
        : {}),
    },
    modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
    statusBar: {
      visible: true,
      drawBehind: false,
      backgroundColor: '#FFFFFF',
      style: 'dark',
    },
    sideMenu: {
      right: {
        width: width * 0.7,
      },
    },
    topBar: {
      visible: false,
      drawBehind: true,
    },
  });

const slideAnimations = {
  push: {
    // waitForRender: true,
    content: {
      translationX: {
        from: width,
        to: 0,
        duration: SHOW_DURATION,
      },
      alpha: {
        from: 0.7,
        to: 1,
        duration: SHOW_DURATION,
      },
    },
  },
  pop: {
    content: {
      translationX: {
        from: 0,
        to: width,
        duration: SHOW_DURATION,
      },
      alpha: {
        from: 1,
        to: 0.3,
        duration: SHOW_DURATION,
      },
    },
  },
  showOverlay: {
    // waitForRender: true,
    content: {
      alpha: {
        from: 0.7,
        to: 1,
        duration: SHOW_DURATION,
      },
    },
  },
  dismissOverlay: {
    content: {
      alpha: {
        from: 1,
        to: 0,
        duration: SHOW_DURATION,
      },
    },
  },
  showModal: {
    // waitForRender: true,
    translationY: {
      from: height,
      to: 0,
      duration: SHOW_DURATION,
    },
    alpha: {
      from: 0.7,
      to: 1,
      duration: SHOW_DURATION,
    },
  },
  dismissModal: {
    translationY: {
      from: 0,
      to: height,
      duration: SHOW_DURATION,
    },
    alpha: {
      from: 1,
      to: 0.3,
      duration: SHOW_DURATION,
    },
  },
};

const customAnimations = {
  showModal: {
    waitForRender: true,
    translationY: {
      from: height,
      to: 0,
      duration: SHOW_DURATION,
      interpolation: 'decelerate',
    },
    alpha: {
      from: 0.65,
      to: 1,
      duration: SHOW_DURATION * 0.7,
      interpolation: 'accelerate',
    },
  },
  dismissModal: {
    translationY: {
      from: 0,
      to: height,
      duration: SHOW_DURATION * 0.9,
    },
  },
  push: {
    waitForRender: true,
    content: {
      alpha: {
        from: 0.65,
        to: 1,
        duration: SHOW_DURATION * 0.7,
        interpolation: 'accelerate',
      },
      translationY: {
        from: height * 0.3,
        to: 0,
        duration: SHOW_DURATION,
        interpolation: 'decelerate',
      },
    },
  },
  pop: {
    content: {
      alpha: {
        from: 1,
        to: 0,
        duration: SHOW_DURATION,
      },
      translationY: {
        from: 0,
        to: height * 0.7,
        duration: SHOW_DURATION * 0.9,
      },
    },
  },
};

const fullScreenOptions = {
  bottomTabs: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export {setDefaultOptions, fullScreenOptions};
