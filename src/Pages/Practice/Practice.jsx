import React from 'react'
import AboutPractice from '../../Components/AboutPractice/AboutPractice'
import CommonBanner from '../../Components/CommonBanner/CommonBanner'

function Practice() {
  return (
    <>
        <main className='pt-[80px]'>
        <CommonBanner backgroundImage="/practiceBanner.png" className="bg-top" title="About Practice" />
        <AboutPractice />   
        </main>
    </>
  )
}

export default Practice