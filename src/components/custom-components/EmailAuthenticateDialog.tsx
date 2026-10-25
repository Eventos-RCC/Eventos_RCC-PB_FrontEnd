
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/users-hooks";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { MaskedInput } from "@/components/custom-components/MaskedInput";
import { maskVerificationCode } from "@/utils/masks";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EmailAuthenticateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailAuthenticateDialog({
  open,
  onOpenChange,
}: EmailAuthenticateDialogProps) {
  const [code, setCode] = useState("");
  const {
    loading,
    error,
    setError,
    verifyUserEmail,
    resendVerificationCode,
  } = useUsers();

  const navigate = useNavigate();

  const email = sessionStorage.getItem("emailToVerify");

  const handleConfirm = async () => {
    if (!email) {
      setError("E-mail não encontrado. Realize o cadastro novamente.");
      return;
    }

    if (!code.trim()) {
      setError("Informe o código recebido por e-mail.");
      return;
    }

    try {
      const response = await verifyUserEmail(email, code.trim());

      console.log("Cadastro confirmado:", response);

      const accessToken = response?.auth?.accessToken;
      const refreshToken = response?.auth?.refreshToken;

      if (!accessToken) {
        throw new Error(
          "O servidor não retornou o token de acesso. Verifique a resposta da API."
        );
      }

      // Armazena o token que será usado nas próximas requisições.
      sessionStorage.setItem("accessToken", accessToken);

      // Armazena o refresh token caso seja necessário renovar a sessão.
      if (refreshToken) {
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      sessionStorage.removeItem("emailToVerify");
      setCode("");
      onOpenChange(false);

      toast("E-mail verificado com sucesso!", {
        duration: 5000,
        icon: <CircleCheck className="text-white" />,
        style: {
          backgroundColor: "#16a34a",
          color: "white",
          gap: "1rem",
        },
      });

      navigate("/address");
    } catch (err: any) {
      setError(
        err?.message || "Erro ao verificar código de confirmação"
      );

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
  };

  const handleResend = async () => {
    if (!email) {
      setError("E-mail não encontrado. Informe um e-mail válido.");
      return;
    }

    try {
      const response = await resendVerificationCode(email);

      setCode("");
      setError(null);

      toast(response.message || "Código enviado para o e-mail!", {
        duration: 5000,
        icon: <CircleCheck className="text-white" />,
        style: {
          backgroundColor: "#16a34a",
          color: "white",
          gap: "1rem",
        },
      });
    } catch (err: any) {
      setError(err?.message || "Erro ao reenviar código.");

      toast("Não foi possível reenviar o código", {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[425px] overflow-hidden rounded-xl p-5 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Confirmação de e-mail
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed break-words">
            Enviamos um código para o seu e-mail. Digite-o abaixo para concluir
            o cadastro.

            {email && (
              <span className="mt-2 block font-medium text-foreground break-all">
                {email}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-3">
            <Label htmlFor="auth_code" className="text-sm font-medium">
              Código de confirmação
            </Label>

            <MaskedInput
              mask={maskVerificationCode}
              id="auth_code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              className="w-full min-w-0"
              autoComplete="one-time-code"
              inputMode="numeric"
              autoFocus
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm leading-relaxed text-red-500"
            >
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !code.trim()}
            className="order-1 w-full cursor-pointer bg-green-600 text-white hover:bg-green-700 sm:order-2 sm:w-auto sm:flex-1"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>

          <Button
            type="button"
            onClick={handleResend}
            variant="outline"
            disabled={loading}
            className="order-2 w-full cursor-pointer sm:order-1 sm:w-auto sm:flex-1"
          >
            Reenviar código
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}
