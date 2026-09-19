import { CalendarDays, Home } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

type SidebarProps = {
    onMenuClick: (option: number) => void;
    activeOption: number;
};

export function AppSidebar({ onMenuClick, activeOption }: SidebarProps) {

    // Menu items.
const items = [
    {
        id: 0,
        title: "Home",
        // url: "#",
        icon: Home,
    },
    {
        id: 1,
        title: "Eventos",
        // url: "#",
        icon: CalendarDays,
    },
    // {
    //     title: "Inbox",
    //     url: "#",
    //     icon: Inbox,
    // },
    // {
    //     title: "Calendar",
    //     url: "#",
    //     icon: Calendar,
    // },
    // {
    //     title: "Search",
    //     url: "#",
    //     icon: Search,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
]

    return (
        <Sidebar collapsible="icon" className="border-r-2 w-[250px] h-auto">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className={`hover:cursor-pointer ${activeOption === item.id && "bg-green-100 text-green-600"}`}
                                        onClick={() => onMenuClick(item.id)}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
