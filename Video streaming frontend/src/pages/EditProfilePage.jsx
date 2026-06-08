import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import "./EditProfielPage.css"
export default function EditProfilePage(){
    const [error,setError]=useState(null)
const [loading,setLoading]=useState(false)
const [formData,setFormData]=useState({
    fullName:"",
    email:""
})
const navigate=useNavigate()
const handleInputChange=(e)=>{
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
}
const handleClick=async(e)=>{
    e.preventDefault();
    setError("")
    setLoading(true)
    try{
        const response=await api.patch("/users/update-account",formData)
        if(response.status===200){
            navigate('/')
        }
    }catch(e){
        console.log("Error in update",e)
        setError(e.response?.data?.message || "Something went wrong. Please try again.")
    }finally{
        setLoading(false)
    }

}
return (
    <div className="edit-info-page-wrapper">
      <div className="edit-info-card-box">
        <h2 className="edit-info-title">Update Profile Details</h2>
        
        {error && <div className="edit-info-error-alert">{error}</div>}
        
        <div className="media-edit-navigation-toolbar">
          <button 
            type="button" 
            className="secondary-nav-btn" 
            onClick={() => navigate("/edit/avatar")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-btn-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.5 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 0-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            Edit Avatar
          </button>

          <button 
            type="button" 
            className="secondary-nav-btn" 
            onClick={() => navigate("/edit/cover")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="nav-btn-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 Schad.375 0 1 1-.75 0 .375 .375 0 0 1 .75 0Z" />
            </svg>
            Edit Cover Image
          </button>
        </div>

        <hr className="form-inner-divider" />

        <form onSubmit={handleClick} className="edit-info-form">
          <div className="input-field-group">
            <label className="field-label">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              className="text-input-box"
              placeholder="Enter your full name"
              onChange={handleInputChange} 
              value={formData.fullName}
            />
          </div>

          <div className="input-field-group">
            <label className="field-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="text-input-box"
              placeholder="yourname@example.com"
              onChange={handleInputChange} 
              value={formData.email}
            />
          </div>

          <button type="submit" disabled={loading} className="edit-info-submit-btn">
            {loading ? "Updating info..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}