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
      setTheme(e.matches ? "dark" : "light");
    };

    // Set the initial theme
    handleThemeChange(mediaQuery);
    
  })
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
