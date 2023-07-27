/**
 * header default app
 * paramester
 * title : title screen
 * backNull: disable display button back
 * style : customize style header
 * navigation: navigation the screen for use fuction pop, push
 */

import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Colors, sizeScale} from '@/commons';
import {Icon} from '@/components';

const HeaderDefault = ({
  title,
  backNull,
  style,
  handleDimissModal,
  navigation,
  renderRightButtons = null,
}) => {
  const handleGoBack = () => {
    if (navigation) {
      navigation.pop();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.txtTitleStyle]}>HOME</Text>
      <TouchableOpacity style={styles.btnBackStyle}>
        <Icon name="ic_" color={'red'} size={20} />
      </TouchableOpacity>
      {renderRightButtons && renderRightButtons()}
    </View>
  );
};

export default HeaderDefault;
