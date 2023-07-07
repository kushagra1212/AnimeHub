import { forwardRef, memo, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Keyboard } from 'react-native';

const Search = forwardRef(
  (props: any, ref: React.MutableRefObject<TextInput>) => {
    const {
      goBackHandler,
      searchText,
      handleSearch,
      handleSearchSubmit,
      showBackButton,
      placeholder,
      containerStyles,
      autofocus = true,
    } = props;
    const keyboardDidHideCallback = () => {
      ref.current.blur?.();
    };

    useEffect(() => {
      const keyboardDidHideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        keyboardDidHideCallback
      );

      return () => {
        keyboardDidHideSubscription?.remove();
      };
    }, []);
    return (
      <View style={containerStyles}>
        {showBackButton && (
          <AntDesign
            onPress={goBackHandler}
            name="arrowleft"
            size={24}
            color="black"
            style={specificStyles.icon}
          />
        )}
        <View style={specificStyles.inputContainer}>
          <TextInput
            autoFocus={autofocus}
            ref={ref}
            style={specificStyles.input}
            placeholder={placeholder}
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            placeholderTextColor="rgba(139, 148, 150, 0.51)"
          />
        </View>
      </View>
    );
  }
);

const specificStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.greenPrimary,
    color: COLORS.white,
    elevation: 2,
    width: '100%',
  },
  icon: {
    marginRight: 8,
    color: COLORS.white,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: COLORS.white,
  },
  input: {
    fontSize: 16,
    fontFamily: 'semi-bold',
    color: COLORS.white,
    paddingVertical: 12,
  },
});

export default memo(Search);
