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

// import * as React from "react"
// import {
//     Contact,
//     PackagePlus,
//     MessageCircleQuestion,
//     House,
//     ClipboardPen,
//     NotebookPen,
// } from "lucide-react"
// import { NavUser } from "../NavUser"
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarGroupLabel,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarRail,
// } from "@/components/ui/sidebar"
// import { useEffect, useState } from "react";

// type UserSidebarProps = {
//     onMenuClick: (option: number) => void;
//     activeOption: number;
//     props?: React.ComponentProps<typeof Sidebar>;
// };

// export default function UserSidebar({
//     onMenuClick,
//     activeOption,
//     ...props
// }: UserSidebarProps) {

//     const [storedUserRoles, setStoredUserRoles] = useState<string[]>([])

//     useEffect(() => {
//         const storedUserRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
//         setStoredUserRoles(storedUserRoles)
//     }, [])
//     const data = {
//         user: {
//             name: "username",
//             avatar: "/avatars/shadcn.jpg",
//         },
//         items: [
//             {
//                 id: 2,
//                 title: "Página inicial",
//                 // url: "#",
//                 icon: House,
//                 roles: ["commonUser", "adminSystemUser"],
//             },
//             {
//                 id: 3,
//                 title: "Minhas reservas",
//                 // url: "#",
//                 icon: NotebookPen,
//                 roles: ["commonUser", "adminSystemUser"],
//             },
//             {
//                 id: 4,
//                 title: "Cadastrar produtos",
//                 // url: "#",
//                 icon: PackagePlus,
//                 roles: ["adminSystemUser"],
//             },
//             {
//                 id: 5,
//                 title: "Associar-se",
//                 // url: "#",
//                 icon: Contact,
//                 roles: ["commonUser", "adminSystemUser"],
//             },
//             {
//                 id: 6,
//                 title: "Dúvidas",
//                 // url: "#",
//                 icon: MessageCircleQuestion,
//                 roles: ["commonUser", "adminSystemUser"],
//             },
//             {
//                 id: 7,
//                 title: "Solicitações",
//                 // url: "#",
//                 icon: ClipboardPen,
//                 roles: ["adminSystemUser"],
//             },
//         ],
//     }

//     return (
//         <Sidebar collapsible="icon" {...props}>
//             <SidebarHeader>
//                 <NavUser onNavUserOption={(navUserOption) => onMenuClick(navUserOption)} />
//             </SidebarHeader>
//             <SidebarContent>
//                 <SidebarGroup>
//                     <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {data.items
//                                 .filter(item =>
//                                     item.roles.some(role => storedUserRoles.includes(role)))
//                                 .map((item) => (
//                                     <SidebarMenuItem key={item.title}>
//                                         <SidebarMenuButton
//                                             className={`hover:cursor-pointer ${activeOption === item.id && "bg-orange-100 text-orangeLight"}`}
//                                             onClick={() => onMenuClick(item.id)}
//                                         >
//                                             <item.icon />
//                                             <span>{item.title}</span>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 ))}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>
//             <SidebarFooter>
//                 <SidebarMenuButton
//                     size="lg"
//                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-default hover:bg-transparent hover:text-current"
//                 >
//                     <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
//                         <img
//                             src="/assets/logo multi.png"
//                             alt="Logo UEPB MULTI"
//                             className="size-8"
//                         />
//                     </div>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                         <span className="truncate font-medium">UEPB MULTI</span>
//                     </div>
//                 </SidebarMenuButton>
//             </SidebarFooter>
//             <SidebarRail />
//         </Sidebar>
//     )
// }

// export { UserSidebar }
