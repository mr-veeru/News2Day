import React, { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, updateDoc, doc, where, addDoc, deleteDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import "./News.css";

const News = () => {
  const { currentUser } = useContext(AuthContext);
  const { category } = useParams();
  const [news, setNews] = useState([]);
  const [likesData, setLikesData] = useState({});
  const LikeIcon = <FaThumbsUp />;
  const UnlikeIcon = <FaThumbsDown />;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = category ? query(collection(db, 'newsFeeds'), where('category', '==', category)) : query(collection(db, 'newsFeeds'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const updatedNews = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.date) {
              updatedNews.push({ id: doc.id, ...data });
            }
          });
          updatedNews.sort((a, b) => {
            const dateA = a.date ? a.date.toDate() : new Date(0);
            const dateB = b.date ? b.date.toDate() : new Date(0);
            return dateB - dateA;
          });
          setNews(updatedNews);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [category, currentUser]);

  useEffect(() => {
    const storedLikesData = localStorage.getItem('likesData');
    if (storedLikesData) {
      setLikesData(JSON.parse(storedLikesData));
    }
  }, []);

  const handleLike = async (id) => {
    try {
      if (!currentUser) {
        console.error('Current user is null');
        return;
      }

      const userLiked = likesData[id]?.includes(currentUser.uid);

      if (userLiked) {
        await deleteDoc(doc(db, `newsFeeds/${id}/likes/${currentUser.uid}`));
        const updatedLikesData = { ...likesData, [id]: likesData[id].filter(uid => uid !== currentUser.uid) };
        setLikesData(updatedLikesData);
        localStorage.setItem('likesData', JSON.stringify(updatedLikesData));
      } else {
        await addDoc(collection(db, `newsFeeds/${id}/likes`), { userId: currentUser.uid });
        const updatedLikesData = { ...likesData, [id]: [...(likesData[id] || []), currentUser.uid] };
        setLikesData(updatedLikesData);
        localStorage.setItem('likesData', JSON.stringify(updatedLikesData));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };


  const handleView = async (id) => {
    try {
      const newsRef = doc(db, 'newsFeeds', id);
      await updateDoc(newsRef, {
        views: isNaN(news.find(item => item.id === id).views) ? 1 : news.find(item => item.id === id).views + 1
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const calculateHoursAgo = (date) => {
    const now = new Date();
    const uploadTime = date.toDate();
    const diffInMs = now - uploadTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.floor(diffInHours) + " hours ago";
  };

  return (
    <div className="news-container">
      {news.map(item => (
        <div className="news-item" key={item.id} onClick={() => handleView(item.id)}>
          <div className="image-container">
            {item.img && (
              <>
                <img className="news-img" src={item.img} alt="News" />
                <p className="category">{item.category}</p>
                <p className="title">News2Day</p>
              </>
            )}
          </div>
 
          <div className="news-content">
            <h3>{item.title}</h3>
            {item.content && <p className='content'>{item.content}</p>}
          </div>
          
          <div className="line"></div>
          
          <div className="metadata">
            <div className="likes">
              <button onClick={() => handleLike(item.id)}>
                {likesData[item.id]?.includes(currentUser.uid) ? UnlikeIcon : LikeIcon}
              </button>
              <p>{likesData[item.id]?.length || 0}</p>
            </div>
            <p className="views">Views: {isNaN(item.views) ? 0 : item.views}</p>
            <p className="time">{calculateHoursAgo(item.date)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default News;
