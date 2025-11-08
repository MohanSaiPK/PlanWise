import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import {
  IconLayoutDashboard,
  IconReceipt,
  IconTarget,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { logo } from "../../../assets/data/images.json";

const MainSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-2 flex-col overflow-x-hidden overflow-y-auto">
          <div className="flex  items-center justify-start">
            <img src={logo[0].source} alt="PlanWise" className="w-16 h-12" />
            <p className="text-lg font-bold">PlanWise</p>
          </div>
          <div className="mt-8 flex flex-col gap-2">
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
        <div>
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
    </Sidebar>
  );
};

export default MainSidebar;
