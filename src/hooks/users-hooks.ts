
import api from "@/apis/api";
import { useUsersStore } from "@/store/users-store";
import { UserType } from "@/types/User";
import { useState } from "react";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  diocese: string;
}

interface OnboardingResponse {
  message: string;
  email: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshToken: string;
}

interface VerifyEmailResponse {
  message: string;
  email: string;
  id: number;
  auth: AuthResponse;
}

export const useUsers = () => {
  const {
    users,
    setUsers,
    getUserById,
  } = useUsersStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userLogin = async (user: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", user);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erro ao tentar logar";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Etapa 1: envia os dados iniciais e solicita o código por e-mail.
  const createUser = async (
    user: CreateUserData
  ): Promise<OnboardingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<OnboardingResponse>(
        "/users/onboarding1",
        user
      );

      // A resposta ainda não representa o usuário criado.
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erro ao criar usuário";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Etapa 2: verifica o código e conclui o cadastro.
  const verifyUserEmail = async (
    email: string,
    codeUser: string
  ): Promise<VerifyEmailResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<VerifyEmailResponse>(
        `/users/onboarding1/${encodeURIComponent(email)}/verify`,
        { codeUser }
      );

      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Erro ao verificar código de confirmação";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Etapa 3: solicita um novo código para o e-mail informado.
  const resendVerificationCode = async (
    email: string
  ): Promise<OnboardingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<OnboardingResponse>(
        `/users/onboarding1/${encodeURIComponent(email)}/resend-code`
      );

      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Erro ao reenviar código de confirmação";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<UserType[]>("/users");
      setUsers(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erro ao buscar usuários"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    createUser,
    userLogin,
    verifyUserEmail,
    resendVerificationCode,
    getUsers,
    getUserById,
    loading,
    error,
    setError,
  };
};
