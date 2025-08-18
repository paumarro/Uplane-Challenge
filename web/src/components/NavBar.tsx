import React from 'react';


export default function NavBar() {
    return(
        <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-blue-600" />
            <span className="font-semibold">Uplane</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded border border-black/10 bg-white hover:bg-gray-50">Log in</button>
            <button className="px-3 py-1.5 text-sm rounded bg-black text-white hover:bg-gray-800">Sign up</button>
          </div>
        </div>
      </header>
    )
}
