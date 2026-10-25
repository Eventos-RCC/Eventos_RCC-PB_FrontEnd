import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

export function HeaderBar() {
    const [menuAberto, setMenuAberto] = useState(false);

    function irParaSobre() {
        setMenuAberto(false);

        document.getElementById("sobre")?.scrollIntoView({
            behavior: "smooth",
        });
    }

    return (
        <header className="relative z-50 w-full bg-white shadow-md">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:min-h-20 sm:px-6 md:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="shrink-0"
                    onClick={() => setMenuAberto(false)}
                    aria-label="Página inicial"
                >
                    <img
                        src="/assets/rccpb-01.png"
                        alt="Logo RCC-PB"
                        className="h-auto w-[90px] object-contain sm:w-[110px] md:w-[122px]"
                        draggable={false}
                    />
                </Link>

                {/* Navegação para telas médias e grandes */}
                <nav
                    aria-label="Navegação principal"
                    className="hidden items-center gap-3 md:flex lg:gap-5"
                >
                    <Button
                        variant="ghost"
                        className="font-semibold cursor-pointer"
                        onClick={irParaSobre}
                    >
                        Sobre
                    </Button>

                    <Link to="/signup">
                        <Button variant="ghost" className="font-semibold cursor-pointer">
                            Cadastrar
                        </Button>
                    </Link>

                    <Link to="/login">
                        <Button className="w-28 bg-green-600 text-white hover:bg-green-700 cursor-pointer">
                            Login
                        </Button>
                    </Link>
                </nav>

                {/* Botão hambúrguer para telas pequenas */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 md:hidden"
                    onClick={() => setMenuAberto((aberto) => !aberto)}
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                    aria-controls="menu-mobile"
                >
                    {menuAberto ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Menu para dispositivos móveis */}
            {menuAberto && (
                <nav
                    id="menu-mobile"
                    aria-label="Navegação móvel"
                    className="border-t bg-white px-4 py-3 md:hidden"
                >
                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start font-semibold"
                            onClick={irParaSobre}
                        >
                            Sobre
                        </Button>

                        <Link
                            to="/signup"
                            onClick={() => setMenuAberto(false)}
                            className="w-full"
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start font-semibold"
                            >
                                Cadastrar
                            </Button>
                        </Link>

                        <Link
                            to="/login"
                            onClick={() => setMenuAberto(false)}
                            className="w-full"
                        >
                            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                                Login
                            </Button>
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
