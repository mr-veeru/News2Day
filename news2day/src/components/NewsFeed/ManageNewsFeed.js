import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../config/firebase'; 
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import './ManageNewsFeed.css';

const ManageNewsFeed = () => {
  const [newsFeeds, setNewsFeeds] = useState([]);
  const [editedFeedId, setEditedFeedId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchNewsFeeds = async () => {
      try {
        const newsCollection = collection(db, 'newsFeeds');
        const snapshot = await getDocs(newsCollection);
        const feeds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), editMode: false }));
        // Sort the feeds based on date in descending order
        feeds.sort((a, b) => b.date.toDate() - a.date.toDate());
        setNewsFeeds(feeds);
      } catch (error) {
        console.error('Error fetching news feeds:', error);
      }
    };

    fetchNewsFeeds();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'newsFeeds', id));
      setNewsFeeds(newsFeeds.filter(feed => feed.id !== id));
      setSuccessMessage('News feed deleted successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Error deleting news feed:', error);
    }
  };

  const handleEdit = (id) => {
    setEditedFeedId(id);
  };

  const handleSaveEdit = async (editedData, id) => {
    try {
      const cleanData = Object.fromEntries(Object.entries(editedData).filter(([_, v]) => v !== undefined));
      await updateDoc(doc(db, 'newsFeeds', id), cleanData);
      setNewsFeeds(newsFeeds.map(feed => feed.id === id ? { ...feed, ...cleanData, editMode: false } : feed));
      setEditedFeedId(null);
    } catch (error) {
      console.error('Error editing news feed:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedFeedId(null);
  };

  const handleImageClick = () => {
    if (editedFeedId) {
      fileInputRef.current.click();
    }
  };  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const editedFeedIndex = newsFeeds.findIndex(feed => feed.id === editedFeedId);
        if (editedFeedIndex !== -1) {
          const updatedNewsFeeds = [...newsFeeds];
          updatedNewsFeeds[editedFeedIndex].img = reader.result;
          setNewsFeeds(updatedNewsFeeds);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, name) => {
    const value = e.target.value;
    const editedFeedIndex = newsFeeds.findIndex(feed => feed.id === editedFeedId);
    if (editedFeedIndex !== -1) {
      const updatedNewsFeeds = [...newsFeeds];
      updatedNewsFeeds[editedFeedIndex][name] = value;
      setNewsFeeds(updatedNewsFeeds);
    }
  };

  return (
    <div className='spacing'>
      {successMessage && <div className="successMessage">{successMessage}</div>}
      <h2 className="heading">Manage News Feeds</h2>
      <div className="cardContainer">
        {newsFeeds.map(feed => (
          <div key={feed.id} className="card">
            <div className="imageContainer">
              <img
                src={feed.img}
                alt=""
                className={`image ${editedFeedId === feed.id ? 'editMode' : ''}`}
                onClick={() => handleImageClick()}
              />
              {editedFeedId === feed.id && (
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              )}
            </div>
            <div className="cardContent">
              {editedFeedId === feed.id ? (
                <form>
                  <div>
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      value={feed.title}
                      onChange={(e) => handleInputChange(e, "title")}
                    />
                  </div>
                  <div>
                    <label htmlFor="category">Category:</label>
                    <input
                      type="text"
                      id="category"
                      value={feed.category}
                      onChange={(e) => handleInputChange(e, "category")}
                    />
                  </div>
                  <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                      id="content"
                      rows={10}
                      value={feed.content}
                      onChange={(e) => handleInputChange(e, "content")}
                    />
                  </div>
                  <button type="button" className="actionButton saveButton" onClick={() => handleSaveEdit(feed, feed.id)}>Save</button>
                  <button className="actionButton cancelButton" onClick={() => handleCancelEdit()}>Cancel</button>
                </form>
              ) : (
                <>
                  <h3>{feed.title}</h3>
                  <p><strong>Category:</strong> {feed.category}</p>
                  <p>{feed.content}</p>
                </>
              )}
              <div className="actionButtons">
                <button className="actionButton" onClick={() => handleEdit(feed.id)}>
                  <RiPencilFill />
                  <span>Edit</span>
                </button>
                <button className="actionButton" onClick={() => handleDelete(feed.id)}>
                  <RiDeleteBin6Line />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageNewsFeed;
