import { useParams } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import "./EditTitle.css"
export default function UpdateTitle(){
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [title,setTitle]=useState({title:""})
    const navigate=useNavigate()
    const {id}=useParams()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        const dataPayload=new FormData()
        dataPayload.append("title",title)
        try{
            const response=await api.patch(`/videos/title/${id}`,title)
            if(response.status===200){
                navigate('/')
            }
        }catch(e){
            setError(e.response?.data?.message || "Something went Wrong")
        }finally{
            setLoading(false)
        }
    }
return (
  <>
    <div className="edit-avatar-container">
      <div className="edit-avatar-card">
        {error && <div className="edit-avatar-error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="edit-avatar-form">
          <label className="edit-avatar-label">Title</label>
          <input 
            type="text"  
            required 
            value={title.title}
            className="edit-avatar-input-file"
            onChange={(e) => { setTitle({title:e.target.value}) }} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="edit-avatar-submit-btn"
          >
            {loading ? "Updating Title" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}