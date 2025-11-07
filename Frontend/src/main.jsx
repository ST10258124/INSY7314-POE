import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render( 
  <StrictMode>
   <App />
  </StrictMode>,
)

/////////////////////////////////////////////////////////////

//import React from "react";
//import ReactDOM from "react-dom/client";
//import App from "./App";
//import "./index.css";

//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(<App />);