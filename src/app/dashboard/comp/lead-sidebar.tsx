"use client"; // Add this at the top to mark as Client Component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Package, Settings, LayoutDashboard, CheckSquare } from "lucide-react";

export function LeadSidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard/lead", 
      icon: <LayoutDashboard className="h-4 w-4" /> 
    },
    { 
      name: "Assigned Tasks", 
      path: "/assignedtasks", 
      icon: <CheckSquare className="h-4 w-4" /> 
    },
    { 
      name: "Analytics", 
      path: "#", 
      icon: <BarChart3 className="h-4 w-4" /> 
    },
    { 
      name: "New Task", 
      path: "/create", 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      name: "Settings", 
      path: "#1", 
      icon: <Package className="h-4 w-4" /> 
    }
  ];

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex h-12 items-center border-b px-4 font-semibold">
          <span>Navigation</span>
        </div>
        <nav className="grid gap-1 px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                pathname === item.path || 
                (item.path !== "#" && pathname.startsWith(item.path))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}