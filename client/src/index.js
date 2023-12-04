import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Assuming you have a global stylesheet
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Wrap the App component with the Router component to enable routing
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root') // This should match the ID of the root element in your HTML file
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";

// import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );   //both code works
