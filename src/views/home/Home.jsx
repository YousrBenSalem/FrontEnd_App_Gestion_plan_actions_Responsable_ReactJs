import React from 'react'
import SideBar from '../../components/SideBar'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
  <div>
  {/* Layout wrapper */}
  <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Menu */}
      <SideBar/>
      {/* / Menu */}
      {/* Layout container */}
      <div className="layout-page">
        {/* Navbar */}
      <NavBar/>
        {/* / Navbar */}
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
        <Outlet/>
          {/* / Content */}
          {/* Footer */}
          <Footer/>
          {/* / Footer */}
          <div className="content-backdrop fade" />
        </div>
        {/* Content wrapper */}
      </div>
      {/* / Layout page */}
    </div>
    {/* Overlay */}
    <div className="layout-overlay layout-menu-toggle" />
  </div>

</div>

  )
}

export default Home