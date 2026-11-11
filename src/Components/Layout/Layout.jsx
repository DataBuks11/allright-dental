import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import VoiceAgentWidget from '../VoiceAgentWidget/VoiceAgentWidget'

function Layout() {
  const location = useLocation();
  const isVoicePage = location.pathname === '/voice-receptionist' || location.pathname === '/talk-to-sarah';

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {!isVoicePage && <VoiceAgentWidget />}
    </>
  )
}

export default Layout
