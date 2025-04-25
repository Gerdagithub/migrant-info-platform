import logo from './logo.svg';
import './App.css';
import './assets/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // sometimes may be needed
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { WEB_NAME } from './constants.js';

import Navbar from "./components/Navbar/Navbar.jsx"
import CategoryCardsContainer from "./components/CategoryCardsContainer/CategoryCardsContainer.jsx"
import Chatbot from "./components/Chatbot/Chatbot.jsx";

import homepageImg from './assets/images/lt3.jpg';

import CategoryPage from './components/CategoryPage';


function App() {
  const path = window.location.pathname;
  const categoryMatch = path.match(/^\/categories\/([a-z0-9-]+)$/);

  if (categoryMatch) {
    const slug = categoryMatch[1]; // extract slug from URL
    return <CategoryPage slug={slug} />;
  }

  if (path === '/categories/taxes') {
    return <CategoryPage slug="taxes" />;
  }

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
