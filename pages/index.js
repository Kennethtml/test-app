import { collection, onSnapshot, orderBy ,query} from 'firebase/firestore'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { db } from '../utils/firebase'
import Message from '../components/Message'
import Link from 'next/link'


export default function Home() {
  const[allPosts, setAllPosts]=useState([])
  const getPost=async()=>{
    const collectionRef=collection(db,'posts')
    const q=query(collectionRef,orderBy('timestamp', 'desc'))
    const unsubscribe=onSnapshot(q,(snapshot)=>{
      setAllPosts(snapshot.docs.map((doc)=>({...doc.data(),id:doc.id})))
    })
    return unsubscribe
  }
  useEffect(()=>{
    getPost()
  },[])

  console.log(allPosts)
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='my-12 text-lg font-medium'>
          <h2>See what other people are saying</h2>
          {allPosts.map(post=>{
           return (
             <Message {...post} key={post.id}>
               <Link href={{ pathname: `/${post.id}`,query:{...post} }}>
                <button>{post.comments?.length>0?post?.comments?.length:0}comments</button>
               </Link>
             </Message>
           );
          })}

        </div>

      </main>

     
    </div>
  )
}
