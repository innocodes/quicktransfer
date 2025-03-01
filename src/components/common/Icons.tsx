/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

// Custom icon components
export const MailIcon = () => (
  <View
    style={{
      width: 20,
      height: 16,
      borderWidth: 1.5,
      borderColor: '#757575',
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View
      style={{
        width: 16,
        height: 1,
        backgroundColor: '#757575',
        position: 'absolute',
      }}
    />
  </View>
);

export const LockIcon = () => (
  <View
    style={{
      width: 20,
      height: 20,
      borderWidth: 1.5,
      borderColor: '#757575',
      borderRadius: 4,
      marginTop: 3,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View
      style={{
        width: 8,
        height: 8,
        borderWidth: 1.5,
        borderColor: '#757575',
        borderRadius: 4,
        position: 'absolute',
        top: -5,
      }}
    />
  </View>
);

export const SearchIcon = () => (
  <View style={{width: 20, height: 20}}>
    <View
      style={{
        width: 12,
        height: 12,
        borderWidth: 1.5,
        borderColor: '#757575',
        borderRadius: 6,
      }}
    />
    <View
      style={{
        width: 6,
        height: 1.5,
        backgroundColor: '#757575',
        position: 'absolute',
        bottom: 2,
        right: 2,
        transform: [{rotate: '45deg'}],
      }}
    />
  </View>
);

export const CloseIcon = () => (
  <View
    style={{
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View
      style={{
        width: 14,
        height: 1.5,
        backgroundColor: '#757575',
        transform: [{rotate: '45deg'}],
        position: 'absolute',
      }}
    />
    <View
      style={{
        width: 14,
        height: 1.5,
        backgroundColor: '#757575',
        transform: [{rotate: '-45deg'}],
        position: 'absolute',
      }}
    />
  </View>
);

export const EyeIcon = (visible: boolean) => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <View
      style={{
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderColor: '#757575',
        borderRadius: 8,
      }}
    />
    <View
      style={{
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: '#757575',
        borderRadius: 3,
      }}
    />
    {visible && (
      <View
        style={{
          position: 'absolute',
          width: 24,
          height: 2,
          backgroundColor: '#757575',
          transform: [{rotate: '45deg'}],
        }}
      />
    )}
  </View>
);
