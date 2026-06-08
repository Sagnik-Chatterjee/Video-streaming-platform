import api from "./utils/api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './AddVideoPage.css'
export default function AddVideoPage(){
    const [formData,setFormData]=useState({
        title:"",
        description:""
    })
    const [videoFile,setVideoFile]=useState(null)
    const [thumbnail,setthumbnail]=useState(null)
    const [loading,setLoading]=useState(null)
    const[error,setError]=useState(null)
    const navigate=useNavigate()
    const handleSubmit=async (e)=>{
        e.preventDefault()
        setError("")
        setLoading(true)

        const dataPayLoad=new FormData()
        dataPayLoad.append("title",formData.title)
        dataPayLoad.append("description", formData.description)
        dataPayLoad.append("videoFile",videoFile)
        dataPayLoad.append("thumbnail",thumbnail)
        try{
            const response=await api.post('/videos/',dataPayLoad,
                {
                    headers:{
            "Content-Type": "multipart/form-data",
          }
                }
            )
            if(response.status==201){
              navigate('/')
            }
        }catch(e){
            console.log("Error in uploading:",e)
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
        }finally{
            setLoading(false)
        }
    }

    const handleInputChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    return (
  <div className="upload-page-wrapper">
    <div className="upload-card-box">
      <h2 className="upload-title">Upload Video</h2>
      
      {error && <div className="upload-error-alert">{error}</div>}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="input-field-group">
          <label className="field-label">Title *</label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder="Give your video a catchy title"
            className="text-input-box"
            value={formData.title} 
            onChange={handleInputChange}
          />
        </div>

        <div className="input-field-group">
          <label className="field-label">Description *</label>
          <textarea 
            name="description" 
            required 
            placeholder="Tell your viewers what your video is about..."
            className="text-input-box textarea-box"
            value={formData.description} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="input-field-group">
          <label className="field-label">Video File *</label>
          <input 
            type="file" 
            accept="video/*" 
            name="video-file" 
            required 
            className="file-input-handler"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </div>

        <div className="input-field-group">
          <label className="field-label">Thumbnail Image *</label>
          <input 
            type="file" 
            accept="image/*" 
            name="thumbnail" 
            required 
            className="file-input-handler"
            onChange={(e) => setthumbnail(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading} className="upload-submit-btn">
          {loading ? "Uploading video..." : "Publish Video"}
        </button>
      </form>
    </div>
  </div>
);

}