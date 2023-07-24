import {Dimensions, PixelRatio} from 'react-native';
const {width, height} = Dimensions.get('window');

//Base design width and height.
const guidelineBaseWidth = 1024;
const guidelineBaseHeight = 1136;

// sizeScale based on actual design size
export const sizeScale = size => (width / guidelineBaseWidth) * size;
// sizeHeight calc height scale by base height
export const sizeHeight = size => (height / guidelineBaseHeight) * size;

// sizeWidth calc width scale by base width and percentage of factor, default is 0.5
export const sizeWidth = (size, factor = 0.5) =>
  size + (sizeScale(size) - size) * factor;
export const sizeFont = size =>
  Platform.select({
    ios: (size + 1) * PixelRatio.getFontScale(),
    android: size * PixelRatio.getFontScale(),
  });
