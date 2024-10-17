import React, { useState, useEffect, useRef } from 'react';

const carouselItems = [
  { text: "Organize Your Life Better With PlanPal", image: "/assets/images/1.jpg" },
  { text: "Stay on Top of Your Tasks and Goals", image: "/assets/images/2.jpg" },
  { text: "Collaborate Seamlessly with Teams", image: "/assets/images/3.jpg" },
  { text: "Streamline Your Workflow for Maximum Efficiency", image: "/assets/images/4.jpg" },
];

const Landing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const typingTimeout = useRef(null);
  const intervalRef = useRef(null);
  const imgRef = useRef(null);

  const { text: fullText, image } = carouselItems[currentIndex];

  // Typing effect for carousel text
  useEffect(() => {
    setDisplayText(''); // Reset text
    setIsComplete(false); // Reset completion flag
    let index = 0; // Start typing from the first letter

    const typeEffect = () => {
      if (index <= fullText.length) {
        setDisplayText((prev) => prev + fullText.charAt(index)); // Append current letter
        index++;
        typingTimeout.current = setTimeout(typeEffect, 100); // Typing speed
      } else {
        setIsComplete(true); // Typing is complete
      }
    };

    typeEffect(); // Start typing animation

    return () => clearTimeout(typingTimeout.current); // Cleanup on unmount
  }, [currentIndex, fullText]);

  // Image fade-in effect
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.opacity = 0; // Hide image initially
      imgRef.current.onload = () => {
        imgRef.current.style.transition = 'opacity 0.5s'; // Set transition
        imgRef.current.style.opacity = 1; // Fade in image
      };
    }
  }, [image]);

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 10000); // 10-second interval

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <div className="landing-page-text">
          <h1 className="landing-page-head">
            {displayText}
            <span className="cursor">{isComplete ? '.' : '|'}</span>
          </h1>
        </div>
        <div className="landing-img-container">
          <img src={image} ref={imgRef} className="landing-img" alt="Carousel Slide" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
