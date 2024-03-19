import { createContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar.component'
import { Route, Routes } from 'react-router-dom'
import UserAuthForm from './pages/UserAuthForm.page';
import { lookInSession } from './common/session';
import Editor from './pages/Editor.pages';
import HomePage from './pages/Home.page';
import SearchPage from './pages/Search.page';
import PageNotFound from './pages/404.page';
import ProfilePage from './pages/Profile.page';
import BlogPage from './pages/Blog.page';
import SideNav from './components/SideNavbar.component';
import ChangePassword from './pages/Change-password.page';
import EditProfile from './pages/Edit-profile-page';


export const UserContext = createContext({})


function App() {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {

    let userInSession = lookInSession("user");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null})

  },[])


  return (
    <UserContext.Provider value={{userAuth, setUserAuth}}>
      <Routes>
        <Route path='/editor' element={<Editor />} />
        <Route path='/editor/:blog_id' element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path='settings' element={<SideNav />}>
            <Route path='edit-profile' element={<EditProfile />} />
            <Route path='change-password' element={<ChangePassword />} />
          </Route>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path='blog/:blog_id' element={<BlogPage />}/>
          <Route path='*' element={<PageNotFound/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App
