import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useUsers } from "@/hooks/users-hooks";
import { MaskedInput } from "@/components/custom-components/MaskedInput";
import { maskDate, maskPhone } from "@/utils/masks";
import { EmailAuthenticateDialog } from "./EmailAuthenticateDialog";

const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "Informe seu nome")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome inválido"),

    birthDate: z.string().regex(
        /^\d{2}\/\d{2}\/\d{4}$/,
        "Informe a data no formato dd/MM/AAAA"
    ),

    diocese: z.enum([
        "Arquidiocese da Paraíba",
        "Diocese de Guarabira",
        "Diocese de Campina Grande",
        "Diocese de Patos",
        "Diocese de Cajazeiras",
        "Outra",
    ]),

    phone: z.string().regex(
        /^\(\d{2}\) \d \d{4}-\d{4}$/,
        "Telefone inválido"
    ),

    email: z.string().email("E-mail inválido"),

    password: z.string().regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/,
        "A senha precisa ter no mínimo 8 caracteres, com letras, números e caracteres especiais como @, #, $"
    ),
});

export function RegisterCard() {
    const { createUser, loading } = useUsers();

    const [showPassword, setShowPassword] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    });

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
            }
        } catch (error) {
            console.error("Erro ao iniciar cadastro:", error);
        }
    };

    return (
        <>
            <Card className="relative mx-3 my-5 w-auto overflow-hidden rounded-xl bg-white shadow-lg select-none sm:mx-6 sm:my-8 md:mx-auto md:my-10 md:flex md:w-full md:max-w-4xl md:flex-row">

                {/* Imagem ilustrativa e logo para telas médias e grandes */}
                <div className="relative hidden w-full md:block md:w-5/12 lg:w-1/2">
                    <img
                        src="/assets/rcc-register-img-00.png"
                        alt="Ilustração da página de cadastro"
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                    />

                    <img
                        src="/assets/rccpb-04.png"
                        alt="Logo RCC-PB"
                        className="absolute left-1/2 top-8 z-10 h-auto w-32 -translate-x-1/2 object-contain brightness-0 invert lg:top-10 lg:w-40"
                        draggable={false}
                    />
                </div>

                {/* Formulário */}
                <div className="flex min-w-0 w-full flex-col md:w-7/12 lg:w-1/2">

                    <CardHeader className="flex flex-col items-center px-5 pb-2 pt-7 text-center sm:px-8 sm:pt-9 md:px-6 lg:px-8">
                        {/* Logo centralizada em telas pequenas */}
                        <div className="flex w-full justify-center md:hidden">
                            <img
                                src="/assets/rccpb-04.png"
                                alt="Logo RCC-PB"
                                className="mb-3 h-auto w-28 object-contain"
                                draggable={false}
                            />
                        </div>

                        <CardTitle className="w-full text-center text-2xl font-bold sm:text-3xl">
                            Cadastre-se
                        </CardTitle>

                        <CardDescription className="mt-2 w-full max-w-sm text-center text-sm leading-relaxed text-gray-500">
                            Preencha as informações corretamente para se cadastrar
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-5 pb-6 pt-4 sm:px-8 md:px-6 lg:px-8">
                        <FormProvider {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5 sm:space-y-6"
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
                                                    autoComplete="name"
                                                    {...field}
                                                />
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
                                                    autoComplete="bday"
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
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-full min-w-0">
                                                        <SelectValue placeholder="Selecione sua diocese" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="Arquidiocese da Paraíba">
                                                                Arquidiocese da Paraíba
                                                            </SelectItem>
                                                            <SelectItem value="Diocese de Guarabira">
                                                                Diocese de Guarabira
                                                            </SelectItem>
                                                            <SelectItem value="Diocese de Campina Grande">
                                                                Diocese de Campina Grande
                                                            </SelectItem>
                                                            <SelectItem value="Diocese de Patos">
                                                                Diocese de Patos
                                                            </SelectItem>
                                                            <SelectItem value="Diocese de Cajazeiras">
                                                                Diocese de Cajazeiras
                                                            </SelectItem>
                                                            <SelectItem value="Outra">
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
                                                    autoComplete="tel"
                                                    inputMode="tel"
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
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Ex.: email@email.com"
                                                    autoComplete="email"
                                                    {...field}
                                                />
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
                                                <div className="relative">
                                                    <Input
                                                        className="w-full pr-12"
                                                        type={showPassword ? "password" : "text"}
                                                        placeholder="Digite sua senha"
                                                        autoComplete="new-password"
                                                        {...field}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2"
                                                        onClick={() =>
                                                            setShowPassword((visible) => !visible)
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? "Mostrar senha"
                                                                : "Ocultar senha"
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

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Processando...
                                        </>
                                    ) : (
                                        "Prosseguir"
                                    )}
                                </Button>

                                <div className="flex items-center gap-3">
                                    <Separator className="h-px flex-1 bg-gray-300" />
                                    <p className="shrink-0 text-sm text-gray-400">OU</p>
                                    <Separator className="h-px flex-1 bg-gray-300" />
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full hover:bg-green-50 cursor-pointer"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src="/assets/Google.svg"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                        Continuar com Google
                                    </Button>

                                    <p className="text-center text-sm leading-relaxed text-gray-500">
                                        Já possui uma conta?{" "}
                                        <Link
                                            to="/login"
                                            className="font-medium text-green-600 hover:underline"
                                        >
                                            Faça login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </div>
            </Card>

            <EmailAuthenticateDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    );
}
