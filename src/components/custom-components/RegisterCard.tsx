import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from "@radix-ui/react-separator";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/hooks/users-hooks";
import { MaskedInput } from "@/components/custom-components/MaskedInput";
import { maskDate, maskPhone } from "@/utils/masks";
import { EmailAuthenticateDialog } from "./EmailAuthenticateDialog";
import { Link } from "react-router-dom";


const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "Informe seu nome")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome inválido"),

    birthDate: z
        .string()
        .regex(
            /^\d{2}\/\d{2}\/\d{4}$/,
            "Informe a data no formato dd/MM/AAAA"
        ),

    diocese: z
        .enum([
            "Arquidiocese da Paraíba",
            "Diocese de Guarabira",
            "Diocese de Campina Grande",
            "Diocese de Patos",
            "Diocese de Cajazeiras",
            "Outra",
        ]),

    phone: z
        .string()
        .regex(
            /^\(\d{2}\) \d \d{4}-\d{4}$/,
            "Telefone inválido"
        ),

    email: z.string().email("E-mail inválido"),

    password: z
        .string()
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/,
            "A senha precisa ter no mínimo 8 caracteres, com letras, números e caracteres especiais como @, #, $"
        ),
});

export function RegisterCard() {

    const { createUser, loading } = useUsers()
    const [showPassword, setShowPassword] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            birthDate: "",
            diocese: undefined,
            phone: "",
            email: "",
            password: "",
        },
    })


    const onSubmit = async (
        data: z.infer<typeof createUserSchema>
    ) => {
        try {
            const response = await createUser({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password,
                phone: data.phone.replace(/\D/g, ""),
                birthDate: data.birthDate,
                diocese: data.diocese,
            });

            if (response.email) {
                sessionStorage.setItem("emailToVerify", response.email);
                setIsDialogOpen(true);
                console.log(data);

                console.log("Código enviado para:", response.email);
            }
        } catch (error) {
            console.error("Erro ao iniciar cadastro:", error);
        }
    };


    return (
        <>
            <Card className="relative flex flex-row max-w-3xl mx-auto my-10 bg-white shadow-lg rounded-lg select-none">
                <img
                    src="/assets/rccpb-04.png"
                    alt="logo-register-rccpb"
                    className="absolute top-15 left-15 w-1/3 h-auto object-cover filter brightness-0 invert"
                    draggable="false"
                />
                <div className="flex w-full h-full">
                    <img
                        src="/assets/rcc-register-img-00.png"
                        alt="register-img-00"
                        className="w-1/2 h-auto object-cover rounded-l-lg"
                        draggable="false"
                    />
                    <div className="flex flex-col justify-between p-6 w-full">
                        <CardHeader className="flex flex-col items-center">
                            <CardTitle className="font-bold text-3xl">Cadastre-se</CardTitle>
                            <CardDescription className="text-sm text-gray-500 text-center mt-2">
                                Preencha as informações corretamente para se cadastrar
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
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex.: João da Silva"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de nascimento</FormLabel>
                                                <FormControl>
                                                    <MaskedInput
                                                        placeholder="Ex.: 01/01/2000"
                                                        mask={maskDate}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="diocese"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diocese</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione sua diocese" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="Arquidiocese da Paraíba"
                                                                >
                                                                    Arquidiocese da Paraíba
                                                                </SelectItem>
                                                                <SelectItem value="Diocese de Guarabira"
                                                                >
                                                                    Diocese de Guarabira
                                                                </SelectItem>
                                                                <SelectItem value="Diocese de Campina Grande"
                                                                >
                                                                    Diocese de Campina Grande
                                                                </SelectItem>
                                                                <SelectItem value="Diocese de Patos"
                                                                >
                                                                    Diocese de Patos
                                                                </SelectItem>
                                                                <SelectItem value="Diocese de Cajazeiras"
                                                                >
                                                                    Diocese de Cajazeiras
                                                                </SelectItem>
                                                                <SelectItem value="Outra"
                                                                >
                                                                    Outra
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                    <MaskedInput
                                                        placeholder="Ex.: (83) 9 9999-9999"
                                                        mask={maskPhone}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white hover:bg-green-700"
                                    >
                                        {loading ? (
                                            <Loader className="animate-spin" />
                                        ) : (
                                            "Prosseguir"
                                        )}
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
                                            Já possui uma conta?{" "}
                                            <Link
                                                to={"/login"}
                                                className="text-green-600 hover:underline">
                                                Faça login
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </FormProvider>
                        </CardContent>
                    </div>
                </div>
            </Card>
            <EmailAuthenticateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    )
}