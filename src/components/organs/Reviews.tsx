import { gql, useQuery } from '@apollo/client';
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
const GET_ANIME_REVIEWS = gql`
  query Page($page: Int, $perPage: Int, $mediaId: Int, $sort: [ReviewSort]) {
    Page(page: $page, perPage: $perPage) {
      reviews(mediaId: $mediaId, sort: $sort) {
        body
        id
        user {
          id
          name
          createdAt
          avatar {
            medium
          }
        }
        createdAt
        userId
        mediaId
      }
      pageInfo {
        currentPage
        hasNextPage
        lastPage
      }
    }
  }
`;

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
      <Text style={reviewStyles.reviews}>Reviews:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={reviewStyles.reviewContainer}
      >
        {reviews &&
          reviews.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={reviewStyles.reviewCard}
              activeOpacity={0.7}
              onPress={() => handleReviewPress(item.id)}
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
                <Text>{item.body.slice(0, 100) + '....'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        {reviewsPageInfo?.hasNextPage && (
          <TouchableOpacity
            style={reviewStyles.loadMoreButton}
            onPress={loadMoreReviews}
          >
            <AntDesign name="arrowright" size={24} color="#333333" />
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={reviewStyles.modalContainer}>
          {selectedReview && (
            <View style={reviewStyles.modalContent}>
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
              <ScrollView style={reviewStyles.reviewBodyContainer}>
                <Text>{selectedReview.body}</Text>
              </ScrollView>
              <TouchableOpacity
                style={reviewStyles.closeButton}
                onPress={closeModal}
              >
                <Text style={reviewStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#333333',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  reviewInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
  },
  reviewBodyContainer: {
    maxHeight: 300,
  },
  reviewBody: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f1f1f1',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
});
export default Reviews;
