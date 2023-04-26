import "./App.css";

import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  const [selectedSources, setSelectedSources] = useState([]);

  return (
    <>
      <Navbar
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
      />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                selectedSources={selectedSources}
                setSelectedSources={setSelectedSources}
              />
            }
          />

          {/*If path is not found, redirect to Home*/}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
