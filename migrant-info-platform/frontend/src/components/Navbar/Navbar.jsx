import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { 
  WEB_NAME, 
  CATEGORY_NAME_LIST, 
  CATEGORY_LINK_LIST,
  CATEGORY_COLOR_LIST
 } from '../../constants.js';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm custom-navbar">
      <div className="container-fluid navbar-text-container">
        <a className="navbar-brand" href="/">LT Migrant Support</a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto d-flex" id="navbarNav">
            {CATEGORY_NAME_LIST.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && (
                <li className="nav-item nav-separator">
                  <span>|</span>
                </li>
              )}
              <li 
                className="nav-item navbar-category-element"
                style={{ '--category-color': CATEGORY_COLOR_LIST[index] }}
              >
                <a className="nav-link" href={CATEGORY_LINK_LIST[index]}>
                  {item}
                </a>
              </li>
            </React.Fragment>
          ))}

          </ul>
        </div>
		
      </div>
    </nav>
  );
};

export default Navbar;
