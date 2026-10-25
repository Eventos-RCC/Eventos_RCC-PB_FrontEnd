
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmação de e-mail</DialogTitle>
          <DialogDescription>
            Enviamos um código para o seu e-mail. Digite-o abaixo
            para concluir o cadastro.
            {email && (
              <span className="mt-2 block font-medium">
                {email}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auth_code" className="text-right">
              Código
            </Label>

            <MaskedInput
              mask={maskVerificationCode}
              id="auth_code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              className="col-span-3"
              autoComplete="one-time-code"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={loading || !code.trim()}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>

          <Button
            onClick={handleResend}
            variant="outline"
            disabled={loading}
          >
            Reenviar código
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
