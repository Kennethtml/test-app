import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import react from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Message from "../components/Message";
import {BsTrash2Fill} from 'react-icons/bs'
import { AiFillEdit } from "react-icons/ai";

import { db } from "../utils/firebase";
import Link from "next/link";

function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, getPosts] = useState([]);

  
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/Login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q,(
      snapshot=>{
        getPosts(
          snapshot.docs.map((doc)=>({...doc.data(),id:doc.id}))
          
        )
       
      }
    ))
    
    return unsubscribe
  };
  //delete post
  const deletePost=async(id)=>{
    const docRef= doc(db,'posts',id)
    await deleteDoc(docRef)
  }

  useEffect(() => {
    getData();
  }, [loading, user]);
  console.log(posts);

  return (
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message key={post.id} {...post}>
              <div className="flex gap-4">
                <button onClick={()=>console.log(deletePost(post.id))} className=" text-pink-600 flex items-center justify-center gap-2 py-2">
                  <BsTrash2Fill className="text-2xl" />
                  Delete
                </button>
                <Link href={{pathname:'/post',query:post}}>
                <button className="text-teal-600 flex itens-center justify-center gap-2 py-2">
                  <AiFillEdit className="text-2xl" />
                  Edit
                </button>
                </Link>
                
              </div>
            </Message>
          );
        })}
      </div>
      <button className="font-medium text-white bg-gray-800 py-2 px-4 my-6" onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}

export default Dashboard;
