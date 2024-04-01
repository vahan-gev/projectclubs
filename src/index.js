import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Protected from './components/Protected/Protected';
import Home from './components/Home/Home';
import User from './components/User/User';
import PostPage from './components/PostPage/PostPage';
import FriendsPage from './components/Friends/FriendsPage';
import ClubsPage from './components/Clubs/ClubsPage';
import CreateClub from './components/Clubs/CreateClub';
import Settings from './components/Settings/Settings';
import IndividualClub from './components/Clubs/IndividualClub';
import NotFound from './components/NotFound/NotFound';
import EditClub from './components/Clubs/EditClub';
import Messages from './components/Messages/Messages';
import EmailNotVerified from './components/EmailNotVerified/EmailNotVerified';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signup" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route element={<Protected />}>
        <Route path="/" index element={<Home />} />
        <Route path="/user/:username" element={<User />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/clubs/create" element={<CreateClub />} />
        <Route path="/club/:id" element={<IndividualClub />} />
        <Route path="/clubs/list/:username" element={<ClubsPage />} />
        <Route path="/clubs/edit/:id" element={<EditClub />} />
        <Route path="/messages" element={<Messages />} />
      </Route>
      <Route path="emailnotverified" element={<EmailNotVerified />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);


