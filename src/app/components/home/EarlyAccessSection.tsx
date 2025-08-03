
import SignUpForm from "../form/SignUpForm"

export default function EarlyAccessSection() {
  return (
   
    <section className="max-w-[1440px] py-20 mx-auto flex items-center justify-center">
        <div className="w-full flex bg-pale px-6 pb-10 rounded-xl">
            <div className="w-[50%] flex justify-center">
                <div className="card mt-[-20px] w-[450px] bg-primary p-10 rounded-xl">
                    <h2 className="font-paytone text-[36px] text-white">Be the first Cosbaii members</h2>
                   <SignUpForm />
                </div>
            </div>
            <div className="w-[50%] flex flex-col gap-4 justify-center p-10">
                <h2 className="text-[36px] text-primary weight-bold font-bold">Get Early Access and unlock exclusive perks when you are a founding members of Cosbaii</h2>
                <p className="text-lg">Sign up now and be part of our early supporters who shape the future of Cosbaii.</p>
                <ul className="list-none ">
                    <li className="my-4"> ✅ <strong>Exclusive Beta Access</strong> – try Cosbaii before anyone else</li>
                    <li className="my-4"> ✅ <strong>Reserve Your Unique Cosbaii ID</strong>  – lock in your name early</li>
                    <li className="my-4"> ✅ <strong>Early Supporter Badge</strong> – wear your badge with pride on your profile</li>
                </ul>
            </div>
        </div>
    </section>
    
    
  )
}
