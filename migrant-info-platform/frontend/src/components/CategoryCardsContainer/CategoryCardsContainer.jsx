import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CategoryCardsContainer.css";
import "../../assets/styles/globals.css"
import {
  CATEGORY_NAME_LIST,
  CATEGORY_DESCRIPTION_LIST,
  CATEGORY_COLOR_LIST,
  CATEGORY_LOGO_LIST_WHITE,
  CATEGORY_LOGO_LIST_HOVERED,
  CATEGORY_LINK_LIST
} from '../../constants.js';


const CategoryCard = ({ name, description, logoWhite, logoHovered, link, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleReadMore = () => {
    window.location.href = link;  
  };

  return (
    <div className="col mb-4 wrapper">
      <div
        className="card card-conteiner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={style}
      >
        <img
          src={isHovered ? logoHovered : logoWhite}
          alt={name}
          className="card-img d-block mx-auto"
          style={{ width: '100px', height: '100px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{name}</h5>
          <p className="card-text flex-grow-1">{description}</p>
          <button 
            type="button" 
            className="btn card-btn"
            onClick={handleReadMore}
          >
            Read more
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryCardsContainer = () => (
  <div className="container-fluid my-4 container-fluid-for-cards">
    {/* <div className="row custom-gutter row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"> */}
    <div className="row custom-gutter row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
      {CATEGORY_NAME_LIST.map((name, idx) => (
        <CategoryCard
          key={idx}
          name={name}
          description={CATEGORY_DESCRIPTION_LIST[idx]}
          logoWhite={CATEGORY_LOGO_LIST_WHITE[idx]}
          logoHovered={CATEGORY_LOGO_LIST_HOVERED[idx]}
          link={CATEGORY_LINK_LIST[idx]}
          style={{ 
              '--card-color': CATEGORY_COLOR_LIST[idx],
            }}
        />
      ))}
    </div>
  </div>
);

export default CategoryCardsContainer;