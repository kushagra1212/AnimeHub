import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import StickButton, { StickFilterButton } from '../ui-components/StickButton';
import {
  genreOptions,
  sortOptions,
  statusOptions,
  typeOptions,
} from '../../utils';
import { Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
const { width: WINDOW_WIDTH } = Dimensions.get('window');

type FilterSheetProps = {
  handleGenreChange: (genre: string) => void;
  selectedGenre: string;
  handleTypeChange: (type: string) => void;
  selectedType: string;
  handleSortChange: (sort: string) => void;
  selectedSort: string;
  handleStatusChange: (status: string) => void;
  selectedStatus: string;
};

const FilterSheet: React.FC<FilterSheetProps> = ({
  handleGenreChange,
  selectedGenre,
  handleTypeChange,
  selectedType,
  handleSortChange,
  selectedSort,
  handleStatusChange,
  selectedStatus,
}) => {
  return (
    <View style={{ height: '100%', width: WINDOW_WIDTH }}>
      <View style={styles.filterContainer}>
        <View style={styles.filterView}>
          <Text style={styles.filterLabel}>Genre</Text>
          <View style={styles.filterValueView}>
            <FlatList
              data={genreOptions}
              horizontal
              renderItem={({
                item,
              }: {
                item: { label: string; value: string };
              }) => (
                <StickFilterButton
                  text={item.label}
                  canvasHeight={100}
                  canvasWidth={item.label.length * 35}
                  dx={(item.label.length * 25) / 2}
                  dy={30}
                  textColor="white"
                  textFontFamily="extra-bold"
                  onPress={() => handleGenreChange(item.value)}
                  isActive={item.value === selectedGenre}
                />
              )}
              keyExtractor={(item) => item.label.toString()}
            />
          </View>
        </View>
        <View style={styles.filterView}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterValueView}>
            <FlatList
              data={typeOptions}
              horizontal
              renderItem={({
                item,
              }: {
                item: { label: string; value: string };
              }) => (
                <StickFilterButton
                  text={item.label}
                  canvasHeight={100}
                  canvasWidth={item.label.length * 35}
                  dx={(item.label.length * 25) / 2}
                  dy={30}
                  textColor="white"
                  textFontFamily="extra-bold"
                  onPress={() => handleTypeChange(item.value)}
                  isActive={item.value === selectedType}
                  // colors={['#9F33FC', '#7F2CC7']}
                />
              )}
              keyExtractor={(item) => item.label.toString()}
            />
          </View>
        </View>
        <View style={styles.filterView}>
          <Text style={styles.filterLabel}>Sort</Text>
          <View style={styles.filterValueView}>
            <FlatList
              data={sortOptions}
              horizontal
              renderItem={({
                item,
              }: {
                item: { label: string; value: string };
              }) => (
                <StickFilterButton
                  text={item.label}
                  canvasHeight={100}
                  canvasWidth={item.label.length * 25}
                  dx={(item.label.length * 20) / 2}
                  dy={30}
                  textColor="white"
                  textFontFamily="extra-bold"
                  onPress={() => handleSortChange(item.value)}
                  isActive={item.value === selectedSort}
                  // colors={['#E65192', '#A93A6B']}
                />
              )}
              keyExtractor={(item) => item.label.toString()}
            />
          </View>
        </View>

        <View style={styles.filterView}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterValueView}>
            <FlatList
              data={statusOptions}
              horizontal
              renderItem={({
                item,
              }: {
                item: { label: string; value: string };
              }) => (
                <StickFilterButton
                  text={item.label}
                  canvasHeight={100}
                  canvasWidth={item.label.length * 35}
                  dx={(item.label.length * 20) / 2}
                  dy={30}
                  textColor="white"
                  textFontFamily="extra-bold"
                  onPress={() => handleStatusChange(item.value)}
                  isActive={item.value === selectedStatus}
                  // colors={['#3D4C7E', '#263050']}
                />
              )}
              keyExtractor={(item) => item.label.toString()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    display: 'flex',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  filterView: {
    display: 'flex',
  },
  filterLabel: {
    color: 'white',
    fontFamily: 'extra-bold',
    fontSize: 25,
    margin: 10,
  },
  filterValueView: {
    position: 'relative',
    marginLeft: 0,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});

export default FilterSheet;
