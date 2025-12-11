"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Don't render sidebar on login page
  if (pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Image
          src="/Logo.png"
          alt="DSL Logo"
          width={120}
          height={60}
          className="object-contain"
        />
        <div className="flex items-center gap-2">
          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/dsl_limo25?igsh=c3A5eXY4NjlnYXN2&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-pink-600 hover:text-pink-700 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram className="h-5 w-5" />
          </a>
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/19178478075"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-green-600 hover:text-green-700 transition-colors"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Image
              src="/Logo.png"
              alt="DSL Logo"
              width={140}
              height={70}
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="mb-4 px-4 py-2">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}

