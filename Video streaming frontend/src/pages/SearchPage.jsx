import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css"
import capitalize from "../utils/capitalize";
export default function SearchPage(){
const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
const navigate=useNavigate()
  const LIMIT = 10;
  const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await api.get(
          `/videos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${LIMIT}`
        );
        
        const fetchedVideos = response.data.data;
        setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);

        if (fetchedVideos.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Search fetch failed:", error.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
  setVideos([]);
  setHasMore(true);
}, [query]);

    useEffect(()=>{
        fetchSearchResults()
    },[page,query ])

    const handleVideoClick=(id)=>{
        navigate(`/video/${id}`)
    }
    return (
  <div className="search-feed-container">
    <div className="search-results-title">Search Results:</div>
    
    <div className="videos-grid-layout">
      {videos.map((e) => {
        return (
          <div key={e._id} className="video-card-item" onClick={() => handleVideoClick(e._id)}>
            <div className="thumbnail-frame">
              <img src={e.thumbnail} alt="Thumbnail" className="video-thumbnail-img" />
              <div className="video-duration-badge">{Math.floor(e.duration / 60)}:{String(Math.floor(e.duration % 60)).padStart(2, '0')}</div>
            </div>
            
            <div className="video-info-block">
              <div className="video-title-heading">{capitalize(e.title)}</div>
              <div className="video-creator-name">{capitalize(e.owner[0].username)}</div>
              <div className="video-views-stat">{e.views} Views</div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="pagination-controls-footer">
      {loading && <div className="spinner-loading-banner">Searching videos...</div>}
      
      {!loading && videos.length === 0 && (
        <div className="end-of-feed-message">No videos found</div>
      )}
      
      {!loading && hasMore ? (
        <button className="load-more-action-btn" onClick={() => setPage((e) => e + 1)}>
          Load more videos
        </button>
      ) : (
        videos.length > 0 && <div className="end-of-feed-message">End of catalog</div>
      )}
    </div>
  </div>
);
}