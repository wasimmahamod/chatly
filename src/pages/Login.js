import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiError } from 'react-icons/bi'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { userLoginInfo } from './../slices/userSlice';
import { useDispatch } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const auth = getAuth();
  let dispatch=useDispatch()
  let navigate=useNavigate()
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [emailerr, setEmailerr] = useState('')
  let [passworderr, setPassworderr] = useState('')
  let [loader, setLoader] = useState(false)

  let handleEmail = (e) => {
    setEmail(e.target.value)
    setEmailerr('')
  }
  let handlePassword = (e) => {
    setPassword(e.target.value)
    setPassworderr('')
  }

  let handleSubmit = (e) => {
    e.preventDefault()

    if (!email) {
      setEmailerr('Email Is Required')
    }

    if (!password) {
      setPassworderr('Passowrd Is Required')
    }

    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
         dispatch(userLoginInfo(user.user))
         localStorage.setItem('userInfo',JSON.stringify(user.user))
        }).then(()=>{
          toast.success("Login Successfull ");
          setLoader(true)
          setTimeout(() => {
            navigate('/home')
          }, 2000);
        })
        .catch((error) => {
          if(error.code.includes('auth/user-not-found')){
            setEmailerr('Email Not Found Please Singup')
          }
          if(error.code.includes('auth/wrong-password')){
            setPassworderr('Wrong password ')
          }
          if(error.code.includes('auth/invalid-email')){
            setEmailerr('Invalid Email (: ')
          }
          console.log(error.code)
        });
    }

  }
  return (
    <div class="h-screen md:flex">
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div class="flex w-full  md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center mb-5 p-4 rounded-b-3xl lg:rounded-none">
        <div className='text-center md:text-left'>
          <h1 class="text-white font-bold text-2xl md:text-4xl   font-pop">Chatly App </h1>
          <p className='text-white font-normal text-sm  font-pop mt-2'>Don't Have Accout ! Please Create a Account </p>
          <Link className='mx-auto inline-block ' to='/'>
            <button type="submit" class="block w-28  font-pop bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">SingUp</button>
          </Link>
        </div>
      </div>
      <div class="flex w-full  lg:w-1/2 justify-center items-center bg-white">
        <form class="bg-white">
          <h1 class="text-gray-800 font-bold text-2xl mb-4 font-pop">Welcome Back :)</h1>
          <div className='mb-4'>
            <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-2">
              <img className='h-5 w-5 text-gray-400' src="images/email.svg" alt="" />
              <input onChange={handleEmail} class="pl-2 outline-none border-none" type="email" id="" placeholder="Email Address" />
              {emailerr &&
                <BiError className='text-red-500' />
              }
            </div>

            {emailerr &&
              <p className='font-pop text-sm  text-red-500'>{emailerr}</p>
            }
          </div>
          <div className='mb-4'>
            <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-2">
              <img className='w-5 h-5' src="images/password.svg" alt="" />
              <input onChange={handlePassword} class="pl-2 outline-none border-none" type="text" id="" placeholder="Password" />
              {passworderr &&
                <BiError className='text-red-500' />
              }
            </div>
            {passworderr &&
              <p className='font-pop text-sm text-red-500 '>{passworderr}</p>
            }
          </div>
          <div className='flex justify-center'>

            {loader ?
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
              :
              <button onClick={handleSubmit} class="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Login</button>
            }
          </div>
          <Link to='/resetpassword' >
          <span class="text-sm ml-2 hover:text-blue-500 cursor-pointer">Forgot Password ?</span>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login