import React, { useState, createRef,useEffect } from 'react'
import { FiUpload } from 'react-icons/fi'
import { useSelector ,useDispatch} from 'react-redux'
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString ,getDownloadURL} from "firebase/storage";
import { getAuth, updateProfile,signOut  } from "firebase/auth";
import { getDatabase, ref as dref, set,update,onValue } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Rings } from 'react-loader-spinner'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {userLoginInfo} from '../slices/userSlice'
import { useNavigate } from 'react-router-dom';
import { activeChatInfo } from '../slices/chatSlice';

const UserList = () => {
  let navigate=useNavigate()
  let dispatch=useDispatch()
  let data = useSelector((state) => state.userLoginInfo.userInfo)
  let [profilemodal, setProfileModal] = useState(false)
  let [setting, setSetting] = useState(false)
  let [loader,setLodar]=useState(false)
  let [userList,setUserList]=useState([])
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState("");
  const cropperRef = createRef('');
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLodar(true)
    toast.info("Please wait few seconds ");
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage,auth.currentUser.uid );
      const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
         
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(()=>{
            update(dref(db, 'users/' + auth.currentUser.uid), {
              img:downloadURL,
            }).then(()=>{
              setProfileModal(false)
              setLodar(false)

            })
          })
        });
      });

    }
  };


  useEffect(() => {
    const starCountRef = dref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
     let arr=[]
     snapshot.forEach((item)=>{
      if(data&&data.uid!=item.key){
        arr.push({...item.val(),id:item.key})
      }
     })
     setUserList(arr)
    });
  }, [])


  let handleLogout=()=>{
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null))
      localStorage.removeItem('userInfo')
    }).then(()=>{
      navigate('/login')
    })
  }


  let handleChatInfo=(item)=>{
    dispatch(activeChatInfo({
      name:item.name,
      email:item.email,
      img:item.img,
      id:item.id,
    }))

    localStorage.setItem('chatInfo',JSON.stringify({
      name:item.name,
      email:item.email,
      img:item.img,
      id:item.id,
    }))
    navigate('/msg')
  }
  return (
    <div className='flex justify-center px-3'>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className='w-full sm:w-[400px] lg:w-[500px] relative '>
        <div className='bg-[#2563EB] p-3 rounded-br-2xl mb-7'>
          <div className='flex  items-center gap-x-5'>
            <div className='w-[90px] h-[90px] rounded-full overflow-hidden relative group'>
              <img src={data&&data.photoURL} alt="" />
              <div className='w-full group-hover:h-full top-0  h-0 bg-[rgba(0,0,0,.4)] absolute  left-0 ease-in-out duration-150 flex justify-center items-center'>
                <FiUpload onClick={() => setProfileModal(true)} className='text-white text-2xl hidden group-hover:block ease-linear duration-150' />
              </div>
            </div>
            <div>
              
              <h2 className='font-pop text-2xl font-medium text-white  '>{data&&data.displayName}</h2>
            </div>
            <BsThreeDotsVertical onClick={()=>setSetting(true)} className='ml-auto text-white'/>
          </div>
        </div>
        <div className='w-full h-[350px] lg:h-[500px] overflow-y-scroll'>
          {userList.map((item)=>(
          <div onClick={()=>handleChatInfo(item)} className='flex items-center justify-between gap-x-3 mb-5 border-b border-solid py-3'>
            <div className='w-[20%] ' >
              {item.img
              ?
              <img className='w-[70px] lg:h-[70px] rounded-full' src={item.img} alt="" />
              :
              <img className='w-[70px] lg:h-[70px] rounded-full' src='images/profile.png' alt="" />

              }
            </div>
            <div className='w-[60%]'>
              <h3 className='font-pop font-medium text-md lg:text-lg text-[#262626]'>{item.name} </h3>
              <p className='font-pop font-normal text-xs  lg:text-sm mt-1 text-[#262626]'>Press to Chat </p>
            </div>
            <div className='w-[20%]'>
              <button className='bg-[#2563EB] py-1 px-3 text-white font-pop rounded-br-xl'>Msg</button>
            </div>
          </div>

          ))}
        

        </div>
        {
          profilemodal &&
          <div className='w-full h-full bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex items-center justify-center'>
            <div className='w-[90%]  p-5  bg-white rounded-2xl shadow-lg'>
              <h1 className='font-pop text-xl lg:text-2xl font-bold text-pop'>Upload Your Profile Photo </h1>
              <input onChange={onChange} className='font-pop text-md text-pop block mt-5 mb-5 w-full' type='file' />
              {image?
              <div className='w-[90px] h-[90px] rounded-full mx-auto overflow-hidden'>
                <div
                className="img-preview"
                style={{ width: "100%", float: "left", height: "300px" }}
              />

              </div>
              :
              <img className='w-[90px] h-[90px] rounded-full mx-auto mb-5' src="images/profile.png" alt="" />
            }

              {image&&
              <Cropper
                ref={cropperRef}
                style={{ height: 300, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
              />
              
              }
              <div className='flex items-center '>
                {loader?
                <Rings
                  height="60"
                  width="60"
                  color="#4fa94d"
                  radius="6"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="rings-loading"
                />
                :

                <button onClick={getCropData} className='font-pop py-2 px-2 bg-green-500 rounded-bl-lg text-sm text-white  mt-5 inline-block'>Upload</button>
              }
                <button onClick={() => setProfileModal(false)} className='font-pop py-2 px-2 bg-red-500 rounded-bl-lg text-sm text-white ml-5  mt-5 inline-block'>Cancel</button>
              </div>
            </div>
          </div>
        }
        {
          setting &&
          <div className='w-full h-full bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex items-center justify-center'>
            <div className='w-[90%]  p-5  bg-white rounded-2xl shadow-lg'>
              <h1 className='font-pop text-xl lg:text-2xl font-bold text-pop'>LogOut Your Accout </h1>

              <div className='flex items-center '>
               
                <button onClick={handleLogout} className='font-pop py-2 px-2 bg-green-500 rounded-bl-lg text-sm text-white  mt-5 inline-block'>LogOut</button>
                <button onClick={() => setSetting(false)} className='font-pop py-2 px-2 bg-red-500 rounded-bl-lg text-sm text-white ml-5  mt-5 inline-block'>Cancel</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default UserList