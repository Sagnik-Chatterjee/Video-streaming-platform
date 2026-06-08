import api from "../utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css"
import { useAuth } from "../context/AuthContext";
export default function ProfilePage(){
       const {username}=useParams();
    const [profile,setProfile]=useState([]);
    const[videos,setVideos]=useState([]);
    const [sub,setSub]=useState(false)
 const navigate=useNavigate()
 const {user}=useAuth()
    const fetchUserProfile=async()=>{
        try{
        const response=await api.get(`/users/c/${username}`)
        const{data}=response
        const profileData=data.data
        console.log(profileData)
        setProfile(profileData)
        }catch(e){
            console.log("Error",e)
        }
    }
const fretchUserVideos=async()=>{
    try{
        const response=await api.get(`/videos/channel/${profile._id}`)
        const{data}=response
        setVideos(data.data)
    }catch(e){
        console.log("Error",e)
    }
}
const handleSubscribeClick=async()=>{
    try{
        const response=await api.post(`/subscriptions/c/${profile._id}`,{},);
          setSub(prev=>!prev)
    }catch(e){
        console.log("Error in Subscribing",e)
    }
}
       useEffect(()=>{
        if(username){
            fetchUserProfile()
        }
    },[username,sub])

    useEffect(()=>{
        if(profile.length!=0){
            fretchUserVideos()
        }
    },[profile])
    const handleVideoClick= (id)=>{
        navigate(`/video/${id}`)
    }
 
 return (
    profile.length === 0 ? (
      <div className="profile-loading">Loading data...</div>
    ) : (
      <>
        <div className="profile-container">
          {profile.coverImage && (
            <div className="cover-banner-wrapper">
              <img className="cover-image" src={profile.coverImage} alt="Cover Image" />
            </div>
          )}

          <div className="profile-header-bar">
            <div className="profile-identity-group">
              <div className="avatar-frame">
                <img className="profile-avatar-img" src={profile.avatar} alt="Avatar" />
              </div>
              
              <div className="profile-meta-text">
                <h2 className="profile-username">@{profile.username}</h2>
                <div className="profile-stats-row">
                  <span className="stat-badge">{profile.subscribersCount} subscribers</span>
                  <span className="stat-divider">•</span>
                  <span className="stat-badge">{profile.channelsSubscribedToCount} subscribed</span>
                </div>
              </div>
            </div>

            {user && user._id !== profile._id && (
              <button 
                className={`profile-sub-btn ${profile.isSubscribed ? 'active-sub' : 'cta-sub'}`} 
                onClick={handleSubscribeClick}
              >
                {profile.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          <hr className="profile-divider" />

          {/* Videos Grid Section */}
          <div className="videos-section-wrapper">
            <h3 className="section-title">Videos</h3>
            
            {videos.length === 0 ? (
              <div className="videos-loading">Loading Videos...</div>
            ) : (
              <div className="videos-grid-layout">
                {videos.map((v) => {
                  return (
                    <div 
                      className="video-card-item" 
                      key={v._id} 
                      onClick={() => handleVideoClick(v._id)}
                    >
                      <div className="thumbnail-frame">
                        <img className="video-thumbnail-img" src={v.thumbnail} alt="Thumbnail" />
                        <span className="video-duration-badge">
                          {Math.floor(v.duration / 60)}:{String(Math.floor(v.duration % 60)).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="video-info-block">
                        <h4 className="video-title-heading" title={v.title}>{v.title}</h4>
                        <p className="video-views-stat">{v.views} views</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
}