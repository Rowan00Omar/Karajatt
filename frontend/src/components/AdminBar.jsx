import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  BadgeDollarSign,
  Warehouse,
  User,
  PanelRightOpen,
  PanelLeftOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
} from "./ui/sidebar";

const items = [
  {
    title: "المبيعات و الطلبات",
    path: "/admin/sales",
    icon: BadgeDollarSign,
  },
  {
    title: "المخزون والمنتجات",
    path: "/admin/inventory",
    icon: Warehouse,
  },
  {
    title: "المستخدمون و السلوك",
    path: "/admin/users",
    icon: User,
  },
];

export function AdminBar({ isOpen }) {
  const location = useLocation();

  return (
    <div className="flex" dir="rtl">
      <Sidebar side="right" collapsible="icon" variant="sidebar">
        <SidebarHeader>
          {isOpen ? (
            <SidebarMenuButton>
              <PanelLeftOpen />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton>
              <PanelRightOpen />
            </SidebarMenuButton>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>لوحة التحكم</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={location.pathname === item.path ? "bg-muted" : ""}
                    >
                      <Link to={item.path}>
                        <span>{item.title}</span>
                        <item.icon />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>ِAhlan</SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AdminBar;
