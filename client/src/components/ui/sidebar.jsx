"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useSidebar } from "./useSidebar";
import { SidebarContext } from "./sidebar-context";

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate = true }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  return (
    <>
      <div
        className={cn(
          "fixed top-20 left-0 h-[calc(100vh-5rem)] w-[300px] px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 z-30 border-r border-neutral-200 dark:border-neutral-700",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

// Mobile menu button component that can be used in navbar
export const MobileSidebarTrigger = ({ currentRouteIcon }) => {
  const { open, setOpen } = useSidebar();
  return (
    <button
      className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      onClick={() => setOpen(!open)}
      aria-label="Toggle menu"
    >
      {currentRouteIcon || (
        <IconMenu2 className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
      )}
    </button>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-[280px] max-w-[85vw] left-0 top-0 bg-white dark:bg-neutral-900 shadow-xl z-[100] flex flex-col md:hidden overflow-y-auto",
                className
              )}
              {...props}
            >
              <div className="p-4 pb-6 flex flex-col h-full">
                <div className="flex items-center justify-end mb-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <IconX className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">{children}</div>
              </div>
            </motion.div>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[99] md:hidden"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({ link, className, onClick, ...props }) => {
  const { setOpen } = useSidebar();
  const isActive = link.active || false;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        setTimeout(() => setOpen(false), 100);
      }
    }
  };

  const content = (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "bg-blue-100 dark:bg-blue-900 font-semibold"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-700",
        className
      )}
      {...props}
    >
      {link.icon}
      <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
        {link.label}
      </span>
    </div>
  );

  // If href is provided, use anchor tag, otherwise use div
  if (link.href && !onClick) {
    return (
      <a href={link.href} className="block">
        {content}
      </a>
    );
  }

  return content;
};
