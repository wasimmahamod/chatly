import React, { useState, createRef,useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getStorage, ref, uploadString ,getDownloadURL,uploadBytes} from "firebase/storage";
import { getAuth, updateProfile,signOut  } from "firebase/auth";
import { getDatabase, ref as dref, set,update,onValue ,push} from "firebase/database";
import moment from 'moment/moment';
import {FaAngleLeft} from 'react-icons/fa'
import {GrGallery,GrClose} from 'react-icons/gr'
import { Link } from 'react-router-dom';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Rings } from 'react-loader-spinner'
import ModalImage from "react-modal-image";
import EmojiPicker from 'emoji-picker-react';
import {BsEmojiSmile} from 'react-icons/bs'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import { AudioRecorder } from 'react-audio-voice-recorder';



const Chat = () => {
    const auth = getAuth();
    const storage = getStorage();
    const db = getDatabase();
    let data = useSelector((state) => state.userLoginInfo.userInfo)
    let chatData = useSelector((state) => state.activeChatInfo.chatInfo)
    console.log(chatData)
    let [msg, setMsg] = useState('')
    let [msgList, setMsgList] = useState([])
    let [imgMsg,setImgMsg]=useState(false)
    let [loader,setLodar]=useState(false)
    let [emojishow,setEmojiShow]=useState(false)
    let [cameraOpen,setCameraOpen]=useState(false)
    let [audioShow,setaudioShow]=useState(false)
    let [audioData,setAudioData]=useState(null)
    let [blob,setBlob]=useState(null)
    let emojiRef=useRef()

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
          const storageRef = ref(storage,auth.currentUser.uid+1 );
          const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                set(push(dref(db, 'msg/')), {
                    whosendmsg: data.displayName,
                    whosendid: data.uid,
                    whosendimg: data.photoURL,
                    whorecivemsg: chatData.name,
                    whoreciveid: chatData.id,
                    whoreciveimg: chatData.img,
                    img: downloadURL,
                    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
                }).then(() => {
                    setImgMsg('')
                })
            });
          });
    
        }
      };
    

    let handleMsg = (e) => {
        setMsg(e.target.value)
    }

    let handleMsgSend = () => {
        set(push(dref(db, 'msg/')), {
            whosendmsg: data.displayName,
            whosendid: data.uid,
            whosendimg: data.photoURL,
            whorecivemsg: chatData.name,
            whoreciveid: chatData.id,
            whoreciveimg: chatData.img,
            msg: msg,
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
        }).then(() => {
            setMsg('')
        })
    }

    useEffect(() => {
        const starCountRef = dref(db, 'msg/');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid && chatData.id == item.val().whoreciveid || data.uid == item.val().whoreciveid && chatData.id == item.val().whosendid) {
                    arr.push({ ...item.val(), id: item.key })
                }
            })
            setMsgList(arr)
        });
    }, [chatData.id])

    let handleEmoji=(e)=>{
        setMsg(msg+ e.emoji)
    }

    useEffect(() => {
        const bodyclick=(e)=>{
            if (emojiRef.current.contains(e.target)) {
                setEmojiShow(true)
              } else {
                
                setEmojiShow(false)
              }
        };

        document.addEventListener('click', bodyclick)

        return()=>{
            document.removeEventListener('click', bodyclick)
        }
      }, [])


        function handleTakePhoto (dataUri) {
          // Do stuff with the photo...
          console.log('takePhoto');
        }

        let hanldeclick=()=>{
            console.log('ami')
        }

        let handlekey=(e)=>{
           if(e.key=='Enter'){
            set(push(dref(db, 'msg/')), {
                whosendmsg: data.displayName,
                whosendid: data.uid,
                whosendimg: data.photoURL,
                whorecivemsg: chatData.name,
                whoreciveid: chatData.id,
                whoreciveimg: chatData.img,
                msg: msg,
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
            }).then(() => {
                setMsg('')
            })
           }
        }
        const addAudioElement = (blob) => {
            const url = URL.createObjectURL(blob);
            setAudioData(url)
            setBlob(blob)
            
          };
          let handleAudioUpload = () => {
            const storageRef = ref(storage, audioData);
            uploadBytes(storageRef, blob).then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    set(push(dref(db, 'msg/')), {
                        whosendmsg: data.displayName,
                        whosendid: data.uid,
                        whosendimg: data.photoURL,
                        whorecivemsg: chatData.name,
                        whoreciveid: chatData.id,
                        whoreciveimg: chatData.img,
                        audio: downloadURL,
                        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
                    }).then(() => {
                        setaudioShow(false)
                    })
                  });
            });
          };
    return (
        <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div class="relative w-full flex items-center space-x-4">
                    <Link to='/home'>
                <FaAngleLeft className='text-2xl'/>
                    </Link>
                    <div class="relative">
                        <img src={chatData.img} alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
                    </div>
                    <div class="flex flex-col leading-tight">
                        <div class="text-xl mt-1 flex items-center">
                            <span class="text-gray-700 mr-3 font-pop font-medium ">{chatData.name}</span>
                        </div>
                    </div>
                   
                </div>
                <div class="flex items-center space-x-2">
                    <button type="button" class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>

                </div>
            </div>
            <div id="messages" class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <ScrollToBottom className='h-[500px] '>
                {msgList.map((item) => (
                    data.uid == item.whosendid ?
                    item.msg?
                        <div class="chat-message">
                            <div class="flex items-end justify-end">
                                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                    <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{item.msg}</span></div>
                                </div>
                                {data.uid == item.whosendid && chatData.id == item.whoreciveid ?
                                    <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                                    :
                                    <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                                }

                            </div>
                                 <p className='font-nunito font-normal text-xs mt-2 text-[#D7D7D7] text-right'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                        </div>
                        :item.img?
                        <div class="chat-message">
                        <div class="flex items-end justify-end">
                            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                <div className='  border-solid border-2 border-[#2563EB] rounded-br-xl overflow-hidden'>
                                <ModalImage className='w-[200px] h-[150px]'
                                        small={item.img}
                                        large={item.img}
                                      />
                                </div>
                            </div>
                            {data.uid == item.whosendid && chatData.id == item.whoreciveid ?
                                <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                                :
                                <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                            }

                        </div>
                             <p className='font-nunito font-normal text-xs mt-2 text-[#D7D7D7] text-right'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                        </div>
                        :
                        <div class="chat-message">
                        <div class="flex items-end justify-end">
                            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                <div className='  border-solid border-2 border-[#2563EB] rounded-br-xl overflow-hidden'>
                                <audio controls>
                                <source src={item.audio} type="audio/ogg"/>
                        
                                </audio>
                                </div>
                            </div>
                            {data.uid == item.whosendid && chatData.id == item.whoreciveid ?
                                <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                                :
                                <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-2" />
                            }

                        </div>
                             <p className='font-nunito font-normal text-xs mt-2 text-[#D7D7D7] text-right'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                        </div>
                        :
                        item.msg?
                        <div class="chat-message">
                            <div class="flex items-end">
                                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                
                                    <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{item.msg}</span></div>
                                </div>
                                
                                {data.uid == item.whoreciveid && chatData.id == item.whosendid ?
                                    <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                                    :
                                    <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                                }
                                  
                            </div>
                                 <p className=' font-nunito font-normal text-xs mt-2 text-[#D7D7D7] mr-3'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                           
                        </div>
                        :item.img?
                        <div class="chat-message">
                        <div class="flex items-end">
                            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                            
                                <div className='border-solid border-2 border-[#D1D5DB] rounded-br-xl overflow-hidden'>
                                <ModalImage className='w-[200px] h-[150px]'
                                        small={item.img}
                                        large={item.img}
                                      />
                                </div>
                            </div>
                            
                            {data.uid == item.whoreciveid && chatData.id == item.whosendid ?
                                <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                                :
                                <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                            }
                              
                        </div>
                             <p className=' font-nunito font-normal text-xs mt-2 text-[#D7D7D7] mr-3'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                       
                    </div>
                    :
                        <div class="chat-message">
                        <div class="flex items-end">
                            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                            
                                <div className='border-solid border-2 border-[#D1D5DB] rounded-br-xl overflow-hidden'>
                                <audio controls>
                                <source src={item.audio} type="audio/ogg"/>
                        
                                </audio>
                                </div>
                            </div>
                            
                            {data.uid == item.whoreciveid && chatData.id == item.whosendid ?
                                <img src={item.whosendimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                                :
                                <img src={item.whoreciveimg} alt="My profile" class="w-6 h-6 rounded-full order-1" />
                            }
                              
                        </div>
                             <p className=' font-nunito font-normal text-xs mt-2 text-[#D7D7D7] mr-3'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
                       
                    </div>
                    

                ))}

                </ScrollToBottom>
            </div>
            <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                <div class="relative flex">
                    <span class="absolute inset-y-0 flex items-center">
                        <button onClick={()=>setaudioShow(true)} type="button" class="md:inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none hidden ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </button>
                    </span>
                   
                    <input onChange={handleMsg} onKeyPress={handlekey} value={msg} type="text" placeholder="Write your message!" class=" w-[60%] lg:w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 md:pl-12  bg-gray-200 rounded-md py-3" />
                    <div class="absolute right-0 items-center inset-y-0 flex gap-x-1 md:gap-x-0">

                        <button onClick={()=>setCameraOpen(true)} type="button" class="inline-flex items-center justify-center rounded-full w-6 h-6 lg:h-10 lg:w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                        <button onClick={()=>setImgMsg(true)} type="button" class="inline-flex items-center justify-center rounded-full w-6 h-6 lg:h-10 lg:w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                            <GrGallery className='text-xl text-gray-300'/>
                        </button>
                       <div ref={emojiRef}>
                        <button   type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                            <BsEmojiSmile className='text-xl'/>
                        </button>
                        {emojishow&&
                    <div className='absolute bottom-12 right-0 z-50'>
                    <EmojiPicker onEmojiClick={handleEmoji} />
                  </div>
                    }
                    </div>
                        <button onClick={handleMsgSend} type="button" class="inline-flex items-center justify-center rounded-lg px-2 lg:px-4  py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none ">
                            <span class="font-bold hidden lg:block">Send</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 lg:h-6 lg:w-6 ml-2 transform rotate-90">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {
          imgMsg &&
          <div className='w-full h-full bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex items-center justify-center'>
            <div className='lg:w-1/4 p-5  bg-white rounded-2xl shadow-lg'>
              <h1 className='font-pop text-xl lg:text-2xl font-bold text-pop'>Send Photo </h1>
              <input onChange={onChange} className='font-pop text-md text-pop block mt-5 mb-5 w-full' type='file' />
              {image?
              <div className='w-[90px] h-[90px] rounded-lg mx-auto overflow-hidden'>
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
                <button onClick={() => setImgMsg(false)} className='font-pop py-2 px-2 bg-red-500 rounded-bl-lg text-sm text-white ml-5  mt-5 inline-block'>Cancel</button>
              </div>
            </div>
          </div>
        }
        {cameraOpen&&
        <div className='bg-[rgba(0,0,0,.8)] absolute top-0 left-0 w-full h-screen'>
            <div onClick={()=>setCameraOpen(false)} className='absolute top-2/4  right-2 bg-red-500 z-50 w-[50px] h-[50px] rounded-full flex justify-center items-center'>
                <GrClose  className='tex-xl text-white'/>
            </div>
            <Camera
        onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
      />

        </div>
        
        }
        {audioShow&&
        <div className='absolute hidden md:block bottom-28 left-12 bg-gray-300 p-2 rounded-md '>
            <div className='flex items-center gap-x-5'>
            <AudioRecorder onRecordingComplete={addAudioElement} />
            <button onClick={handleAudioUpload} className='bg-[#2563EB] p-2 rounded-md text-white font-pop '>Send</button>
            <GrClose onClick={()=>setaudioShow(false)}/>

            </div>
        </div>
        }
        </div>
    )
}

export default Chat