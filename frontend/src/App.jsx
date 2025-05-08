import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import ProductDetail from "./components/ProductDetail";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <LandingPage /> */}
      {/* <Navbar></Navbar>
      <div className="min-h-screen bg-[#0000] w-full">
      <SearchForm />
    </div> */}
       <Router>
      <Routes>
        <Route path="/" element={<SearchForm />} />
        <Route path="/part/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
