export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Cosbaii. All rights reserved.
                </p>
                <div className="flex gap-6 mt-4 sm:mt-0">
                    <a href="/terms" className="text-sm text-gray-400 hover:text-white transition">
                    Terms & Conditions
                    </a>
                    <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition">
                    Privacy Policy
                    </a>
                </div>
                </div>
        </div>
        </footer>
    )
}