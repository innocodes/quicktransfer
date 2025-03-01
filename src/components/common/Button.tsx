import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

const Button = ({
  title = '',
  onPress = () => {},
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftComponent,
  rightComponent,
  style,
  textStyle,
  width,
  testID,
}) => {
  const getButtonStyles = () => {
    const buttonStyles = [
      styles.button,
      styles[`${type}Button`],
      styles[`${size}Button`],
    ];

    if (disabled) {
      buttonStyles.push(styles.disabledButton);
      // Add specific disabled styles based on type
      buttonStyles.push(styles[`${type}DisabledButton`]);
    }

    if (width) {
      buttonStyles.push({width});
    }

    if (style) {
      buttonStyles.push(style);
    }

    return buttonStyles;
  };

  const getTextStyles = () => {
    const textStyles = [
      styles.text,
      styles[`${type}Text`],
      styles[`${size}Text`],
    ];

    if (disabled) {
      textStyles.push(styles.disabledText);
      // Add specific disabled text styles based on type
      textStyles.push(styles[`${type}DisabledText`]);
    }

    if (textStyle) {
      textStyles.push(textStyle);
    }

    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}>
      {leftComponent && !loading && (
        <View style={styles.leftComponentContainer}>{leftComponent}</View>
      )}

      {loading ? (
        <ActivityIndicator
          color={type === 'primary' ? '#FFFFFF' : '#007AFF'}
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}

      {rightComponent && !loading && (
        <View style={styles.rightComponentContainer}>{rightComponent}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },

  // Button types
  primaryButton: {
    backgroundColor: '#007AFF',
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  textButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 4,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    borderWidth: 0,
  },
  successButton: {
    backgroundColor: '#34C759',
    borderWidth: 0,
  },

  // Button sizes
  smallButton: {
    height: 32,
    paddingHorizontal: 12,
  },
  mediumButton: {
    height: 44,
    paddingHorizontal: 16,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 20,
  },

  // Disabled state
  disabledButton: {
    opacity: 0.5,
  },
  primaryDisabledButton: {},
  secondaryDisabledButton: {},
  outlineDisabledButton: {},
  textDisabledButton: {},
  dangerDisabledButton: {},
  successDisabledButton: {},

  // Text styling
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Text colors based on button type
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  outlineText: {
    color: '#333333',
  },
  textText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  successText: {
    color: '#FFFFFF',
  },

  // Text sizes based on button size
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Disabled text
  disabledText: {},
  primaryDisabledText: {},
  secondaryDisabledText: {},
  outlineDisabledText: {},
  textDisabledText: {},
  dangerDisabledText: {},
  successDisabledText: {},

  // Icon containers
  leftComponentContainer: {
    marginRight: 8,
  },
  rightComponentContainer: {
    marginLeft: 8,
  },
});

export default Button;
