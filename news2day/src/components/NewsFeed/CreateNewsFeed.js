import React from 'react';
import { db, storage } from '../../config/firebase'; 
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useFormik } from 'formik'; 
import * as yup from 'yup'; 
import "./CreateNewsFeed.css"

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  category: yup.string().required('Category is required'),
  file: yup.mixed().required('File is required'),
}); 
 
const CreateNewsFeed = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      category: '',
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (!values.file) {
          console.error('No file selected.');
          return;
        }
        
        const imageRef = ref(storage, `images/${uuidv4()}`);
        await uploadBytes(imageRef, values.file);
        const imgUrl = await getDownloadURL(imageRef);

        const newFeed = {
          title: values.title,
          content: values.content,
          category: values.category,
          img: imgUrl,
          date: serverTimestamp(),
          views: 0,
          likes: 0,
          engagementRate: 0
        };

        await addDoc(collection(db, 'newsFeeds'), newFeed);
        alert("News article added successfully");

        formik.resetForm(); 
      } catch (error) {
        alert('Error adding news feed')
        console.error('Error adding news feed:', error);
      }
    },
  });
  
  return (
    <div className="parent-container">
      <h1>Add a News Article</h1> {/* Moved outside container1 */}
      <div className='container1'>
        <form onSubmit={formik.handleSubmit}>
          <label>Title:</label>
          <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} />
          {formik.touched.title && formik.errors.title && <div className="error-message">{formik.errors.title}</div>}

          <label>Content:</label>
          <textarea name="content" rows={6} value={formik.values.content} onChange={formik.handleChange} />
          {formik.touched.content && formik.errors.content && <div className="error-message">{formik.errors.content}</div>}

          <label>Category:</label>
          <input type="text" name="category" value={formik.values.category} onChange={formik.handleChange} />
          {formik.touched.category && formik.errors.category && <div className="error-message">{formik.errors.category}</div>}

          <label>Upload Image/Video:</label>
          <input type="file" accept="image/*, video/*" onChange={(event) => formik.setFieldValue("file", event.currentTarget.files[0])} />
          {formik.touched.file && formik.errors.file && <div className="error-message">{formik.errors.file}</div>}

          <button type="submit">Publish</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewsFeed;
