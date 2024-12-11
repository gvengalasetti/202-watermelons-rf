import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Phone, DollarSign, Tag, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import Review2 from './Review2';
import RestaurantReviewSection from './RestaurantReviewSection';

const RestaurantCard = ({ restaurant }) => {
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [restaurantPhotos, setRestaurantPhotos] = useState([]);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState(null);

  // Fetch restaurant photos when component mounts
  useEffect(() => {
    const fetchRestaurantPhotos = async () => {
      try {
        setIsPhotosLoading(true);

        // Construct the URL with the restaurant ID as a query parameter
        const url = new URL('/get-restaurant-photos');
        url.searchParams.append('restaurant_id', restaurant._id);

        // Make the GET request
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant photos');
        }

        // Parse the JSON response
        const data = await response.json();
        console.log("Response data:", data);

        // Handle the specific response structure from your backend
        if (data && data.photos && data.photos.length > 0) {
          setRestaurantPhotos(data.photos);
        } else {
          // Fallback to placeholders if no photos
          setRestaurantPhotos([
            "client/public/images_stock/images (1).jpeg",
            "client/public/images_stock/images (3).jpeg",
            "client/public/images_stock/images.jpeg",
            "client/public/images_stock/Palace+Grill+Restaurant-100.jpg"
          ]);
        }
        setIsPhotosLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurant photos:", error);
        setPhotosError(error);
        // Fallback to placeholders if fetch fails
        setRestaurantPhotos([
          "client/public/images_stock/images (1).jpeg",
          "client/public/images_stock/images (3).jpeg",
          "client/public/images_stock/images.jpeg",
          "client/public/images_stock/Palace+Grill+Restaurant-100.jpg"
        ]);
        setIsPhotosLoading(false);
      }
    };

    // Only fetch photos if restaurant has an ID
    if (restaurant._id) {
      fetchRestaurantPhotos();
    }
  }, [restaurant._id]);

  // Construct full address
  const fullAddress = restaurant.address || 
    `${restaurant.location?.street}, ${restaurant.location?.city}, ${restaurant.location?.state} ${restaurant.location?.zip}`;

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-6 bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Restaurant Photo */}
      <div className="w-full h-64 overflow-hidden">
        {isPhotosLoading ? (
          <div className="w-full h-full bg-gray-300 animate-pulse"></div>
        ) : photosError ? (
          <div className="text-red-500 text-sm text-center py-4">
            Failed to load photos
          </div>
        ) : (
          <img 
            src={restaurantPhotos[0]} 
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content Container */}
      <div className="flex">
        {/* Left Hemisphere - Restaurant Details */}
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 mr-1" fill="currentColor" />
              <span className="font-semibold">{restaurant.rating || 'N/A'}</span>
            </div>
          </div>
          
          {/* Contact and Location Details */}
          <div className="space-y-2 flex-grow">
            {/* Category */}
            {restaurant.category && (
              <div className="flex items-center text-gray-700">
                <Tag className="w-5 h-5 mr-2 text-purple-500" />
                <span className="text-sm">{restaurant.category}</span>
              </div>
            )}
            
            {/* Address */}
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              <span className="text-sm">{fullAddress}</span>
            </div>
            
            {/* Hours */}
            {restaurant.hours && (
              <div className="flex flex-col text-gray-700">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsHoursExpanded(!isHoursExpanded)}
                >
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm font-semibold">Hours:</span>
                  {isHoursExpanded ? (
                    <ChevronUp className="ml-2 text-gray-500" size={16} />
                  ) : (
                    <ChevronDown className="ml-2 text-gray-500" size={16} />
                  )}
                </div>
                {isHoursExpanded && (
                  <ul className="pl-7 text-sm mt-1">
                    {Object.entries(restaurant.hours).map(([day, hours]) => (
                      <li key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}: {hours}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Price Level */}
            {restaurant.price_level && (
              <div className="flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm">Price Level: {restaurant.price_level}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {restaurant.description && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Description:</h3>
              <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>
          )}
        </div>

        {/* Right Hemisphere - Reviews */}
        <div className="w-1/3 p-4 bg-gray-100 flex flex-col items-center">
          {/* Reviews Section */}
          <div className="w-full">
            <div 
              className="flex items-center justify-between cursor-pointer bg-white p-2 rounded"
              onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                <span>Reviews</span>
              </div>
              {isReviewsExpanded ? (
                <ChevronUp className="text-gray-500" size={16} />
              ) : (
                <ChevronDown className="text-gray-500" size={16} />
              )}
            </div>

            {isReviewsExpanded && (
              <div className="mt-2">
                {/* Review Components */}
                <Review2 restaurantId={restaurant._id} />
                <RestaurantReviewSection restaurantId={restaurant._id} />

                {/* Detailed Reviews */}
                {restaurant.reviews && restaurant.reviews.length > 0 && (
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {restaurant.reviews.map((review, index) => (
                      <div key={index} className="mb-2 bg-gray-100 p-2 rounded shadow-sm">
                        <p className="text-sm">
                          <strong>{review.author_name}</strong>: {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;