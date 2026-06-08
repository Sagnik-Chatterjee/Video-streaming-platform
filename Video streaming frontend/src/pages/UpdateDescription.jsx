import { useParams } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import "./EditTitle.css"
export default function UpdateDescription(){
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [desc,setDesc]=useState({description:""})
    const navigate=useNavigate()
    const {id}=useParams()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        try{
            const response=await api.patch(`/videos/description/${id}`,desc)
            console.log(response)
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
          <label className="edit-avatar-label">Description</label>
          <textarea
            required 
            value={desc.description}
            className="edit-avatar-input-file"
            onChange={(e) => { setDesc({description:e.target.value}) }} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="edit-avatar-submit-btn"
          >
            {loading ? "Updating Description" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}