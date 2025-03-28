import logo from './logo.svg';
import './App.css';
import './assets/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // sometimes may be needed
import { WEB_NAME } from './constants.js';

import Navbar from "./components/Navbar/Navbar.jsx"
import CategoryCardsContainer from "./components/CategoryCardsContainer/CategoryCardsContainer.jsx"

function App() {
  return (
    <>
      <Navbar/>
      <h1 className='text-center mt-5 mb-3'>{WEB_NAME}</h1>
      <CategoryCardsContainer/>
    </>
  );
}

export default App;
