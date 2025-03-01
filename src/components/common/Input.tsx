import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {EyeIcon} from './Icons';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  leftComponent,
  rightComponent,
  onRightComponentPress,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  style,
  editable = true,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
  autoCorrect = false,
  onBlur,
  onFocus,
  testID,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleFocus = e => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = e => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          !editable && styles.disabledInput,
          style,
        ]}>
        {leftComponent && (
          <View style={styles.leftComponentContainer}>{leftComponent}</View>
        )}

        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          autoCorrect={autoCorrect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightComponentContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}>
            <EyeIcon visible={isPasswordVisible} />
          </TouchableOpacity>
        )}

        {rightComponent && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightComponentContainer}
            onPress={onRightComponentPress}
            activeOpacity={0.7}
            disabled={!onRightComponentPress}>
            {rightComponent}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#FFF',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  focusedInput: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  disabledInput: {
    backgroundColor: '#F2F2F2',
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
    paddingTop: 12,
  },
  leftComponentContainer: {
    marginRight: 10,
  },
  rightComponentContainer: {
    marginLeft: 10,
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input;
