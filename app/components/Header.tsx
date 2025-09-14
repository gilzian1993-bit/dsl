"use client";

import React, { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "HOME", path: "/" },
  { label: "FLEET", path: "/fleet" },
  { label: "SERVICES", path: "/services" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
];

// 🔹 background images for each page
const pageBackgrounds: Record<string, string> = {
  "/": "/hero-section.png",
  "/fleet": "/serve-image.png",
  "/services": "/serve-image.png",
  "/about": "/about-bg.png",
  "/contact": "/contact-bg.png",
};

const HeaderBar: React.FC = () => {
  const pathname = usePathname();
  const backgroundImage = pageBackgrounds[pathname] || "/hero-section.png";
  const [mobileOpen, setMobileOpen] = useState(false);
useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);
  return (
    <header className="relative w-full bg-[#232323] overflow-hidden z-20">
      {/* Background overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 pointer-events-none z-0"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      <nav className="relative z-10 h-14 px-4 flex items-center justify-between md:justify-center">
        {/* Logo (mobile left, desktop centered) */}
        <Link href="/" className="flex block md:hidden items-center z-20">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={100}
            height={30}
            className="h-7 w-auto md:h-8"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center h-14 list-none pb-0 m-0">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={item.label}
                className="h-14 min-w-[90px] flex items-center justify-center text-[11px] font-hind tracking-wider border-[#444]"
              >
                <Link
                  href={item.path}
                  className={`block px-3 py-1 h-full flex items-center justify-center transition-colors border-b-2 ${
                    isActive
                      ? "border-[#008492] text-[#008492] font-semibold"
                      : "border-transparent text-[#ededed] hover:text-[#008492]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop search */}
        <div className="hidden md:block absolute right-[20%] top-1/2 -translate-y-1/2 z-20">
          <Search className="w-[15px] h-[15px] text-[#ededed] cursor-pointer" />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden z-20 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
{/* gg */}
      {/* Mobile menu with framer-motion animation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 top-14 bg-[#232323]/95 backdrop-blur-sm flex flex-col px-5  justify-start py-6 space-y-6 md:hidden z-50"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive
                      ? "text-[#008492] font-semibold"
                      : "text-white hover:text-[#008492]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderBar;
