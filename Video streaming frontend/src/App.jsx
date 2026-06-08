import './App.css'
import { Route,Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Homepage from './pages/Homepage.jsx'
import Videopage from './pages/Videopage.jsx'
import Navbar from './pages/Navbar.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AddVideoPage from './AddVideoPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import EditAvatarPage from './pages/EditAvatarPage.jsx'
import EditCoverPage from './pages/EditCoverPage.jsx'
import UpdateThumbnail from './pages/UpdateThumbnail.jsx'
import UpdateTitle from './pages/UpdateTitle.jsx'
import UpdateDescription from './pages/UpdateDescription.jsx'
import SearchPage from './pages/SearchPage.jsx'
function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/video/:id' element={<Videopage/>}/>
      <Route path='/profile/:username' element={<ProfilePage/>}/>
      <Route path='/register' element={<RegisterPage/>}></Route>
      <Route path='/addvideo' element={<AddVideoPage/>}/>
      <Route path='/userprofile/:id' element={<UserProfilePage/>}/>
      <Route path='/edit/profile' element={<EditProfilePage/>}/>
      <Route path='/edit/avatar' element={<EditAvatarPage/>}/>
      <Route path='/edit/cover' element={<EditCoverPage/>}></Route>
      <Route path='/update/thumbnail/:id' element={<UpdateThumbnail/>}></Route>
      <Route path='/update/title/:id' element={<UpdateTitle/>}></Route>
      <Route path='/update/desc/:id' element={<UpdateDescription/>}></Route>
      <Route path='/search' element={<SearchPage/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
