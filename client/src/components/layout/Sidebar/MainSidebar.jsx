import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarBody, SidebarLink } from "../../ui/sidebar";
import { useSidebar } from "../../ui/useSidebar";
import {
  IconLayoutDashboard,
  IconReceipt,
  IconTarget,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import { logo } from "../../../assets/data/images.json";

// Inner component that uses sidebar context
const SidebarContent = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpen } = useSidebar();

  const handleNavigation = (item) => {
    navigate(item.path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarBody className="justify-between gap-4 md:gap-10">
      <div className="flex flex-2 flex-col overflow-x-hidden overflow-y-auto">
        {/* Logo - Always show on desktop, show on mobile in sidebar */}
        <div className="flex items-center justify-start min-h-[50px] md:min-h-[60px]">
          {/* Desktop: Always show logo */}
          <div className="hidden md:flex items-center gap-2">
            <img
              src={logo[0].source}
              alt="PlanWise"
              className="w-16 h-12 flex-shrink-0"
            />
            <p className="text-lg font-bold whitespace-nowrap">PlanWise</p>
          </div>
          {/* Mobile - Show logo */}
          <div className="flex md:hidden items-center gap-2 px-2">
            <img src={logo[0].source} alt="PlanWise" className="w-12 h-9" />
            <p className="text-base font-bold">PlanWise</p>
          </div>
        </div>
        <div className="mt-4 md:mt-8 flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarLink
              key={item.key}
              link={{
                ...item,
                active: isActive(item.path),
              }}
              onClick={() => handleNavigation(item)}
            />
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <SidebarLink
          link={{
            label: "Logout",
            icon: (
              <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
          }}
          onClick={handleLogout}
        />
      </div>
    </SidebarBody>
  );
};

const MainSidebar = () => {
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/app/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      key: "transactions",
      label: "Transactions",
      path: "/app/transactions",
      icon: (
        <IconReceipt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      key: "goals",
      label: "Goals",
      path: "/app/goals",
      icon: (
        <IconTarget className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      key: "reports",
      label: "Reports",
      path: "/app/reports",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return <SidebarContent menuItems={menuItems} />;
};

export default MainSidebar;
