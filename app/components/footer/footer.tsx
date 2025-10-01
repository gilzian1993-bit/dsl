import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#252525] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 justify-center items-start text-left">
          {/* Logo + About */}
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <Link href="/">
                <img src="/Logo.png" alt="Logo" className="h-[80px] w-auto mb-1" />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              DSL Limo offers top-rated limousine and car services in New York and New Jersey, with professional, licensed drivers. We ensure secure, memorable rides to airports or nearby states at reasonable rates. With a vast network and quick response time, customer satisfaction is our top priority.
            </p>
            <h1 className="text-2xl mt-4 mb-4">SOCIAL LINKS</h1>
            <div className="flex flex-wrap gap-4">
              {[
                { href: "https://www.facebook.com/share/19umZJX6Cc/?mibextid=wwXIfr", src: "/facebook.svg", alt: "facebook" },
                { href: "https://www.instagram.com/dsl_limo25?igsh=c3A5eXY4NjlnYXN2&utm_source=qr", src: "/instagram.svg", alt: "instagram" },
              ].map((icon) => (
                <a
                  key={icon.alt}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={22}
                    height={22}
                    className="object-contain w-8 h-8"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-semibold text-lg mb-5">PAGES</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/fleet"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Fleet
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-semibold text-lg mb-5">CONTACT INFO</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    3193 Washington Rd, Parlin, NJ 08859, USA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a
                  href="tel:+18006793415"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  +1 800 679 3415
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a
                  href="mailto:info@dsllimoservice.com"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  info@dsllimoservice.com
                </a>
              </div>
            </div>

            {/* Mobile social icons */}
            <h1 className="text-2xl mt-4 mb-4 md:hidden block">SOCIAL LINKS</h1>
            <div className="flex md:hidden block mt-4 gap-4">
              {[
                { href: "https://www.facebook.com/share/19umZJX6Cc/?mibextid=wwXIfr", src: "/facebook.svg", alt: "facebook" },
                { href: "https://www.instagram.com/dsl_limo25?igsh=c3A5eXY4NjlnYXN2&utm_source=qr", src: "/instagram.svg", alt: "instagram" },
              ].map((icon) => (
                <a
                  key={icon.alt}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={22}
                    height={22}
                    className="w-5 h-5 sm:w-7 sm:h-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto flex md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-6 gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-left">
            Copyright © {new Date().getFullYear()} DSL Limo Services. All Rights Reserved
          </p>

          {/* Desktop social icons */}
          <div className="md:flex flex-wrap justify-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              Developed by,<a href="https://thedevsquare.com/" className="text-[#008492] font-bold"> The DevSquare</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
