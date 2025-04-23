import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CategoryCardsContainer.css"
import {
  CATEGORY_NAME_LIST,
  CATEGORY_LOGO_LIST,
  CATEGORY_DESCRIPTION_LIST
} from '../../constants.js';

const CategoryCardsContainer = () => (
  <div className="container my-4">
    <div className="row justify-content-left">
      {CATEGORY_NAME_LIST.map((name, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="card card-conteiner">
            <img
              src={CATEGORY_LOGO_LIST[idx]}
              className="card-img"
              alt={name}
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{name}</h5>
              <p className="card-text flex-grow-1">
                {CATEGORY_DESCRIPTION_LIST[idx]}
              </p>
              <button type='button' className='btn card-btn'>Read more ></button>
            </div>

          </div>
        </div>
      ))}
    </div>

  </div>
);

export default CategoryCardsContainer;
