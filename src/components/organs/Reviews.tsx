import { useQuery } from '@apollo/client';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import RenderHTML from 'react-native-render-html';
import { baseStyleHtmlDesc } from './NewsCard';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils';
import { GET_ANIME_REVIEWS } from '../../graphql/queries/anime-queries';
import { memo } from 'react';
const Reviews = ({ mediaId }) => {
  const perPage = 10;
  const {
    loading: loadingReview,
    error: reviewError,
    data: reviewsData,
    fetchMore,
  } = useQuery(GET_ANIME_REVIEWS, {
    variables: {
      mediaId: parseInt(mediaId),
      page: 1,
      perPage,
      sort: ['RATING'],
    },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  if (loadingReview) {
    return (
      <View style={reviewStyles.container}>
        <ActivityIndicator size="large" color="#888888" />
      </View>
    );
  }

  if (reviewError) {
    return (
      <View style={reviewStyles.container}>
        <Text style={reviewStyles.errorText}>Error: {reviewError.message}</Text>
      </View>
    );
  }

  const reviewsPageInfo = reviewsData?.Page.pageInfo;
  const reviews = reviewsData?.Page?.reviews;

  const loadMoreReviews = () => {
    if (reviewsPageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          page: reviewsPageInfo.currentPage + 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            Page: {
              ...prev.Page,
              reviews: [...prev.Page.reviews, ...fetchMoreResult.Page.reviews],
              pageInfo: fetchMoreResult.Page.pageInfo,
            },
          };
        },
      });
    }
  };

  const handleReviewPress = (reviewId) => {
    setSelectedReview(reviews.find((item) => item.id === reviewId));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  if (!reviews || reviews.length === 0) return null;
  return (
    <View style={reviewStyles.container}>
      <Text style={reviewStyles.reviews}>Reviews</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={reviewStyles.reviewContainer}
      >
        {reviews &&
          reviews.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleReviewPress(item.id)}
              style={reviewStyles.reviewCard}
            >
              <Image
                style={reviewStyles.avatar}
                source={{ uri: item.user.avatar.medium }}
              />
              <View style={reviewStyles.reviewInfo}>
                <Text style={reviewStyles.reviewUsername}>
                  {item.user.name}
                </Text>
                <Text style={reviewStyles.reviewDate}>
                  {new Date(item.createdAt * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <RenderHTML
                  contentWidth={200}
                  ignoredDomTags={['center']}
                  baseStyle={baseStyleHtmlDesc}
                  source={{ html: item.body.slice(0, 100) + '....' }}
                />
              </View>
            </TouchableOpacity>
          ))}
        {reviewsPageInfo?.hasNextPage && (
          <TouchableOpacity
            style={reviewStyles.loadMoreButton}
            onPress={loadMoreReviews}
          >
            <AntDesign name="arrowright" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
        style={{}}
      >
        <View style={reviewStyles.modalContainer}>
          {selectedReview && (
            <View style={reviewStyles.modalContent}>
              <TouchableOpacity
                style={reviewStyles.closeButton}
                onPress={closeModal}
              >
                <AntDesign name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Image
                style={reviewStyles.avatar}
                source={{ uri: selectedReview.user.avatar.medium }}
              />
              <Text style={reviewStyles.reviewUsername}>
                {selectedReview.user.name}
              </Text>
              <Text style={reviewStyles.reviewDate}>
                {new Date(selectedReview.createdAt * 1000).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </Text>
              <ScrollView>
                <RenderHTML
                  contentWidth={200}
                  ignoredDomTags={['center']}
                  baseStyle={baseStyleHtmlDesc}
                  source={{ html: selectedReview.body }}
                />
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const reviewStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  reviews: {
    fontSize: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontFamily: 'extra-bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  reviewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    width: 280,
    height: 300,
    borderRadius: 22,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blackPure,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: 'center',
  },
  reviewInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUsername: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: 'extra-bold',
  },
  reviewDate: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 12,
    opacity: 0.8,
    fontFamily: 'thin',
  },
  reviewBody: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: 'thin',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginTop: 16,
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loadMoreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.blackPure,
    borderRadius: 52,
    padding: 16,
    height: '100%',
  },
});
export default memo(Reviews);
