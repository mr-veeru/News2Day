import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaBalanceScale, FaBriefcase, FaDesktop, FaFire, FaGamepad, FaGlobe, FaGrinSquint, FaHeart, FaLaugh, FaPrayingHands, FaQuoteLeft, FaStarAndCrescent, FaTshirt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [categories, setCategories] = useState([]); 
  const [data, setData] = useState([]); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const newsCollection = collection(db, 'newsFeeds');
        const querySnapshot = await getDocs(newsCollection);
        
        const uniqueCategories = new Set();
        querySnapshot.forEach(doc => {
          const data = doc.data();
          uniqueCategories.add(data.category);
        });

        const sortedCategories = Array.from(uniqueCategories).sort();
        setCategories(sortedCategories);

        const feeds = [];
        querySnapshot.forEach((doc) => {
          feeds.push({ ...doc.data(), id: doc.id });
        });

        feeds.sort((a, b) => a.date.toDate() - b.date.toDate());

        feeds.forEach(feed => {
          const engagementRate = feed.likes / feed.views;
          feed.engagementRate = engagementRate || 0;
        });

        setData(feeds);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategories();
  }, []);

  const categoryIcons = {
    Memes: <FaGrinSquint />,
    Joke: <FaLaugh />,
    Job: <FaBriefcase />,
    Festivals: <FaStarAndCrescent/>,
    Love: <FaHeart/>,
    Quotes: <FaQuoteLeft/>, 
    Games: <FaGamepad/>,
    Devotional: <FaPrayingHands/>, 
    Politics: <FaBalanceScale/>, 
    Technology: <FaDesktop/>, 
    Trending: <FaFire/>,
    Dress: <FaTshirt/>,
    International: <FaGlobe/>
  };

  return (
    <div className="dashboard-container">
      {categories.map((category, index) => (
        <div key={index}>
          <Link className="category-link" to={`/news/${category}`}>
            {categoryIcons[category]} 
            <span>{category}</span> 
          </Link>
        </div>
      ))}
      
      {data.length > 0 && (
        <div className="performance-reports">
          <h2>Performance Reports</h2>
          <div className="performance-chart">
            <h3>Likes Over Time</h3>
            <ResponsiveContainer width="100%" height={222} className="ResponsiveContainer">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="performance-chart">
            <h3>Views Over Time</h3>
            <ResponsiveContainer width="100%" height={222} className="ResponsiveContainer">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="performance-chart">
            <h3>Engagement Rate Over Time</h3>
            <ResponsiveContainer width="100%" height={222} className="ResponsiveContainer">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagementRate" stroke="#ffc658" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

};

export default Dashboard;
