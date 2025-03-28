import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { WEB_NAME, CATEGORY_NAME_LIST, CATEGORY_LINK_LIST } from '../../constants.js';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid ">
        <a className="navbar-brand" href="/">{WEB_NAME}</a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav w-100 d-flex" id="navbarNav">
            {CATEGORY_NAME_LIST.map((item, index) => (
              <li key={index} className="nav-item flex-fill text-center navbar-category-element">
                <a className="nav-link" href={CATEGORY_LINK_LIST[index]}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
		
      </div>
    </nav>
  );
};

export default Navbar;
