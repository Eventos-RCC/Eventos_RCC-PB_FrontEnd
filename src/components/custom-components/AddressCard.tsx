import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
    CircleCheck,
    CircleX,
    Loader,
    MapPin,
    Search,
} from "lucide-react";
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
        .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido, como 58000-000"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean | string;
}

export function AddressCard() {
    const { saveAddress, loading } = useUsers();
    const navigate = useNavigate();

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepMessage, setCepMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    // Evita que uma resposta antiga sobrescreva uma consulta mais recente.
    const cepRequestId = useRef(0);

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

    async function buscarCep() {
        const cep = form.getValues("zipCode").replace(/\D/g, "");
        const requestId = ++cepRequestId.current;

        setCepMessage(null);

        if (cep.length !== 8) {
            setCepLoading(false);
            setCepMessage({
                text: "Digite um CEP com 8 números para consultar.",
                type: "error",
            });
            form.setError("zipCode", {
                type: "manual",
                message: "Informe um CEP válido com 8 números.",
            });
            return;
        }

        form.clearErrors("zipCode");
        setCepLoading(true);

        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (!response.ok) {
                throw new Error("Não foi possível consultar o CEP agora.");
            }

            const data: ViaCepResponse = await response.json();

            if (requestId !== cepRequestId.current) return;

            if (data.erro) {
                setCepMessage({
                    text: "CEP não encontrado. Confira os números ou preencha o endereço manualmente.",
                    type: "error",
                });
                return;
            }

            // Preenche os campos quando a API retorna valores.
            // Campos sem informação são mantidos como estavam.
            const fields = [
                ["street", data.logradouro],
                ["neighborhood", data.bairro],
                ["city", data.localidade],
                ["state", data.uf],
            ] as const;

            for (const [field, value] of fields) {
                if (value?.trim()) {
                    form.setValue(field, value, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
            }

            setCepMessage({
                text: "Endereço localizado! Confira os dados e acrescente o que for necesssário.",
                type: "success",
            });
        } catch {
            if (requestId !== cepRequestId.current) return;

            setCepMessage({
                text: "Não foi possível consultar o ViaCEP. Você pode preencher o endereço manualmente.",
                type: "error",
            });
        } finally {
            if (requestId === cepRequestId.current) {
                setCepLoading(false);
            }
        }
    }

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

            toast("Endereço salvo com sucesso!", {
                duration: 5000,
                icon: <CircleCheck className="text-white" />,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                    gap: "1rem",
                },
            });

            navigate("/groups-and-ministries");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Não foi possível salvar o endereço";

            setSubmitError(message);

            toast("Não foi possível salvar o endereço", {
                duration: 5000,
                icon: <CircleX className="text-white" />,
                style: {
                    backgroundColor: "#dc2626",
                    color: "white",
                    gap: "1rem",
                },
            });
        }
    };

    return (
        <Card className="mx-auto my-10 max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <CardHeader className="flex flex-col items-center">
                <MapPin className="h-10 w-10 text-green-600" />

                <CardTitle className="text-3xl font-bold">
                    Seu endereço
                </CardTitle>

                <CardDescription className="mt-2 text-center text-sm text-gray-500">
                    Informe seu CEP para preencher o endereço automaticamente.
                    Você poderá revisar e editar os campos antes de continuar.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* CEP primeiro */}
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ex.: 58000-000"
                                                autoComplete="postal-code"
                                                maxLength={9}
                                                inputMode="numeric"
                                                className="flex-1"
                                                onChange={(event) => {
                                                    const value =
                                                        event.target.value.replace(
                                                            /[^\d-]/g,
                                                            ""
                                                        );

                                                    field.onChange(value);
                                                    setCepMessage(null);

                                                    // Invalida consultas anteriores
                                                    // se o CEP for alterado.
                                                    cepRequestId.current++;
                                                    setCepLoading(false);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        void buscarCep();
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="shrink-0 cursor-pointer"
                                            disabled={cepLoading}
                                            onClick={() => void buscarCep()}
                                        >
                                            {cepLoading ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Search className="mr-2 h-4 w-4" />
                                            )}
                                            {cepLoading
                                                ? "Consultando..."
                                                : "Buscar CEP"}
                                        </Button>
                                    </div>

                                    <FormMessage />

                                    {cepMessage && (
                                        <p
                                            role="status"
                                            aria-live="polite"
                                            className={`text-sm ${
                                                cepMessage.type === "success"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {cepMessage.text}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />

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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        <FormLabel>
                                            Complemento (opcional)
                                        </FormLabel>
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                        {submitError && (
                            <p role="alert" className="text-sm text-red-500">
                                {submitError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || cepLoading}
                            className="w-full bg-green-600 text-white hover:bg-green-700 cursor-pointer"
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
