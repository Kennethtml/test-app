import React from 'react'
import Nav from './Nav'

function Layout({children}) {
  return (
    <div className='mx-6 md:max-w-2xl md:mx-auto font-poppins'>
      <Nav />
      <main>{children}</main>
    </div>
  );
}

export default Layout