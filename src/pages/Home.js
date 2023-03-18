import React, { useState ,useEffect} from 'react'
import Chat from '../components/Chat'
import UserList from '../components/UserList'
import { useSelector } from 'react-redux'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Home = () => {
    const auth = getAuth();
    let navigate=useNavigate()
    let dispatch=useDispatch()
    let [verify, setVerify] = useState(true)
    let data = useSelector((state) => state.userLoginInfo.userInfo)

    onAuthStateChanged(auth, (user) => {
        if (user.emailVerified == true) {
            setVerify(true)
        }
        dispatch(userLoginInfo(user))
    });

    useEffect(()=>{
        if(!data){
            navigate('/login')
        }
    })


    return (
        <div >
            {
                verify ?

                    <div className='w-full border border-l border-solid'>
                        <UserList />
                    </div>
                    :
                    <div className='bg-[#6C28C8] w-full h-screen flex justify-center items-center'>

                        <div className='text-center'>
                            <h2 className='font-pop text-2xl font-bold text-green-500 '>{data.displayName}</h2>
                            <h2 className='font-pop text-2xl font-bold text-white mt-3'>Please Verify Your Email </h2>
                            <h4 className='font-pop text-xs text-red-500 mt-3'> note : Alreday Send Verify mail Your Email </h4>
                        </div>
                    </div>
            }
        </div>

    )
}

export default Home