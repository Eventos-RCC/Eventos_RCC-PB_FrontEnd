import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    Bell,
    Loader,
    LogOut,
    Settings,
    User,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserInitials } from "@/utils/manipulateNames";

export function UserHeaderBar() {

    const [userName, setUserName] = useState<string>("");
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch("/api/users/logout", {
                method: "POST",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Erro ao tentar fazer logout");
            }

            localStorage.removeItem("username");
            toast("Saindo..", {
                duration: 2000,
                icon: <Loader className="text-green-700 animate-spin" />,
                style: {
                    backgroundColor: "#ffffff",
                    color: "green",
                    gap: "1rem",
                },
            });
            console.log("Usuário deslogado com sucesso");
            navigate("/login");
        } catch (error) {
            console.error("Erro ao tentar fazer logout:", error)
        }
    }

    useEffect(() => {
        const storedName = localStorage.getItem("username");
        if (storedName) {
            setUserName(storedName);
        } else {
            console.warn("Nenhum nome de usuário encontrado na localStorage");
        }
    }, []);


    const initials = getUserInitials(userName);

    return (
        <div className="flex h-20 items-center justify-between px-8 select-none">
            <Link to={"/user"}>
                <img
                    src="/assets/rccpb-01.png"
                    alt="logo-rcc-pb"
                    className="h-[56px] w-[122px]"
                    draggable="false"
                />
            </Link>
            <div className="flex items-center gap-5">
                <DropdownMenu>
                    <Button
                        variant="ghost"
                        className="font-semibold hover:cursor-pointer"
                    >
                        <Bell className="w-5 h-5" />
                    </Button>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <Avatar>
                                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                                <AvatarFallback className="bg-green-600 text-white hover:cursor-pointer hover:bg-green-500">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="hover:cursor-pointer">
                                <User />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:cursor-pointer">
                                <Settings />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="hover:cursor-pointer"
                        >
                            <LogOut />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}