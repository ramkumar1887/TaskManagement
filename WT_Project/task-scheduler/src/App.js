import react, { useEffect, useState } from 'react'
import Main from './components/mainComp';

function App() {
  // State to hold the theme value
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check the user's theme preference using window.matchMedia
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to update the theme based on media query
    const handleThemeChange = (e) => {
      const newTheme = e.matches ? "dark" : "light"; // Check if the theme is dark or light
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme); // Update local storage
    };

    // Set the initial theme based on the current system preference
    handleThemeChange(mediaQuery);

    // Add listener to detect theme changes
    mediaQuery.addEventListener("change", handleThemeChange);

    // Clean up the event listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []); // Empty dependency array to run effect only once on mount
  // Update the theme on the document body when the theme state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
