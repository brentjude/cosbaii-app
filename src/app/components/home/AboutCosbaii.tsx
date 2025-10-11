
import Image from "next/image"

const AboutCosbaii = () => {
  return (
    <section className="w-full bg-primary">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row py-10 sm:py-20 gap-6 sm:gap-24">
            <div className="flex flex-row w-full sm:w-[50%] gap-4 sm:gap-8 ">
                <div className="flex flex-col w-[50%] gap-8 sm:mt-[-120px]">
                    <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
                        <h3 className="font-bold text-cosbaii-grey px-8 pt-8">Verified Cosplay Identity</h3>
                        <Image  src="/images/verify-identity.webp"
                                            alt="Hero Image"
                                            quality={100}
                                            width={196}
                                            height={172}
                                            className="mx-auto my-4"
                                            />
                        <p className="text-cosbaii-grey px-8 pb-8">
                            Each cosplayer goes through a thorough verification process to ensure authenticity of the account. This builds trust across events, competitions, and the wider cosplay community.
                        </p>
                    </div>
                    <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
                        <h3 className="font-bold text-cosbaii-grey px-8 pt-8">Digital Profiles</h3>
                        <Image  src="/images/verify-identity.webp"
                                            alt="Hero Image"
                                            quality={100}
                                            width={196}
                                            height={172}
                                            className="mx-auto my-4"
                                            />
                        <p className="text-cosbaii-grey px-8 pb-8">
                            Cosbaii gives every cosplayer a unique digital ID and profile. It&qou;s your official identity that stays with you wherever you go.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col w-[50%] gap-8 mb-[-120px]">
                    <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
                        <h3 className="font-bold text-cosbaii-grey px-8 pt-8">Digital Profiles</h3>
                        <Image  src="/images/verify-identity.webp"
                                            alt="Hero Image"
                                            quality={100}
                                            width={196}
                                            height={172}
                                            className="mx-auto my-4"
                                            />
                        <p className="text-cosbaii-grey px-8 pb-8">
                            Cosbaii gives every cosplayer a unique digital ID and profile. It&qou;s your official identity that stays with you wherever you go.
                        </p>
                    </div>
                    <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
                        <h3 className="font-bold text-cosbaii-grey px-8 pt-8">Verified Cosplay Identity</h3>
                        <Image  src="/images/verify-identity.webp"
                                            alt="Hero Image"
                                            quality={100}
                                            width={196}
                                            height={172}
                                            className="mx-auto my-4"
                                            />
                        <p className="text-cosbaii-grey px-8 pb-8">
                            Each cosplayer goes through a thorough verification process to ensure authenticity of the account. This builds trust across events, competitions, and the wider cosplay community.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-10 w-[50%] px-16">
                <h2 className="font-paytone text-xl sm:text-[64px] text-white">What is Cosbaii</h2>
                <p className="text-white">
                    <strong>Cosbaii is a platform built for cosplayers</strong> — whether you compete on stage or just love bringing characters to life. It gives you a digital identity that works across conventions and events, so you don’t have to keep rebuilding your reputation from scratch. With a unique Cosbaii ID and a clean profile, you can showcase your best cosplays, highlight competition achievements, and easily get recognized by organizers, fans, and fellow cosplayers. Whether you're attending your first con or already making waves in competitions, Cosbaii helps you share your craft in one place.
                    </p>
                    <p className="text-white mt-4">
                    Right now, we’re focused on supporting cosplayers and making their convention experience smoother, more organized, and more rewarding. But this is just the beginning. Soon, we’ll open up the platform to include photographers and crafters too — creating a space where the whole cosplay community can connect, collaborate, and grow together. Cosbaii isn’t just another portfolio site — it’s a home base for your cosplay journey.
                </p>
            </div>
        </div>
    </section>
  )
}

export default AboutCosbaii