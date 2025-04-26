import React from 'react';
import './App.css';
import './assets/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import Navbar from "./components/Navbar/Navbar.jsx";
import CategoryCardsContainer from "./components/CategoryCardsContainer/CategoryCardsContainer.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";

import homepageImg from './assets/images/lt3.jpg';
import CategoryPage from './components/CategoryPage';

function App() {
  const path = window.location.pathname;
  const categoryMatch = path.match(/^\/categories\/([a-z0-9-]+)$/);

  let content;
  if (categoryMatch) {
    const slug = categoryMatch[1];
    content = <CategoryPage slug={slug} />;
  } else if (path === '/categories/taxes') {
    content = <CategoryPage slug="taxes" />;
  } else {
    content = (
      <>
        <div className="homepage-img-container text-center mb-4">
          <Navbar/>
          <img src={homepageImg} className="img-fluid" alt="Vilnius" />
          <div className="overlay-content">
            <h1 className="homepage-title">MADE FOR MIGRANTS, AT EVERY STAGE OF LIFE IN LITHUANIA</h1>
            <p className="homepage-subtitle">
              Access practical tools and up-to-date info for work, health, taxes, and residency — all in one place.
            </p>
          </div>
        </div>
        <div className="CategoryCardsContainer">
          <CategoryCardsContainer />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Chatbot always in the same place on every page */}
      <Chatbot />
      {content}
    </>
  );
}

export default App;