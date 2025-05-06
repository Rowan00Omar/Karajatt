import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
}

export default App;
