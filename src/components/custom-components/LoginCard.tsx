import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { CircleX, Eye, EyeOff, Loader } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUsers } from "@/hooks/users-hooks";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const userLoginSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email inválido"),
    password: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/, "A senha precisa ter no mínimo 8 caracteres, com letras, números e caracteres especiais como @, #, $, %, &, *")
})

export function LoginCard() {

    const { loading, userLogin } = useUsers()
    const [showPassword, setShowPassword] = useState(true)

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof userLoginSchema>>({
        resolver: zodResolver(userLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
        try {
            const response = await userLogin(data);
            if (response) {
                console.log("Usuário logado com Sucesso", response);
                const username = response.userName;
                localStorage.setItem("username", username);
                toast("Entrando..", {
                    duration: 2000,
                    icon: <Loader className="text-green-700 animate-spin" />,
                    style: {
                        backgroundColor: "#ffffff",
                        color: "green",
                        gap: "1rem",
                    },
                });
                navigate("/user");
            }
        } catch (error) {
            console.error("Erro ao tentar logar usuário", error)
            toast("Erro ao tentar logar usuário", {
                duration: 5000,
                icon: <CircleX className="text-white" />,
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                    gap: "1rem",
                },
            });
        }

    }

    return (
        <Card className="relative mx-3 my-5 w-auto overflow-hidden rounded-xl bg-white shadow-lg sm:mx-6 sm:my-8 md:mx-auto md:my-10 md:flex md:w-full md:max-w-4xl md:flex-row">
            {/* Imagem lateral: tablets maiores e desktops */}
            <div className="relative hidden min-h-full md:block md:w-5/12 lg:w-1/2">
                <img
                    src="/assets/rcc-login-img-00.png"
                    alt="Ilustração da página de login"
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                />

                {/* Logo sobre a imagem */}
                <img
                    src="/assets/rccpb-04.png"
                    alt="Logo RCC-PB"
                    className="absolute left-1/2 top-8 z-10 h-auto w-32 -translate-x-1/2 object-contain brightness-0 invert lg:top-10 lg:w-40"
                    draggable={false}
                />
            </div>

            {/* Área do formulário */}
            <div className="flex min-w-0 w-full flex-col md:w-7/12 lg:w-1/2">
                <CardHeader className="flex flex-col items-center px-5 pb-2 pt-7 text-center sm:px-8 sm:pt-9 md:px-6 md:pt-8 lg:px-8">
                    {/* Logo centralizada em dispositivos móveis */}
                    <div className="flex w-full justify-center md:hidden">
                        <img
                            src="/assets/rccpb-04.png"
                            alt="Logo RCC-PB"
                            className="mb-4 h-auto w-28 object-contain"
                            draggable={false}
                        />
                    </div>

                    <CardTitle className="w-full text-center text-2xl font-bold sm:text-3xl">
                        Login
                    </CardTitle>

                    <CardDescription className="mt-2 w-full max-w-sm text-center text-sm leading-relaxed text-gray-500">
                        Faça login para entrar na sua conta e acessar os eventos
                        da RCCPB.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-7 sm:px-8 md:px-6 md:pb-8 lg:px-8">
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 sm:space-y-6"
                        >
                            {/* E-mail */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>

                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Ex.: email@email.com"
                                                autoComplete="email"
                                                className="w-full min-w-0"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Senha */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>

                                        <FormControl>
                                            <div className="relative flex min-w-0 items-center">
                                                <Input
                                                    className="w-full min-w-0 pr-12"
                                                    type={
                                                        showPassword
                                                            ? "password"
                                                            : "text"
                                                    }
                                                    placeholder="Digite sua senha"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    aria-label={
                                                        showPassword
                                                            ? "Mostrar senha"
                                                            : "Ocultar senha"
                                                    }
                                                    aria-pressed={!showPassword}
                                                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 cursor-pointer hover:bg-transparent"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Entrar */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Prosseguir"
                                )}
                            </Button>

                            {/* Separador */}
                            <div className="flex items-center gap-3">
                                <Separator className="h-px flex-1 bg-gray-300" />

                                <p className="shrink-0 text-sm text-gray-400">
                                    OU
                                </p>

                                <Separator className="h-px flex-1 bg-gray-300" />
                            </div>

                            {/* Login com Google e cadastro */}
                            <div className="flex flex-col items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full cursor-pointer gap-2 hover:bg-green-50"
                                >
                                    <img
                                        className="h-5 w-5 shrink-0"
                                        src="/assets/Google.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />

                                    <span>Continuar com Google</span>
                                </Button>

                                <p className="text-center text-sm leading-relaxed text-gray-500">
                                    Não possui uma conta?{" "}
                                    <Link
                                        to="/signup"
                                        className="font-medium text-green-600 hover:underline"
                                    >
                                        Cadastrar
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </div>
        </Card>
    );

}