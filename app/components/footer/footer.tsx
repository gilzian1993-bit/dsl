import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#252525] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 text-left">
          {/* Logo + About */}
          <div>
            <div className="mb-4">
              <Link href="/">
                <Image src="/Logo.png" alt="Logo" width={120} height={40} />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Cum sociis natoque penatibus et magnis dis parturient montes,
              nascetur ridiculus mus. Morbi leo risus, porta.
            </p>
          </div>

          {/* Pages */}
          <div>
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
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              CONTACT INFO
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Main Centre Street West,
                  </p>
                  <p className="text-gray-300 text-sm">NY 10001 USA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a
                  href="tel:+8001234567"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  +800 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a
                  href="tel:+12124567890"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  +1 212 456 7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a
                  href="mailto:booking@limo.com"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  booking@limo.com
                </a>
              </div>
            </div>

            {/* Mobile social icons */}
            <div className="flex md:hidden block mt-4 gap-4">
              {[
                { href: "https://www.facebook.com/share/19umZJX6Cc/?mibextid=wwXIfr", src: "/facebook.svg", alt: "facebook" },
                { href: "https://twitter.com", src: "/twitter.svg", alt: "twitter" },
                { href: "https://dribbble.com", src: "/dribble.svg", alt: "dribbble" },
                { href: "https://pinterest.com", src: "/pinterest.svg", alt: "pinterest" },
                { href: "https://google.com", src: "/google.svg", alt: "google" },
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
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-6 gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            Copyright © {new Date().getFullYear()} Grand Limo. All Rights
            Reserved
          </p>

          {/* Desktop social icons */}
          <div className="hidden md:flex flex-wrap justify-center gap-4">
            {[
              { href: "https://www.facebook.com/share/19umZJX6Cc/?mibextid=wwXIfr", src: "/facebook.svg", alt: "facebook" },
              { href: "https://twitter.com", src: "/twitter.svg", alt: "twitter" },
              { href: "https://dribbble.com", src: "/dribble.svg", alt: "dribbble" },
              { href: "https://pinterest.com", src: "/pinterest.svg", alt: "pinterest" },
              { href: "https://google.com", src: "/google.svg", alt: "google" },
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
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
