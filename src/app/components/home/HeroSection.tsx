import Image  from "next/image";

export default function HeroSection() {
 return (
    <section className="w-full mx-auto flex flex-col-reverse sm:flex-row items-center justify-between py-10 sm:py-20  gap-5 sm:gap-10">
        <div className="w-full lg:w-[50%] sm:w-[40%] sm:pl-[10%] flex flex-col p-4">
            <h5 className="text-xl color-cosbaii-primary font-semibold">FOR COSPLAYERS IDENTITY</h5>
            <h1 className="font-paytone text-[48px] lg:text-[80px] sm:text-[48px] leading-tight text-cosbaii-gray ">Your cosplay
career spotlight</h1>
            <p className="text-lg pt-6">Build your cosplay profile and showcase your work with verified credentials.</p>
        </div>
        <div className="w-full sm:w-[50%]">
            <Image  src="/images/hero-image.webp"
                    alt="Hero Image"
                    width={984}
                    height={549}
                    className="w-auto h-full"
                    />
        </div>
    </section>
 )
}