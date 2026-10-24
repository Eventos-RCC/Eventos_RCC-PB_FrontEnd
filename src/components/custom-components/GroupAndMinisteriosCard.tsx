
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Church,
    CircleCheck,
    CircleX,
    LoaderCircle,
    Search,
    Users,
} from "lucide-react";
import { toast } from "sonner";

import { useUsers } from "@/hooks/users-hooks";
import type {
    GrupoOracaoOption,
    MinisterioOption,
} from "@/hooks/users-hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function GroupAndMinisteriosCard() {
    const {
        getGrupoOracaoOptions,
        getAllMinisterios,
        saveGroupAndMinisterios,
        loading,
    } = useUsers();

    const navigate = useNavigate();

    const [grupos, setGrupos] = useState<GrupoOracaoOption[]>([]);
    const [ministerios, setMinisterios] = useState<MinisterioOption[]>([]);

    const [grupoOracaoId, setGrupoOracaoId] = useState("");
    const [ministerioIds, setMinisterioIds] = useState<number[]>([]);
    const [busca, setBusca] = useState("");

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadOptions() {
            setLoadingOptions(true);
            setOptionsError(null);

            try {
                const [gruposData, ministeriosData] = await Promise.all([
                    getGrupoOracaoOptions(),
                    getAllMinisterios(),
                ]);

                if (!active) return;

                setGrupos(gruposData);
                setMinisterios(ministeriosData);
            } catch (error) {
                if (!active) return;

                setOptionsError(
                    "Não foi possível carregar os grupos de oração e ministérios. Tente novamente."
                );
            } finally {
                if (active) setLoadingOptions(false);
            }
        }

        loadOptions();

        return () => {
            active = false;
        };
    }, []);

    const gruposFiltrados = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");

        if (!termo) return grupos;

        return grupos.filter((grupo) =>
            grupo.name.toLocaleLowerCase("pt-BR").includes(termo)
        );
    }, [grupos, busca]);

    function toggleMinisterio(id: number) {
        setMinisterioIds((selecionados) =>
            selecionados.includes(id)
                ? selecionados.filter((item) => item !== id)
                : [...selecionados, id]
        );
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitError(null);

        if (!grupoOracaoId) {
            setSubmitError("Selecione seu grupo de oração.");
            return;
        }

        if (ministerioIds.length === 0) {
            setSubmitError("Selecione pelo menos um ministério.");
            return;
        }

        try {
            const response = await saveGroupAndMinisterios({
                grupoOracaoId: Number(grupoOracaoId),
                ministerioIds,
            });

            console.log("Cadastro concluído:", response);

            toast("E-mail verificado e usuário cadastrado com sucesso!", {
                duration: 5000,
                icon: <CircleCheck className="text-white" />,
                style: {
                    backgroundColor: "#16a34a",
                    color: "white",
                    gap: "1rem",
                },
            });

            // Ajuste este destino para a página inicial autenticada do seu projeto.
            navigate("/user");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível concluir o cadastro.";

            setSubmitError(message);
            toast("Não foi possível verificar o código", {
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

    if (loadingOptions) {
        return (
            <Card className="mx-auto my-10 max-w-3xl">
                <CardContent className="flex items-center justify-center gap-3 py-12">
                    <LoaderCircle className="h-5 w-5 animate-spin text-green-600" />
                    <span>Carregando grupos e ministérios...</span>
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
                        onClick={() => window.location.reload()}
                    >
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative mx-auto my-10 max-w-3xl rounded-lg bg-white shadow-lg p-6">
            <CardHeader className="flex flex-col items-center text-center">
                <Church className="h-10 w-10 text-green-600" />

                <CardTitle className="text-3xl font-bold">
                    Grupo de Oração e Ministérios
                </CardTitle>

                <CardDescription className="mt-2 text-sm text-gray-500">
                    Selecione seu grupo de oração e os ministérios dos quais participa
                    para concluir seu cadastro.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-7">
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Church className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold">Grupo de Oração</h3>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                value={busca}
                                onChange={(event) => setBusca(event.target.value)}
                                placeholder="Buscar grupo pelo nome..."
                                className="pl-9"
                                aria-label="Buscar grupo de oração"
                            />
                        </div>

                        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
                            {gruposFiltrados.length === 0 ? (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Nenhum grupo encontrado.
                                </p>
                            ) : (
                                gruposFiltrados.map((grupo) => (
                                    <label
                                        key={grupo.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${grupoOracaoId === String(grupo.id)
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="grupoOracao"
                                            value={grupo.id}
                                            checked={grupoOracaoId === String(grupo.id)}
                                            onChange={() => setGrupoOracaoId(String(grupo.id))}
                                            className="h-4 w-4 accent-green-600"
                                        />

                                        <span className="flex-1 font-medium">{grupo.name}</span>

                                        {grupo.emUnidade && (
                                            <span className="text-xs text-gray-500">
                                                Em unidade
                                            </span>
                                        )}
                                    </label>
                                ))
                            )}
                        </div>

                        <p className="text-xs text-gray-500">
                            {grupos.length} grupo(s) disponível(is).
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold">Ministérios</h3>
                        </div>

                        <p className="text-sm text-gray-500">
                            Selecione todos os ministérios dos quais você participa.
                        </p>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {ministerios.map((ministerio) => {
                                const checked = ministerioIds.includes(ministerio.id);

                                return (
                                    <label
                                        key={ministerio.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${checked
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleMinisterio(ministerio.id)}
                                            className="h-4 w-4 accent-green-600"
                                        />

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium">
                                                {ministerio.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {ministerio.sigla}
                                            </span>
                                        </span>

                                        {checked && (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        <p className="text-xs text-gray-500">
                            {ministerioIds.length} ministério(s) selecionado(s).
                        </p>
                    </section>

                    {submitError && (
                        <p role="alert" className="text-sm text-red-600">
                            {submitError}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || ministerios.length === 0 || grupos.length === 0}
                        className="w-full bg-green-600 text-white hover:bg-green-700"
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
                </form>
            </CardContent>
        </Card>
    );
}
