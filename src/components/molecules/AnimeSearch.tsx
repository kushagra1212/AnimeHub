import { forwardRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AnimeSearch = forwardRef(
  (props: any, ref: React.LegacyRef<TextInput>) => {
    const {
      goBackHandler,
      searchText,
      handleSearch,
      handleSearchSubmit,
      showBackButton,
    } = props;

    return (
      <View style={specificStyles.container}>
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
            ref={ref}
            style={specificStyles.input}
            placeholder="Search Anime"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
});

export default AnimeSearch;
