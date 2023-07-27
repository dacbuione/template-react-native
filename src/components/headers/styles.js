import {StyleSheet} from 'react-native';
import {sizeScale, sizeWidth, sizeHeight, Colors} from '@/commons';
import {NAVIGATION_CONSTANT} from '@/helpers/options';
import {getScreenWidth} from '@/utils';

const SCREEN_WIDTH = getScreenWidth();
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    // height: sizeHeight(NAVIGATION_CONSTANT.topBarHeight),
    height: sizeHeight(88),
    width: SCREEN_WIDTH,
  },
  btnBackStyle: {
    width: sizeWidth(60),
    backgroundColor: Colors.TRANSPARENT,
    paddingLeft: sizeWidth(16),
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  txtTitleStyle: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
