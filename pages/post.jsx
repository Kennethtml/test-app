import{auth,db} from '../utils/firebase'
import Router, { useRouter } from 'next/router'
import{useEffect,useState} from 'react';

import React from 'react'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth'
import {toast} from 'react-toastify'


function Post() {
    const[post,setPost]=useState({description:''})
    const[user,loading]=useAuthState(auth)
    const route=useRouter()

    const routeData=route.query
    const submitForm= async(e)=>{
        e.preventDefault()

    if(!post.description){
        toast('description field empty',{position:toast.POSITION.TOP_CENTER,
        autoClose:1000,})
        return;
    }
     if (!post.description.length>300) {
       toast("post description too long", {
         position: toast.POSITION.TOP_CENTER,
         autoClose: 1000,
       });
       return;
     }
    if( post.hasOwnProperty("id")){
      const docRef=doc(db,'posts',post.id)
      await updateDoc(docRef,{...post,timestamp:serverTimestamp()})
       return Router.push("./");
    }
    else{
       const collectionRef = collection(db, "posts");
       await addDoc(collectionRef, {
         ...post,
         timestamp: serverTimestamp(),
         user: user.uid,
         avatar: user.photoURL,
         username: user.displayName,
       });
       setPost({ description: "" });
       toast.success('post has been made',{
        position: toast.POSITION.TOP_CENTER
       })
       return Router.push("./");




    }
       
    }
    //checkour user
    const checkUser=async()=>{
      if(loading) return;
      if(!user) route.push('auth/login');
      if(routeData.id){
        setPost({description:routeData.description,id:routeData.id})
      }
    }
    useEffect(
      ()=>{
        checkUser()
      },[loading,user]
    )
  return (
    <div className="my-200 p-12 shadow-lg rounded-lg max-w-m max-auto ">
      <form action="">
        <h1 className=" text-2xl font-bold">{post.hasOwnProperty('id')?"modify post":'Create a new Post'}</h1>
        <div className="py-2">
          <h3 text-lg font-medium py-2>
            Description
          </h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-small"
          ></textarea>
          <p 
          className={`text-cyan-600 font-medium text-sm ${post.description.length>300 ?'text-red-600':''}`}
          >{post.description.length}/300</p>
        </div>
        <button
        onClick={submitForm}
        className="w-full bg-cyan-600 text-whiite font-medium p-2 my-2 text-small">
          submit
        </button>
      </form>
    </div>
  );
}

export default Post