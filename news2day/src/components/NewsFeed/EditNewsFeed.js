import React, { useState } from 'react';
import { db, storage } from '../../config/firebase'; 
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditNewsFeed = ({ feed, onSave }) => {
  const [editedFeed, setEditedFeed] = useState({ ...feed });
  const [newImage, setNewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFeed({
      ...editedFeed,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSave = async () => {
    try {
      let imgUrl = editedFeed.img;
      if (newImage) {
        const imgRef = ref(storage, `Imgs/${newImage.name}`);
        await uploadBytes(imgRef, newImage);
        imgUrl = await getDownloadURL(imgRef);
      }

      const updatedFeedData = { ...editedFeed, img: imgUrl };
      await updateDoc(doc(db, 'newsFeeds', feed.id), updatedFeedData);
      onSave(updatedFeedData, feed.id);
    } catch (error) {
      console.error('Error updating news feed:', error);
    }
  };

  return (
    <div>
      <h3>Edit News Feed</h3>
      <form>
        Title: <input type="text" name="title" value={editedFeed.title} onChange={handleInputChange} /><br/><br/>
        Content: <textarea name="content" value={editedFeed.content} onChange={handleInputChange} /><br/><br/>
        Category: <input type="text" name="category" value={editedFeed.category} onChange={handleInputChange} /><br/><br/>
        New Image/Video: <input type="file" accept="image/*, video/*" onChange={handleImageChange} /><br/><br/>

        <button type="button" onClick={handleSave}>Save Changes</button>
      </form>
      
      <div className="preview">
        <h4>Preview</h4>
        <p>Title: {editedFeed.title}</p>
        <p>Content: {editedFeed.content}</p>
        <p>Category: {editedFeed.category}</p>
        {newImage && <img src={URL.createObjectURL(newImage)} alt="Uploaded" style={{ maxWidth: '50%', height: 'auto' }} />}
        {!newImage && <img src={editedFeed.img} alt="Current" style={{ maxWidth: '50%', height: 'auto' }} />}
      </div>
    </div>
  );
};

export default EditNewsFeed;
