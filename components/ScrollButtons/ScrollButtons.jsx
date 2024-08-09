import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollButtons = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setShowTopButton(scrollTop > 300);
      setShowBottomButton(scrollTop + clientHeight < scrollHeight - 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = (target, duration) => {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };

  const scrollToTop = () => {
    smoothScroll(0, 1000);
  };

  const scrollToBottom = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    smoothScroll(scrollHeight, 1000);
  };

  return (
    <>
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 w-[85px] hover:opacity-100 flex items-center
           bg-NavyBlue text-white px-2 py-3 mb-2 rounded-full shadow-lg transition-colors duration-300 hover:bg-LightBlue"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
          En üst
        </button>
      )}
      {showBottomButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-8 right-4 hover:opacity-100 flex w-[85px] items-center bg-NavyBlue
           text-white px-2 py-3 rounded-full shadow-lg transition-colors duration-300 hover:bg-LightBlue"
          aria-label="Scroll to bottom"
        >
          <FaArrowDown />
          En alt
        </button>
      )}
    </>
  );
};

export default ScrollButtons;
