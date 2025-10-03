import React, { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <a href="#" className="inline-flex items-center gap-2" onClick={closeMenu}>
          <span className="inline-block h-8 w-8 rounded bg-emerald-500/10 ring-1 ring-emerald-500/30" />
          <span className="text-lg font-semibold tracking-tight">FarmHelper</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Home</a>
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#more" className="text-gray-700 hover:text-emerald-600 transition-colors">More</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors">Login</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-md shadow-sm transition-colors">Sign up</button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
          className="md:hidden relative h-10 w-10 grid place-items-center rounded-md ring-1 ring-gray-200 hover:ring-gray-300 transition"
        >
          <span className="sr-only">Open main menu</span>
          {/* Animated hamburger icon */}
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-transform duration-300 ${isOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
          />
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
              }`}
          />
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-transform duration-300 ${isOpen ? '-translate-y-1.5 -rotate-45' : ''
              }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
          <div className="flex flex-col gap-3 py-2 text-base font-medium">
            <a onClick={closeMenu} href="#home" className="px-2 py-2 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Home</a>
            <a onClick={closeMenu} href="#features" className="px-2 py-2 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Features</a>
            <a onClick={closeMenu} href="#more" className="px-2 py-2 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-colors">More</a>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button onClick={closeMenu} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 rounded-md hover:bg-gray-50 transition-colors">Login</button>
            <button onClick={closeMenu} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-md shadow-sm transition-colors">Sign up</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar


