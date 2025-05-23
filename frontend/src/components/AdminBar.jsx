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
    url: "#",
    icon: BadgeDollarSign,
  },
  {
    title: "المخزون والمنتجات",
    url: "#",
    icon: Warehouse,
  },
  {
    title: "المستخدمون و السلوك",
    url: "#",
    icon: User,
  },
];
export function AdminBar({ isOpen }) {
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
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <span>{item.title}</span>
                        <item.icon />
                      </a>
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
