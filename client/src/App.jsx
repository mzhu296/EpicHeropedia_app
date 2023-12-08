import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import List from './pages/List';
import Superhero from './pages/Superhero';
import Admin from './pages/Admin';
import axios from 'axios';
import {Toaster} from 'react-hot-toast'

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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
          <Route path="/list" element={<List />} />
          <Route path="/superhero" element={<Superhero />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
