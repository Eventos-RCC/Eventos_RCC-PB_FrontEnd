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
        <Card className="relative flex flex-row max-w-3xl mx-auto my-10 bg-white shadow-lg rounded-lg select-none">
            <img
                src="/assets/rccpb-04.png"
                alt="logo-register-rccpb"
                className="absolute top-15 left-15 w-1/3 h-auto object-cover filter brightness-0 invert"
                draggable="false"
            />
            <div className="flex w-full h-full">
                <img
                    src="/assets/rcc-login-img-00.png"
                    alt="login-img-00"
                    className="w-1/2 h-auto object-cover rounded-l-lg"
                    draggable="false"
                />
                <div className="flex flex-col justify-around p-6 w-full">
                    <CardHeader className="flex flex-col items-center">
                        <CardTitle className="font-bold text-3xl">Login</CardTitle>
                        <CardDescription className="text-sm text-gray-500 text-center mt-2">
                            Faça login para entrar na sua conta e acessar os eventos da RCCPB.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                        <FormProvider {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex.: email@email.com"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center space-x-2 relative">
                                                    <Input
                                                        className="w-full pr-10"
                                                        type={showPassword
                                                            ? "password"
                                                            : "text"
                                                        }
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent hover:cursor-pointer"
                                                        variant="ghost"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword
                                                            ? <EyeOff className="w-5 h-5" />
                                                            : <Eye className="w-5 h-5" />
                                                        }
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                                >
                                    {loading ? <Loader className="animate-spin" /> : "Prosseguir"}
                                </Button>
                                <div className="flex items-center justify-between space-x-2">
                                    <Separator className="flex-grow h-px bg-gray-300" />
                                    <p className="text-sm text-gray-400">OU</p>
                                    <Separator className="flex-grow h-px bg-gray-300" />
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        className="w-full hover:bg-green-50 hover:cursor-pointer"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src="/assets/Google.svg"
                                            alt="google-logo"
                                        />
                                        Continuar com Google
                                    </Button>
                                    <p className="text-sm text-gray-400">
                                        Não possui uma conta?{" "}
                                        <Link
                                            to={"/signup"}
                                            className="text-green-600 hover:underline">
                                            Cadastrar
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </div>
            </div>
        </Card>
    )
}