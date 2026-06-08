import  { useState, useEffect } from "react";
import "./Homepage.css";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import capitalize from "../utils/capitalize";
export default function VideoHomeGrid() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 
  const LIMIT = 10;
const navigate=useNavigate()
  const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/videos?page=${page}&limit=${LIMIT}`);
        const newVideos = response.data.data;

        if (newVideos.length < LIMIT) {
          setHasMore(false);
        }

        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      } catch (err) {
        console.error("Error pulling paginated videos database feed:", err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchVideos();
  }, [page]);

  return (
    <div className="home-feed-container">
      <div className="videos-grid-layout">
        {videos.map((v) => (
          <div className="video-card-item" key={v._id} onClick={()=>navigate(`/video/${v._id}`)}>
            <div className="thumbnail-frame">
              <img className="video-thumbnail-img" src={v.thumbnail} alt="Thumbnail" />
              <span className="video-duration-badge">
                {Math.floor(v.duration / 60)}:{String(Math.floor(v.duration % 60)).padStart(2, '0')}
              </span>
            </div>
            <div className="video-info-block">
              <h4 className="video-title-heading">{capitalize(v.title)}</h4>
              <p className="video-creator-name">{capitalize(v.owner[0].username)}</p>
              <p className="video-views-stat">{v.views} views</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-controls-footer">
        {loading && <div className="spinner-loading-banner">Loading more videos...</div>}
        
        {!loading && hasMore && (
          <button 
            className="load-more-action-btn" 
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Load More Videos
          </button>
        )}

        {!hasMore && videos.length > 0 && (
          <div className="end-of-feed-message">You've reached the end of the catalog.</div>
        )}
      </div>
    </div>
  );
}