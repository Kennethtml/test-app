import React from "react";
import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
  const[user,loading]=useAuthState(auth)
  return (
    <div className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">creatve minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"./auth/Login"}>
            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8 ">
              {" "}
              join now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href={"/post"}>
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg texts-sm">post</button>
            </Link>
            <Link href={"/Dashboard"}>
              <img src={user.photoURL} alt="img" />
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Nav;
