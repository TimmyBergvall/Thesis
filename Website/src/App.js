import './App.css';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"




import Home from "./components/Home"
import Navbar from "./components/Navbar"



function App() {
  
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />


        
          {/*If path is not found, redirect to Home*/}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  </>
  );
}

export default App;
