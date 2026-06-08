import { useState } from "react"
import api from "../utils/api"
import { useNavigate } from "react-router-dom"
import "./EditCoverPage.css"
export default function EditCoverPage(){
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [cover,setCover]=useState(null)
    const navigate=useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        const dataPayload=new FormData()
        dataPayload.append("coverImage",cover)
        try{
            const response=await api.patch('/users/cover-image',dataPayload)
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
          <label className="edit-avatar-label">Cover Image</label>
          <input 
            type="file" 
            accept="image/*" 
            required 
            className="edit-avatar-input-file"
            onChange={(e) => { setCover(e.target.files[0]) }} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="edit-avatar-submit-btn"
          >
            {loading ? "Updating Cover Image" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}