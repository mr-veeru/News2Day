import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateNewsFeed from './components/NewsFeed/CreateNewsFeed';
import Dashboard from './components/Dashboard';
import ManageNewsFeed from './components/NewsFeed/ManageNewsFeed';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import News from './components/News';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:category" element={<News/>} />
          <Route path="/create-news-feed" element={<CreateNewsFeed />} />
          <Route path="/manage-news-feeds" element={<ManageNewsFeed />} />
        </Routes>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
