import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CategoryCardsContainer.css"
import { WEB_NAME, CATEGORY_NAME_LIST, CATEGORY_LINK_LIST } from '../../constants.js';

const CategoryCardsContainer = () => {
  return (
	<>
	<div className="container-fluid px-0 category-grid">
      <div className="row gx-0">
        {CATEGORY_NAME_LIST.map((name, index) => (
          <div key={index} className="col-6 d-flex col-md-6">
            <a 
				href={CATEGORY_LINK_LIST[index]}
				className={index % 2 == 0
					? "category-card ms-auto"
					: "category-card me-auto"}>
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
	</>
  )
};

export default CategoryCardsContainer;
