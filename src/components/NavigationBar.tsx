'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function NavigationBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              F
            </div>
            <span className="text-xl font-bold hidden sm:inline">Field Supervisor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/projects?action=new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              New Project
            </Link>
            {/* Auth actions */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-200">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-transparent border border-gray-400 text-gray-200 px-3 py-1 rounded-md hover:bg-gray-800 transition text-sm"
              'use client';

              import Link from 'next/link';
              import { usePathname } from 'next/navigation';
              import { useState } from 'react';

              export default function NavigationBar() {
                const pathname = usePathname();
                const [isOpen, setIsOpen] = useState(false);

                const isActive = (href: string) => pathname === href;

                const navItems = [
                  { href: '/', label: 'Home' },
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/projects', label: 'Projects' },
                ];

                return (
                  <nav className="bg-gray-900 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                            F
                          </div>
                          <span className="text-xl font-bold hidden sm:inline">Field Supervisor</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                          {navItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`px-3 py-2 rounded-lg transition ${
                                isActive(item.href)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                          <Link
                            href="/projects?action=new"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            New Project
                          </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Mobile Navigation */}
                      {isOpen && (
                        <div className="md:hidden pb-4 space-y-2">
                          {navItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`block px-3 py-2 rounded-lg transition ${
                                isActive(item.href)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                          <Link
                            href="/projects?action=new"
                            onClick={() => setIsOpen(false)}
                            className="block bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center"
                          >
                            New Project
                          </Link>
                        </div>
                      )}
                    </div>
                  </nav>
                );
              }
