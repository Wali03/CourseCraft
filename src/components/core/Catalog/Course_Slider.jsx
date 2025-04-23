import React, { useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Course_Card from "./Course_Card"

function Course_Slider({ Courses }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

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
    if (!Courses?.length) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === Courses.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [Courses])

  const handlePrev = () => {
    if (!Courses?.length) return
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Courses.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    if (!Courses?.length) return
    setCurrentIndex((prevIndex) => 
      prevIndex === Courses.length - 1 ? 0 : prevIndex + 1
    )
  }

  // Function to determine visible courses based on screen size
  const getVisibleCourses = () => {
    if (!Courses?.length) return []
    
    const isMobile = windowWidth < 640
    const isTablet = windowWidth >= 640 && windowWidth < 1024
    
    const visibleCount = isMobile ? 1 : isTablet ? 2 : 3
    const result = []
    
    for (let i = 0; i < visibleCount && i < Courses.length; i++) {
      const index = (currentIndex + i) % Courses.length
      result.push(Courses[index])
    }
    
    return result
  }

  const visibleCourses = Courses?.length ? getVisibleCourses() : []

  return (
    <>
      {Courses?.length ? (
        <div className="relative max-h-[30rem]">
          <div className="flex space-x-6 overflow-hidden">
            {visibleCourses.map((course, i) => (
              <div 
                key={i}
                className="flex-shrink-0"
                style={{ 
                  width: windowWidth < 640 ? '100%' : 
                         windowWidth < 1024 ? '48%' : '31%' 
                }}
              >
                <Course_Card course={course} Height={"h-[250px]"} />
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-richblack-900 text-white p-2 rounded-full shadow-md hover:bg-richblack-700 transition-all z-10"
            aria-label="Previous course"
          >
            <FaChevronLeft />
          </button>
          <button 
            onClick={handleNext}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-richblack-900 text-white p-2 rounded-full shadow-md hover:bg-richblack-700 transition-all z-10"
            aria-label="Next course"
          >
            <FaChevronRight />
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {Courses.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-yellow-100" : "bg-richblack-600"
                }`}
                aria-label={`Go to course ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
