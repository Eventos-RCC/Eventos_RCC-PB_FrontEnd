
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CircleCheck, Loader, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/hooks/users-hooks";
import type { AddressRequest } from "@/hooks/users-hooks";
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

const addressSchema = z.object({
    street: z.string().trim().min(1, "Informe a rua ou avenida"),
    number: z.string().trim().min(1, "Informe o número"),
    complement: z.string(),
    neighborhood: z.string().trim().min(1, "Informe o bairro"),
    city: z.string().trim().min(1, "Informe a cidade"),
    state: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{2}$/, "Informe uma UF válida, com 2 letras"),
    zipCode: z
        .string()
        .regex(
            /^\d{5}-?\d{3}$/,
            "Informe um CEP válido, como 58000-000"
        ),
});

type AddressFormData = z.infer<typeof addressSchema>;

export function AddressCard() {
    const { saveAddress, loading } = useUsers();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
        },
    });

    const onSubmit = async (data: AddressFormData) => {
        setSubmitError(null);

        const address: AddressRequest = {
            street: data.street.trim(),
            number: data.number.trim(),
            complement: data.complement.trim(),
            neighborhood: data.neighborhood.trim(),
            city: data.city.trim(),
            state: data.state.trim().toUpperCase(),
            zipCode: data.zipCode.replace(/\D/g, ""),
        };

        try {
            const response = await saveAddress(address);
            console.log("Endereço salvo:", response);
            toast.success("Endereço salvo com sucesso!");


            toast("Endereço salvo com sucesso!", {
                duration: 5000,
                icon: <CircleCheck className="text-white" />,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                    gap: "1rem",
                },
            });

            navigate("/user/onboarding3");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Não foi possível salvar o endereço";

            setSubmitError(message);
            toast.error(message);
        }
    };

    return (
        <Card className="relative max-w-3xl mx-auto my-10 bg-white shadow-lg rounded-lg">
            <CardHeader className="flex flex-col items-center">
                <MapPin className="w-10 h-10 text-green-600" />

                <CardTitle className="font-bold text-3xl">
                    Seu endereço
                </CardTitle>

                <CardDescription className="text-sm text-gray-500 text-center mt-2">
                    Informe seu endereço para continuar o cadastro.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rua / Avenida</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex.: Rua das Flores"
                                            autoComplete="address-line1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex.: 123 ou S/N"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento (opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex.: Apartamento 202"
                                                autoComplete="address-line2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="neighborhood"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex.: Centro"
                                            autoComplete="address-level3"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex.: João Pessoa"
                                                autoComplete="address-level2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado (UF)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex.: PB"
                                                maxLength={2}
                                                autoComplete="address-level1"
                                                {...field}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        event.target.value.toUpperCase()
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex.: 58000-000"
                                            autoComplete="postal-code"
                                            maxLength={9}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitError && (
                            <p role="alert" className="text-sm text-red-500">
                                {submitError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando endereço...
                                </>
                            ) : (
                                "Salvar e continuar"
                            )}
                        </Button>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}
