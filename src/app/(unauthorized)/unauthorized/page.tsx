import React from 'react'
import Link from 'next/link';

const layout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-error">
            Access Denied
          </h2>
          <p>You don&apos;t have permission to access this page.</p>
          <div className="card-actions justify-center mt-4">
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/" className="btn btn-ghost">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default layout