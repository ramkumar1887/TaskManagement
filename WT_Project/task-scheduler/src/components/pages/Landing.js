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
    setIsComplete(false); // Reset completion state

    let index = -1; // Start at -1 to properly capture the first character at 0

    const typeEffect = () => {
      index++; // Increment index

      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText.charAt(index));
        typingTimeout.current = setTimeout(typeEffect, 100); // Continue typing
      } else {
        setIsComplete(true); // Typing complete
      }
    };

    typeEffect(); // Start typing immediately

    return () => clearTimeout(typingTimeout.current); // Cleanup on unmount
  }, [currentIndex, fullText]);

  // Image fade-in effect
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.opacity = 0;
      imgRef.current.onload = () => {
        imgRef.current.style.transition = 'opacity 0.5s';
        imgRef.current.style.opacity = 1;
      };
    }
  }, [image]);

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 7000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <div className="landing-page-text">
          <h1 className="landing-page-head">
            {displayText}
            <span className="cursor">{isComplete ? '.' : '•'}</span>
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
