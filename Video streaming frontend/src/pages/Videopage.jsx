import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Videopage.css"
import { useAuth } from "../context/AuthContext";
import capitalize from "../utils/capitalize";
export default function Videopage(){
  const {user}=useAuth()
  const navigate=useNavigate()
    const [videoData, setvideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ownerId,setOwnerId]=useState(null)
    const [channelData,setChannelData]=useState(null)
    const [subRefresh, setSubRefresh] = useState(false);
    const{id}=useParams()
    const fetchVideos=async()=>{
        try{
            setLoading(true)
        const response=await api.get(`/videos/video/${id}`);
        const{data}=response
        setvideoData(data.data)
        setOwnerId(data.data.owner)
    }catch(e){
        console.log("Error",e)
    }finally{
        setLoading(false)
    }
    }

    const fetchChannelDetails = async (ownerId) => {
  try {
    const response = await api.get(`/users/p/${ownerId}`);
    
    const data = response.data.data;
    setChannelData(data)
  } catch (error) {
    console.error("Failed to retrieve channel profile context info:", error);
  }
};

       useEffect(()=>{
        if(id){
        fetchVideos()
        }
    },[id])

    useEffect(()=>{
      if(ownerId){
        fetchChannelDetails(ownerId)
      }
    },[ownerId,subRefresh])

    const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/profile/${channelData.username}`)
    }
  };

  const handleSubscribeClick = async () => {
    if (!user) {
    navigate("/login");
    return;
  }

  try {
    await api.post(
      `/subscriptions/c/${ownerId}`,{},
    );
    setSubRefresh(prev => !prev);
    
  } catch (error) {
    console.error("Subscription toggle failed:", error);
  }
  };

    if (loading) return <div className="video-loading">Loading Player...</div>
    if (!videoData) return <div className="video-error">Video not found.</div>

    return (
    <div className="video-page-container">
      <div className="player-wrapper">
        <video 
          className="main-video-player"
          src={videoData.videoFile} 
          controls 
          poster={videoData.thumbnail}
        />
      </div>
      
      <div className="video-details-section">
        <h1 className="video-title-view">{capitalize(videoData.title)}</h1>
        {channelData ? (
          <div className="channel-bar-container" onClick={handleProfileClick}>
            <div className="channel-profile-group">
              <img className="channel-avatar" src={channelData.avatar} alt="Channel avatar" />
              <div className="channel-text-details">
                <p className="channel-username">{capitalize(channelData.username)}</p>
              </div>
            </div>
            {user?._id !== ownerId && (
              <button className={`subscribe-btn ${channelData.isSubscribed ? 'subscribed' : 'not-subscribed'}`} onClick={handleSubscribeClick}>
                {channelData.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        ) : (
        <p className="channel-loading-text">Channel Data loading...</p>
      )}
        <div className="video-metadata-bar">
          <span className="view-count-badge">{videoData.views} views</span>
        </div>
        <p className="video-description-text">{videoData.description}</p>
      </div>
    </div>
  );
}