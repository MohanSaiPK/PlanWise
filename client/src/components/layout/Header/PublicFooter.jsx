import React from "react";
import { logo } from "../../../assets/data/images.json";

const PublicFooter = () => {
  return (
    <footer className="bg-black text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <img
                src={logo[0].source}
                alt="PlanWise"
                className="w-12 h-9 sm:w-16 sm:h-12"
              />
              <h2 className="font-bold text-lg sm:text-xl">PlanWise</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Track your finances and get a clear picture of your financial
              health.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h3 className="font-semibold text-base sm:text-lg text-white">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h3 className="font-semibold text-base sm:text-lg text-white">
              Contact Us
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-sm sm:text-base text-gray-400">
                123 Main St, Anytown, USA
              </p>
              <a
                href="mailto:info@planwise.com"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                info@planwise.com
              </a>
              <a
                href="tel:+11234567890"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                +1 (123) 456-7890
              </a>
            </div>
          </div>

          {/* Social/Additional Info */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h3 className="font-semibold text-base sm:text-lg text-white">
              Follow Us
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} PlanWise. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 hover:text-green-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 hover:text-green-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
