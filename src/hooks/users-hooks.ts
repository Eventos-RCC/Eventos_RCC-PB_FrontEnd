
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

export interface AddressRequest {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressResponse extends AddressRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface GrupoOracaoOption {
  id: number;
  name: string;
  status?: string;
  emUnidade?: boolean;
}

export interface MinisterioOption {
  id: number;
  name: string;
  sigla: string;
}

export interface Onboarding3Request {
  grupoOracaoId: number;
  ministerioIds: number[];
}

export interface Onboarding3Response {
  id: number;
  name: string;
  email: string;
  onboardingStep: string;
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

  // Etapa 1.2: verifica o código e conclui o cadastro.
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

  // Etapa 1.3: solicita um novo código para o e-mail informado.
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

  const saveAddress = async (
    address: AddressRequest
  ): Promise<AddressResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<AddressResponse>(
        "/users/onboarding2",
        address
      );

      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Erro ao salvar endereço";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getGrupoOracaoOptions = async (): Promise<GrupoOracaoOption[]> => {
    const response = await api.get<GrupoOracaoOption[]>(
      "/grupoOracao/options"
    );

    return response.data;
  };

  const getAllMinisterios = async (): Promise<MinisterioOption[]> => {
    const response = await api.get<MinisterioOption[]>("/ministerios");

    return response.data;
  };

  const saveGroupAndMinisterios = async (
    data: Onboarding3Request
  ): Promise<Onboarding3Response> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<Onboarding3Response>(
        "/users/onboarding3",
        data
      );

      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Não foi possível concluir o cadastro";

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
    saveAddress,
    getGrupoOracaoOptions,
    getAllMinisterios,
    saveGroupAndMinisterios,
    getUsers,
    getUserById,
    loading,
    error,
    setError,
  };
};
