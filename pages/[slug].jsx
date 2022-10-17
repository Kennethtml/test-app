import React from 'react'
import { useRouter } from 'next/router';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import { auth, db } from '../utils/firebase';
import { arrayUnion, doc, getDoc, updateDoc,Timestamp, onSnapshot } from 'firebase/firestore';


const Details = () => {
  const router=useRouter()
  const routeData=router.query
  const[allMessages,setAllMessages]=useState([])
  const [message, setMessage] = useState('');

const submitMessage=async()=>{
  if(!auth.currentUser) return router.push('auth/login')
  if (!message){
    console.log(message)
    toast.error('Dont leave an empty message')
    return;
  } 

  const docRef=doc(db,"posts",routeData.id)
  await updateDoc(
    docRef, {
      comments:arrayUnion(
        {
          message,
          avatar:auth.currentUser.photoURL,
          userName:auth.currentUser.displayName,
          time:Timestamp.now()
        }
      )
    }
  )
  setMessage('')
}

const getComments=async()=>{
  const docRef=doc(db,'posts',routeData.id)
  const unsubscribe= onSnapshot(docRef,(snapshot)=>setAllMessages(snapshot.data().comments))
return unsubscribe
}

useEffect(()=>{
  if(!router.isReady)return;
  getComments()

},[router.isReady])
console.log(allMessages)


  return (
    <div>
      <Message {...routeData}>
        <div className='my-4'>
          <div className='flex'>

          <input  className='bg-gray-800 w-full p-2 text-white text-sm 'type="text" value={message} onChange={(e)=>setMessage(e.target.value)} />
          <button className='bg-cyan-500 text-white py-2 px-4' onClick={submitMessage}> submit</button>
          </div>
          <div className='py-6'>
            <h2 className='font-bold'>Comments</h2>
            {allMessages?.map((message)=>{
              return (
                <div className='bg-white p-4 my-4 border-2' >
                  <div className='flex items-center gap-2 mb-4'>
                    <img  
                    className='w-10 rounded-full' src={message.avatar} />
                    <h2>{message.userName}</h2>
                  </div>
                  <h2>{message.message}</h2>
                </div>
              );
            })}

          </div>
        </div>

      </Message>
    </div>
    
  )
}

export default Details