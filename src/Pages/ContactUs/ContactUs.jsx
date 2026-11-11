import React from 'react'
import CommonBanner from '../../Components/CommonBanner/CommonBanner'
import ContactForm from '../../Components/ContactForm/ContactForm'
import FAQSection from '../../Components/FAQSection/FAQSection'

function ContactUs() {
    return (
        <>
            <main className="pt-[80px]">
                <CommonBanner
                    title="Your Smile, Our Priority"
                    subtitle="Dedicated to Exceptional Dental Care"
                    backgroundImage="/contactBanner.jpg"
                    className="bg-right"
                />
            </main>
            <ContactForm />
            <FAQSection />
        </>
    )
}

export default ContactUs