import logo from './logo.svg';
import './App.css';
import './assets/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // sometimes may be needed
import { WEB_NAME } from './constants.js';

import Navbar from "./components/Navbar/Navbar.jsx"
import CategoryCardsContainer from "./components/CategoryCardsContainer/CategoryCardsContainer.jsx"
import Chatbot from "./components/Chatbot/Chatbot.jsx";

import homepageImg from './assets/images/lt3.jpg';

function App() {
  return (
    <>
      <div className="homepage-img-container text-center mb-4">
        <Navbar/>
        <img src={homepageImg} className="img-fluid" alt="Vilnius"></img>
        <div className="overlay-content">
          {/* <h1 id="web-title" className="text-center">
            {WEB_NAME}
          </h1>
          <hr className="homepage-text-separator" />
          <p>Access practical tools and up-to-date info for work, health, taxes, and residency — all in one place.
          </p> */}
          <h1 className="homepage-title">MADE FOR MIGRANTS, AT EVERY STAGE OF LIFE IN LITHUANIA</h1>
          {/* <hr className="homepage-text-separator" /> */}
          <p className="homepage-subtitle">Access practical tools and up-to-date info for work, health, taxes, and residency — all in one place.</p>

        </div>
      </div>
      
      <div className="CategoryCardsContainer">
        <CategoryCardsContainer />
      </div>
      <Chatbot/>
    </>
  );
}

export default App;
