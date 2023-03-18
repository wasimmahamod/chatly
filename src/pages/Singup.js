import React, { useState } from 'react'
import { json, Link } from 'react-router-dom';
import { BiError } from 'react-icons/bi'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { getDatabase, ref, set } from "firebase/database";
import { userLoginInfo } from './../slices/userSlice';
import { ThreeDots } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Singup = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let [email, setEmail] = useState('')
  let [name, setName] = useState('')
  let [password, setPassword] = useState('')
  let [emailerr, setEmailerr] = useState('')
  let [nameerr, setNameerr] = useState('')
  let [passworderr, setPassworderr] = useState('')
  let [loader, setLoader] = useState(false)

  let handleName = (e) => {
    setName(e.target.value)
    setNameerr('')

  }
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
    if (!name) {
      setNameerr('Name Is Required')
    }
    if (!password) {
      setPassworderr('Passowrd Is Required')
    }

    if (name && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          updateProfile(auth.currentUser, {
            displayName: name, photoURL: "images/profile.png"
          }).then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                set(ref(db, 'users/' + user.user.uid), {
                  name: name,
                  email: email,
                  img: 'images/profile.png'
                }).then(() => {
                  toast.success("Registration Successfull ");
                  setLoader(true)
                  setTimeout(() => {
                    navigate("/login")
                  }, 2000);
                })
              });


          }).catch((error) => {
            console.log(error.code)
          });
        })
        .catch((error) => {
          console.log(error.code)
          if (error.code.includes('auth/email-already-in-use')) {
            setEmailerr('Email Already In Use')
          }
          if (error.code.includes('auth/weak-password')) {
            setPassworderr('Please Enter a Strong Password')
          }
          if (error.code.includes('auth/invalid-email')) {
            setEmailerr('Invalid Email')
          }
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
      <div class="flex w-full md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center p-4 mb-5 rounded-b-3xl lg:rounded-none">
        <div className='text-center md:text-left'>
          <h1 class="text-white font-bold text-2xl md:text-4xl  font-pop">Chatly App </h1>
          <p class="text-white mt-2 hidden md:block">Create an account to enjoy all the services without any ads for free!</p>
          <p className='text-white font-normal text-sm  font-pop mt-2'>Already Have an Acount !</p>
          <Link className='mx-auto inline-block ' to='/login'>
            <button type="submit" class="block w-28  font-pop bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2 text-center">Login</button>
          </Link>
        </div>
      </div>
      <div class="flex w-full md:w-1/2 justify-center items-center bg-white">
        <form class="bg-white">
          <h1 class="text-gray-800 font-bold text-2xl mb-2 font-pop">Create an account</h1>
          <div className='mb-4'>

            <div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-2">
              <img className='h-5 w-5 text-gray-400' src="images/person.svg" alt="" />
              <input onChange={handleName} class="pl-2 outline-none border-none" type="text" name="" id="" placeholder="User Name" />
              {nameerr &&
                <BiError className='text-red-500' />
              }
            </div>
            {nameerr &&
              <p className='font-pop text-sm text-red-500'>{nameerr}</p>
            }
          </div>
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
        </form>
      </div>
    </div>
  )
}

export default Singup