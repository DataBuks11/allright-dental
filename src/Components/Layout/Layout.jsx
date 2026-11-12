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
      <div className="no-print print:hidden">
        <Navbar />
      </div>
      <main>
        <Outlet />
      </main>
      <div className="no-print print:hidden">
        <Footer />
      </div>
      {!isVoicePage && (
        <div className="no-print print:hidden">
          <VoiceAgentWidget />
        </div>
      )}
    </>
  )
}

export default Layout;
