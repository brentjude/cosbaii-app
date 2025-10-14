import React from 'react'

const Roadmap = () => {
  return (
    <section className="w-full bg-[#F6F6F6] py-16 sm:py-24 px-8">
        <div className="max-w-[1440px] mx-auto text-center">
            <h2 className="font-paytone color-cosbaii-primary text-[32px] sm:text-[64px]">Cosbaii in the future</h2>
            <p className="w-full sm:w-[826px] mx-auto text-[20px] mt-4">Cosbaii isn&apos;t just a platform. It&apos;s a growing space built with and for the cosplay community. From exciting features to meaningful opportunities, here&apos;s a peek at what&apos;s coming next, designed to make your cosplay journey more connected, creative, and fun.</p>
            <div className="flex flex-col gap-8 mt-12">
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="grow bg-[#FFF2E8] text-left rounded-2xl px-8 py-6">
                        <h3 className="text-[24px] sm:text-[32px] font-black">For Cosplayers, Organizers, Photographers & Fans 2</h3>
                        <p className="mt-4 text-[18px]">
                            Cosbaii is a growing space made for the whole cosplay community. Whether you&apos;re in costume, building props, behind the camera, or just showing support, there&apos;s a place for you here. We&apos;re working on features that make it easier to collaborate, connect, and celebrate the craft you love.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row grow gap-8">
                        <div className="w-full sm:w-[55%] bg-[#FFF2E8] text-left rounded-2xl px-8 py-6">
                            <h3 className="text-[24px] sm:text-[32px] font-black">Online Made-to-Order for Crafters</h3>
                            <p className="mt-4 text-[18px]">
                                Have a talent for crafting? Cosbaii will help you offer commissions and custom builds directly from your profile. Get discovered and turn your creativity into real collaborations.
                            </p>
                        </div>
                        <div className="w-full sm:w-[45%] bg-[#FFF2E8] text-left rounded-2xl px-8 py-6">
                            <h3 className="text-[24px] sm:text-[32px] font-black">Free Guides & Workshops</h3>
                            <p className="mt-4 text-[18px]">
                                From beginner armor tips to posing with confidence, Cosbaii will offer free guides and community-led workshops to help you level up and grow your skills.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="w-full sm:w-[50%] bg-[#FFF2E8] text-left rounded-2xl px-8 py-6">
                        <h3 className="text-[24px] sm:text-[32px] font-black">Cosbaii as a Social Platform</h3>
                        <p className="mt-4 text-[18px]">
                            Cosbaii lets you share your cosplay journey and discover others like you. Follow, connect, and cheer on fellow creatives in a space made just for the community. It&apos;s designed to feel friendly, empowering, and full of possibilities.
                        </p>
                    </div>
                    <div className="w-full sm:w-[50%] bg-[#FFF2E8] text-left rounded-2xl px-8 py-6">
                        <h3 className="text-[24px] sm:text-[32px] font-black">Service Booking for Cosplayers & Photographers</h3>
                        <p className="mt-4 text-[18px]">
                            Booking shoots shouldn&apos;t be complicated. You&apos;ll be able to find, connect, and book sessions with cosplayers or photographers right inside Cosbaii. No more awkward DMs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Roadmap;
