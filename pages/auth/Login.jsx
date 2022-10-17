import React from 'react'
import{ FcGoogle} from 'react-icons/fc'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import {auth} from '../../utils/firebase'
import { async } from '@firebase/util'
import{useRouter} from 'next/router'
import{useAuthState} from 'react-firebase-hooks/auth'
import {useEffect} from 'react'

function Login() {
  const route=useRouter()
  const[user,loading]=useAuthState(auth)

  const googleProvider= new GoogleAuthProvider()
  const googleSignIn=async()=>{
    try{
      const response= await signInWithPopup(auth,googleProvider)
      route.push('/')
      console.log(response)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(user){
      route.push('/');
    }
    else{
      console.log('login')
    }
  },[user])
  return (
    <div className='shadow-xl mt-32 p-10 text-gray-7 rounded-lg'>
      <h2 className='text-2xl font-medium'>Join Today</h2>
      <div className='py-4'>
        <h3 className='py-4'>Sign in with one of the providers</h3>
        <button onClick={googleSignIn} className='text-white bg-gray-700 font-medium rounded-lg flex align-middle p-4 gap-2'>
          <FcGoogle/>
          Sign in with Google</button>
      </div>

    </div>
  )
}

export default Login