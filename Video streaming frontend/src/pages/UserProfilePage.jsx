import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import "./UserProfilePage.css";
import { useNavigate } from "react-router-dom";
import capitalize from "../utils/capitalize";
export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("videos");
  const{id}=useParams()
  const[userProfile,setUserProfile]=useState([])
  const [videos,setVideos]=useState([])
  const [subscription,setSubscription]=useState([])
  const[subscribers,setSubscribers]=useState(0)
  const [reload,setReload]=useState(0)
  const[loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const navigate=useNavigate();
  const fetchUser=async()=>{
  setError("")
  setLoading(true)
  try{
    const response=await api.get('/users/current-user')
    setUserProfile(response.data.data)
  }catch(e){
    setError(e.response?.data?.message || "Some error occured" )
  }finally{
    setLoading(false)
  }
  }
  const fetchVideos=async()=>{
  setError("")
  setLoading(true)
  try{
    const response=await api.get(`/videos/channel/${id}`)
    setVideos(response.data.data)
  }catch(e){
    setError(e.response?.data?.message || "Some error occured" )
  }finally{
    setLoading(false)
  }
  }
const fetchSubscription=async()=>{
  setLoading(true)
  setError("")
  try{
  const response=await api.get(`/subscriptions/c/${id}`)
  setSubscription(response.data.data)
  }catch(e){
    setError(e.response?.data?.message || "Some error occured" )
  }finally{
    setLoading(false)
  }
}
const fetchSubscribed=async()=>{
  setLoading(true)
  setError("")
  try{
  const response=await api.get(`/subscriptions/u/${id}`)
  setSubscribers(response?.data?.data?.length)
  }catch(e){
    setError(e.response?.data?.message || "Some error occured" )
  }finally{
    setLoading(false)
  }
}
useEffect(()=>{
    fetchUser()
    fetchVideos()
    fetchSubscription()
    fetchSubscribed()
},[reload])
const handleChannelClick=(username)=>{
  navigate(`/profile/${username}`)
}
const handleVideoClick=(id)=>{
  navigate(`/video/${id}`)
}
const handleEditClick=()=>{
  navigate('/edit/profile')
}
const handleUpdateThumbnail=(id)=>{
  navigate(`/update/thumbnail/${id}`)
}
const handleUpdateTitle=(id)=>{
  navigate(`/update/title/${id}`)
}
const handleUpdateDescription=(id)=>{
  navigate(`/update/desc/${id}`)
}
const handleDeleteVideo=async(id)=>{
  try{
    const response=await api.patch(`/videos/video/${id}`)
    setReload((e)=>e+1)
  }catch(e){
    setError(e.response?.data?.message || "Some error occured" )
  }
}
  return (
    error? <div>Something went wrong...</div>:
    loading ? <div>Loading Data...</div>:
    <div className="profile-container">
      <div className="profile-header-container">
  <div className="cover-image-frame">
    {userProfile.coverImage ? (
      <img src={userProfile.coverImage} alt="Cover" className="cover-img" />
    ) : (
      <div className="cover-placeholder"></div>
    )}
  </div>

  <div className="identity-content-row">
    <div className="avatar-frame">
      <img src={userProfile.avatar} alt="Avatar" className="profile-avatar-img" />
    </div>
    
    <div className="text-metadata-block">
      <h2 className="profile-display-name">{capitalize(userProfile.username)}</h2>
      <p>{subscribers} Subscriber(s)</p>
    </div>
  </div>
</div>

      <div className="tabs-navigation-strip">
        <button 
          className={`tab-anchor-btn ${activeTab === "videos" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button 
          className={`tab-anchor-btn ${activeTab === "info" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          About
        </button>
        <button 
          className={`tab-anchor-btn ${activeTab === "channels" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("channels")}
        >
          Subscriptions
        </button>
      </div>

      <hr className="profile-divider" />

      <div className="tab-viewport-content">
        {activeTab === "videos" && (
  <div className="creator-videos-wrapper">
    {videos.length === 0 ? (
      <div className="empty-videos-msg">No videos uploaded yet.</div>
    ) : (
      <div className="creator-videos-grid">
        {videos.map((e) => {
          return (
            <div className="creator-video-card" key={e._id}>
              <div className="video-thumbnail-wrapper" onClick={()=>handleVideoClick(e._id)}>
                <img className="video-thumbnail-img" src={e.thumbnail} alt="Thumbnail" />
                <span className="video-duration-pill">
                  {Math.floor(e.duration / 60)}:{String(Math.floor(e.duration % 60)).padStart(2, '0')}
                </span>
              </div>
              <div className="creator-video-info" onClick={()=>handleVideoClick(e._id)}>
                <h4 className="creator-video-title" title={e.title}>{capitalize(e.title)}</h4>
                <p className="creator-video-views">{e.views} views</p>
              </div>
              <div className="video-management-actions">
                <button className="mgmt-btn edit-title-btn" onClick={()=>{handleUpdateTitle(e._id)}}>Edit Title</button>
                <button className="mgmt-btn edit-desc-btn" onClick={()=>{handleUpdateDescription(e._id)}}>Edit Desc</button>
                <button className="mgmt-btn edit-thumb-btn" onClick={()=>handleUpdateThumbnail(e._id)}>Edit Thumb</button>
                <button className="mgmt-btn delete-video-btn" onClick={()=>handleDeleteVideo(e._id)}>Delete Video</button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}
{activeTab === "info" && (
  <div className="creator-info-panel-wrapper">
    <div className="creator-info-card">
      <h3 className="info-card-heading">Account Information</h3>
      
      <div className="info-data-list">
        <div className="info-data-row">
          <span className="info-data-label">Full Name</span>
          <span className="info-data-value">{userProfile.fullName}</span>
        </div>
        

        <div className="info-data-row">
          <span className="info-data-label">Email Address</span>
          <span className="info-data-value">{userProfile.email}</span>
        </div>
      </div>

      <div className="info-card-actions">
        <button className="edit-info-submit-btn" onClick={handleEditClick}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="edit-icon-svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit Profile Info
        </button>
      </div>
    </div>
  </div>
)}{activeTab === "channels" && (
  <div className="subscriptions-panel-wrapper">
    {subscription.length === 0 ? (
      <div className="empty-channels-msg">You haven't subscribed to any channels yet.</div>
    ) : (
      <div className="subscriptions-grid-layout">
        {subscription.map((e) => {
          const channelInfo = e.channel?.[0];
          if (!channelInfo) return null;

          return (
            <div className="channel-subscriber-card" key={channelInfo._id}onClick={()=>handleChannelClick(channelInfo.username)}>
              <div className="channel-avatar-frame">
                <img 
                  className="channel-card-avatar" 
                  src={channelInfo.avatar || "/default-avatar.png"} 
                  alt={`${channelInfo.username}'s avatar`} 
                />
              </div>
              
              <div className="channel-card-details">
                <h4 className="channel-card-username">{channelInfo.username}</h4>
                <span className="channel-card-badge">Subscribed</span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}
