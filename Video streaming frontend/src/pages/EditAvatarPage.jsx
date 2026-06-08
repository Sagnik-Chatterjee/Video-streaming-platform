import { useState } from "react"
import api from "../utils/api"
import { useNavigate } from "react-router-dom"
import "./EditAvatarPage.css"
export default function EditAvatarPage(){
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [avatar,setAvatar]=useState(null)
    const navigate=useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        const dataPayload=new FormData()
        dataPayload.append("avatar",avatar)
        try{
            const response=await api.patch('/users/avatar',dataPayload)
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
          <label className="edit-avatar-label">Avatar</label>
          <input 
            type="file" 
            accept="image/*" 
            required 
            className="edit-avatar-input-file"
            onChange={(e) => { setAvatar(e.target.files[0]) }} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="edit-avatar-submit-btn"
          >
            {loading ? "Updating Avatar" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}