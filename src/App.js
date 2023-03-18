import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Singup from './pages/Singup';
import Login from './pages/Login';
import Home from './pages/Home';
import UserList from './components/UserList';
import Chat from './components/Chat';
import Forgetpassword from './pages/Forgetpass';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Singup/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/msg",
    element: <Chat/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/resetpassword",
    element: <Forgetpassword/>,
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App