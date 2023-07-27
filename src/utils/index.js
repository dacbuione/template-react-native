import {Platform, Dimensions} from 'react-native';
import moment from 'moment';
import i18n from 'i18next';
import _ from 'lodash';

const isIOS = () => Platform.OS === 'ios';
const isAndroid = () => Platform.OS === 'android';
const getScreenWidth = () => Dimensions.get('window').width;
const getScreenHeight = () => Dimensions.get('window').height;
const isEmptyString = str => {
  const string = str !== undefined || str !== null ? String(str) : '';
  return !str || string.length === 0 || !string.trim();
};

/**
 * Format number with comma
 * @param {*} number
 * @returns formated number
 * @example numberWithCommas(20000) => 20,000
 */
const numberWithCommas = (number, character = ',') => {
  if (number === null || number === undefined) {
    return number;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, character);
};

/**
 * Compact a long number to short
 * @param {*} number
 * @returns compacted number
 * @example compactNumber(20000) => 20k
 */
const compactNumber = (number, suffixes = ['', 'k', 'm', 'b', 't']) => {
  if (number === null || number === undefined) {
    return number;
  }
  const suffixNum = Math.floor(number.toString().length / 3);
  let shortNum = parseFloat(
    (suffixNum !== 0 ? number / Math.pow(1000, suffixNum) : number).toPrecision(
      2,
    ),
  );
  if (shortNum % 1 !== 0) {
    shortNum = shortNum.toFixed(1);
  }
  return shortNum + suffixes[suffixNum];
};

/**
 * Make a number with ordinal suffix
 * @param {*} number
 * @returns ordinal suffix number
 * @example makeNumberWithOrdinalSuffix(2) => 2nd
 */
const makeNumberWithOrdinalSuffix = number => {
  if (number === null || number === undefined) {
    return number;
  }
  let j = number % 10;
  let k = number % 100;
  if (j === 1 && k !== 11) {
    return `${number}st`;
  }
  if (j === 2 && k !== 12) {
    return `${number}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${number}rd`;
  }
  return `${number}th`;
};

/**
 * Get a random integer with a given range
 * @param {*} min
 * @param {*} max
 * @returns random number
 * @example getRandomInt(10, 100) => 31
 */
const getRandomInt = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + 1;
};

const getDaysAgoString = date => {
  if (!date) {
    return date;
  }
  const seconds = parseInt(
    (moment().valueOf() - moment(date).valueOf()) / 1000,
  );
  if (seconds < 60) {
    return i18n.t('txt_chat_active');
  } else {
    const minutes = parseInt(seconds / 60, 10);
    if (minutes < 60) {
      return i18n.t('txt_chat_active_minutes_ago', {minute: minutes});
    } else {
      const hours = parseInt(minutes / 60, 10);
      if (hours < 24) {
        return i18n.t('txt_chat_active_hours_ago', {hour: hours});
      } else {
        const days = parseInt(hours / 24, 10);
        if (days < 7) {
          return i18n.t('txt_chat_active_days_ago', {day: days});
        } else {
          return i18n.t('txt_chat_last_active_on', {
            date: moment(date).format('DD/MM/YYYY'),
          });
        }
      }
    }
  }
};

const validateSpaceText = str => {
  // Replace All Space With Single Space.
  var result = str.replace(/\s+/g, ' ');
  return result;
};

const validateSubmitText = str => {
  var result = null;
  if (str && str.length > 0) {
    var lastChar = str.slice(str.length - 1, str.length);
    if (lastChar === ' ') {
      result = str.replace(/\s+/g, '');
    } else {
      result = str.replace(/\s+/g, ' ');
    }
  } else {
    result = str;
  }

  return result;
};

const isValidPhoneNumber = phoneNumber => {
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneNumber && !_.isEmpty(phoneNumber) && phoneNumber.match(phoneno)) {
    console.log('Valid Phone Number');
    return true;
  } else {
    console.log('Not a valid Phone Number');
    return false;
  }
};

const isFirebasePhoneNumber = phoneNumber => {
  let result = false;
  try {
    console.log('###isFirebasePhoneNumber-phoneNumber: ', phoneNumber);
    if (phoneNumber && phoneNumber.startsWith('+')) {
      result = true;
    }
  } catch (error) {
    console.log('###isFirebasePhoneNumber-error: ', phoneNumber);
  }
  return result;
};

const formatCurrency = x => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getGenderName = gender =>
  gender === 1
    ? i18n.t('txt_male')
    : gender === 2
    ? i18n.t('txt_female')
    : gender === 3
    ? i18n.t('txt_other')
    : i18n.t('txt_no_say');

export {
  getDaysAgoString,
  getRandomInt,
  makeNumberWithOrdinalSuffix,
  compactNumber,
  numberWithCommas,
  isIOS,
  isAndroid,
  getScreenWidth,
  getScreenHeight,
  isEmptyString,
  validateSpaceText,
  validateSubmitText,
  formatCurrency,
  isValidPhoneNumber,
  getGenderName,
  isFirebasePhoneNumber,
};
