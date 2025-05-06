import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LandingPage />
      {/* <div className="min-h-screen bg-[#0000] w-full">
      <SearchForm />
    </div> */}
    </>
  );
}

export default App;
