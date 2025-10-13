import Image from "next/image";

const CosplayJourney = () => {
  return (
    <section className="w-full sm:w-[1440px] mx-auto flex flex-col-reverse sm:flex-row gap-8 sm:gap-16 py-20">
      <div className="flex flex-col justify-center w-full sm:w-[40%] px-4 sm:px-4">
        <h2 className="font-paytone color-cosbaii-primary text-[32px] sm:text-[64px]/16">
          Not Just a Profile. It&apos;s Your Cosplay Journey.
        </h2>
        <p className="mt-8">
          This isn&apos;t just another profile. It&apos;s your cosplay timeline, your highlights, and your story. Every photo, credential, and convention memory lives here, ready to be shared with the world. Whether you&apos;re just starting out or already a con regular, Cosbaii gives your journey the spotlight it deserves.
        </p>
      </div>
      <div className="w-full sm:w-[60%]">
        <Image
          src="/images/cosplay-journey.webp"
          alt="Hero Image"
          quality={100}
          width={996}
          height={722}
          className="w-full h-auto mx-auto my-2 sm:my-4"
        />
      </div>
    </section>
  );
};

export default CosplayJourney;
