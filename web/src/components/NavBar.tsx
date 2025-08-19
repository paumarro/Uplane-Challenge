import React from 'react';
import SvgImage from '../assets/uplane-logo.svg'; // Replace with the actual path to your PNG
import PngImage from '../assets/uplane-imagotype.png'; // Replace with the actual path to your SVG

export default function NavBar() {
  return (
    <header className="pt-10">
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="https://uplane.com/" className="flex items-center gap-2">
            <img src={PngImage} alt="PNG Logo" className="h-14" />
            <img src={SvgImage} alt="SVG Logo" className="h-8" />
            </a>
          </div>
          <div className="hidden md:flex items-left gap-4 text-sm text-gray-700">
            <span><a href="https://www.linkedin.com/in/pau-marro/" className="hover:underline">Company</a></span>
            <span className="hidden [@media(min-width:1000px)]:flex">Remove Background</span>
            <span>Editing Services</span>
            <span><a href="https://www.linkedin.com/in/pau-marro/" className="hover:underline">About Me</a></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a className="bg-transparent text-gray-700 rounded-full border border-gray-300 px-7 py-3 text-base font-semibold transition-all duration-200 hover:bg-gray-500/10" href="https://app.uplane.com">Log in</a>
          </div>
      </div>
    </header>
  );
}
