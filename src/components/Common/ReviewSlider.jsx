import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { FaStar } from "react-icons/fa"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "../../App.css"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (reviews.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [reviews])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    )
  }

  // Function to determine visible reviews based on screen size
  const getVisibleReviews = () => {
    if (!reviews.length) return []
    
    const isMobile = windowWidth < 640
    const isTablet = windowWidth >= 640 && windowWidth < 1024
    
    const visibleCount = isMobile ? 1 : isTablet ? 2 : 4
    const result = []
    
    for (let i = 0; i < visibleCount && i < reviews.length; i++) {
      const index = (currentIndex + i) % reviews.length
      result.push(reviews[index])
    }
    
    return result
  }

  const visibleReviews = getVisibleReviews()

  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto relative">
        {reviews.length > 0 && (
          <>
            <div className="flex space-x-4 overflow-hidden">
              {visibleReviews.map((review, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 min-w-[250px] md:min-w-[300px] flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 rounded-lg h-full"
                  style={{ 
                    width: windowWidth < 640 ? '100%' : 
                           windowWidth < 1024 ? '48%' : '23%' 
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={handlePrev}
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-richblack-900 text-white p-2 rounded-full shadow-md hover:bg-richblack-700 transition-all z-10"
              aria-label="Previous review"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={handleNext}
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-richblack-900 text-white p-2 rounded-full shadow-md hover:bg-richblack-700 transition-all z-10"
              aria-label="Next review"
            >
              <FaChevronRight />
            </button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? "bg-yellow-100" : "bg-richblack-600"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider