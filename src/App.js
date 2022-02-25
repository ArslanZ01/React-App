import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import LogIn from "./my-app/LogIn";
import DebugData from "./my-app/DebugData";
import NavBar from "./my-app/NavBar";
import DashBoard from "./my-app/DashBoard";

function App() {
  return (
      <BrowserRouter>
        <NavBar />
        <div className="App">
          <Routes>
            <Route path="/" element={
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            } />
            <Route path="/Log-In" element={<LogIn />} />
            <Route path="/Debug" element={<DebugData />} />
            <Route path="/DashBoard" element={<DashBoard />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
