import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Superhero from './pages/Superhero';
import axios from 'axios';
import {Toaster} from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{duration : 2000}} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/superhero" element={<Superhero />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
