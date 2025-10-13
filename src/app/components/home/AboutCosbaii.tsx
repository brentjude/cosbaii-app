import Image from "next/image";

const AboutCosbaii = () => {
  return (
    <section className="w-full bg-primary">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row py-10 sm:py-20 gap-6 sm:gap-24">
        <div className="flex flex-col sm:flex-row w-full sm:w-[50%] gap-8 sm:gap-8 px-4 sm:px-0">
          <div className="flex flex-col w-[100%] sm:w-[50%] gap-8 sm:mt-[-120px]">
            <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
              <h3 className="font-bold text-cosbaii-grey px-4 sm:px-8 pt-4 sm:pt-8">
                Verified Cosplay Identity
              </h3>
              <Image
                src="/images/verify-identity.webp"
                alt="Hero Image"
                quality={100}
                width={196}
                height={172}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-4 sm:px-8 pb-4 sm:pb-8">
                Each cosplayer goes through a thorough verification process to
                ensure authenticity of the account. This builds trust across
                events, competitions, and the wider cosplay community.
              </p>
            </div>
            <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Showcase Your Portfolio
              </h3>
              <Image
                src="/images/showcase-portfolio.webp"
                alt="Hero Image"
                quality={100}
                width={298}
                height={189}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Easily create and update a personal cosplay profile that
                highlights your best works. Share your photos, builds, and
                collaborations in one beautifully organized space. go.
              </p>
            </div>
          </div>
          <div className="flex flex-col w-[100%] sm:w-[50%] gap-8 mb-0 sm:mb-[-120px]">
            <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Digital Profiles
              </h3>
              <Image
                src="/images/digital-profiles.webp"
                alt="Hero Image"
                quality={100}
                width={352}
                height={241}
                className="mx-auto"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Cosbaii gives every cosplayer a unique digital ID and profile.
                It&apos;s your official identity that stays with you wherever
                you go.
              </p>
            </div>
            <div className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg">
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Organized Credentials
              </h3>
              <Image
                src="/images/organized-credentials.webp"
                alt="Hero Image"
                quality={100}
                width={298}
                height={189}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Keep track of your event participation, awards, and recognitions
                in a clean, verified format. Your cosplay journey is now
                structured, searchable, and easy to present.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 sm:gap-10 w-full sm:w-[50%] p-8 sm:px-16">
          <h2 className="font-paytone text-[32px] sm:text-[64px] text-white">
            What is Cosbaii
          </h2>
          <p className="text-white">
            <strong>Cosbaii is a platform built for cosplayers</strong> —
            whether you compete on stage or just love bringing characters to
            life. It gives you a digital identity that works across conventions
            and events, so you don&apos;t have to keep rebuilding your
            reputation from scratch. With a unique Cosbaii ID and a clean
            profile, you can showcase your best cosplays, highlight competition
            achievements, and easily get recognized by organizers, fans, and
            fellow cosplayers. Whether you&apos;re attending your first con or
            already making waves in competitions, Cosbaii helps you share your
            craft in one place.
          </p>
          <p className="text-white mt-4">
            Right now, we&apos;re focused on supporting cosplayers and making
            their convention experience smoother, more organized, and more
            rewarding. But this is just the beginning. Soon, we&apos;ll open up
            the platform to include photographers and crafters too — creating a
            space where the whole cosplay community can connect, collaborate,
            and grow together. Cosbaii isn&apos;t just another portfolio site —
            it&apos;s a home base for your cosplay journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutCosbaii;
