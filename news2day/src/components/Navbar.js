import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { FaChartBar, FaNewspaper, FaPlus, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setIsVisible(prev => !prev); // Toggle the visibility state
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!isLoggedIn || !isVisible) {
    return null;
  }

  return (
    <div className="navbar">
      <Link to={'/dashboard'} className="nav-link">
        <div className="icon-text-container"><FaChartBar size={20} /> <span className="icon-text">Dashboard</span></div>
      </Link>
      <Link to={'/news'} className="nav-link">
        <div className="icon-text-container"><FaNewspaper size={20} /> <span className="icon-text">News</span></div>
      </Link>
      <Link to={'/create-news-feed'} className="nav-link">
        <div className="icon-text-container"><FaPlus size={20} /> <span className="icon-text">Create news</span></div>
      </Link>
      <Link to={'/manage-news-feeds'} className="nav-link">
        <div className="icon-text-container"><FaCog size={20} /> <span className="icon-text">Manage</span></div>
      </Link>

      <button className="logout-button" onClick={handleLogout}>
        <div className="icon-text-container"><FaSignOutAlt size={20} /> <span className="icon-text">Logout</span></div>
      </button>
    </div>
  );
};

export default Navbar;
