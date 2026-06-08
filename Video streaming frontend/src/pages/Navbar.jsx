
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Video, LogIn, UserPlus } from 'lucide-react'; // Clean modern UI icons
import './Navbar.css';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search,setSearch]=useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleAddClick=()=>{
    if(!user){
      navigate('/login')
      return
    }
      navigate('/addvideo')
  }
  const handleSearch=(e)=>{
    e.preventDefault()
    if(!search.trim()){
      return
    }
    const encodedQuery = encodeURIComponent(search.trim());
    navigate(`/search?q=${encodedQuery}`);
  }

  return (
  <nav className="navbar">
    <div className="nav-container">
      {/* Brand/Logo Section */}
      <Link to="/" className="nav-logo">
        <Video className="logo-icon" />
        <span>Streaming Platform</span>
      </Link>

      <button className="nav-add-video-btn" onClick={handleAddClick}>
        + Add Video
      </button>

      <form onSubmit={handleSearch} className="nav-search-form">
        <input 
          type="text" 
          placeholder="Search videos..."
          onChange={(e) => { setSearch(e.target.value) }} 
          value={search}
          className="nav-search-input"
        />
        <button type='submit' className="nav-search-submit-btn">Search</button>
      </form>

      <div className="nav-actions">
        {user ? (
          <>
            <button 
              className="nav-btn profile-btn"
              onClick={() => navigate(`/userprofile/${user._id}`)}
            >
              <User size={18} />
              <span>{user.username}</span>
            </button>
            
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span className="btn-text">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link login-link">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
            
            <Link to="/register" className="nav-btn register-btn">
              <UserPlus size={18} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
}