
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    CheckCircle2,
    CircleCheck,
    CircleX,
    GraduationCap,
    LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useUsers } from "@/hooks/users-hooks";
import type { RccFormationOption } from "@/hooks/users-hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function RccFormationCard() {
    const {
        getAllRccFormations,
        saveRccFormations,
        loading,
    } = useUsers();

    const navigate = useNavigate();

    const [formacoes, setFormacoes] = useState<RccFormationOption[]>([]);
    const [initialDateRcc, setInitialDateRcc] = useState("");
    const [formationIds, setFormationIds] = useState<number[]>([]);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadOptions() {
            setLoadingOptions(true);
            setOptionsError(null);

            try {
                const data = await getAllRccFormations();

                if (!active) return;

                setFormacoes(data.filter((formacao) => formacao.active));
            } catch (error) {
                if (!active) return;

                setOptionsError(
                    "Não foi possível carregar as formações. Tente novamente."
                );
            } finally {
                if (active) setLoadingOptions(false);
            }
        }

        loadOptions();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    const formacoesAtivas = useMemo(
        () => formacoes.filter((formacao) => formacao.active),
        [formacoes]
    );

    function toggleFormation(id: number) {
        setFormationIds((selecionadas) =>
            selecionadas.includes(id)
                ? selecionadas.filter((item) => item !== id)
                : [...selecionadas, id]
        );
    }

    async function submitFormationData(skip = false) {
        setSubmitError(null);

        try {
            const response = await saveRccFormations({
                initialDateRcc: skip ? null : initialDateRcc || null,
                formationIds: skip ? [] : formationIds,
            });

            console.log("Cadastro concluído:", response);

            toast("Cadastro concluído com sucesso!", {
                duration: 5000,
                icon: <CircleCheck className="text-white" />,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                    gap: "1rem",
                },
            });

            navigate("/user");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível concluir o cadastro.";

            setSubmitError(message);

            toast("Não foi possível concluir o cadastro.", {
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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitFormationData();
    }

    if (loadingOptions) {
        return (
            <Card className="mx-auto my-10 max-w-3xl">
                <CardContent className="flex items-center justify-center gap-3 py-12">
                    <LoaderCircle className="h-5 w-5 animate-spin text-green-600" />
                    <span>Carregando formações...</span>
                </CardContent>
            </Card>
        );
    }

    if (optionsError) {
        return (
            <Card className="mx-auto my-10 max-w-3xl">
                <CardContent className="space-y-4 py-8 text-center">
                    <p role="alert" className="text-sm text-red-600">
                        {optionsError}
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setReloadKey((previous) => previous + 1)}
                    >
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative mx-auto my-10 max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <CardHeader className="flex flex-col items-center text-center">
                <GraduationCap className="h-10 w-10 text-green-600" />

                <CardTitle className="text-3xl font-bold">
                    Formação na RCC
                </CardTitle>

                <CardDescription className="mt-2 text-sm text-gray-500">
                    Informe se você já participou de alguma formação da
                    Renovação Carismática Católica. Esta etapa é opcional e
                    você também pode concluir seu cadastro sem preenchê-la.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-7">
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold">
                                Início na RCC
                            </h3>
                        </div>

                        <p className="text-sm text-gray-500">
                            Informe a data em que você começou sua caminhada
                            na Renovação Carismática Católica, se desejar.
                        </p>

                        <Input
                            type="date"
                            value={initialDateRcc}
                            onChange={(event) =>
                                setInitialDateRcc(event.target.value)
                            }
                            className="w-full sm:max-w-xs"
                            aria-label="Data de início na RCC"
                        />
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold">
                                Formações realizadas
                            </h3>
                        </div>

                        <p className="text-sm text-gray-500">
                            Selecione as formações da RCC das quais você
                            já participou. Você pode selecionar mais de uma.
                        </p>

                        {formacoesAtivas.length === 0 ? (
                            <p className="rounded-md border p-4 text-center text-sm text-gray-500">
                                Nenhuma formação disponível no momento.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {formacoesAtivas.map((formacao) => {
                                    const checked = formationIds.includes(
                                        formacao.id
                                    );

                                    return (
                                        <label
                                            key={formacao.id}
                                            className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${checked
                                                    ? "border-green-600 bg-green-50"
                                                    : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleFormation(formacao.id)
                                                }
                                                className="mt-1 h-4 w-4 accent-green-600"
                                            />

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-medium">
                                                    {formacao.name}
                                                </span>

                                                {formacao.description && (
                                                    <span className="mt-1 block text-xs text-gray-500">
                                                        {formacao.description}
                                                    </span>
                                                )}
                                            </span>

                                            {checked && (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        <p className="text-xs text-gray-500">
                            {formationIds.length} formação(ões)
                            selecionada(s).
                        </p>
                    </section>

                    {submitError && (
                        <p role="alert" className="text-sm text-red-600">
                            {submitError}
                        </p>
                    )}

                    <div className="space-y-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Concluindo cadastro...
                                </>
                            ) : (
                                "Concluir cadastro"
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => submitFormationData(true)}
                            className="w-full cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Aguarde...
                                </>
                            ) : (
                                "Pular esta etapa"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
