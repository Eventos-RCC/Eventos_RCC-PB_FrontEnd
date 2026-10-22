import api from "@/apis/api"
import { useUsersStore } from "@/store/users-store"
import { UserType } from "@/types/User" 
import { useState } from "react"

export const useUsers = () => {
    
    const {
        users,
        setUsers,
        create,
        getUserById,
    } = useUsersStore()


const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const userLogin = async (user: {
    email: string;
    password: string;
}) => {
    setLoading(true)
    setError(null)

    try {
        const response = await api.post("/auth/login", {
            ...user,
        })
        return response.data // Retorna a resposta com o e-mail e mensagem
    } catch (err: any) {
        setError(err?.response?.data?.message || "Erro ao tentar logar")
        throw new Error("Erro ao tentar logar")
    } finally {
        setLoading(false)
    }
}

const createUser = async (user: {
    name: string;
    birthdate: string;
    diocese: string;
    phone: string;
    email: string;
    password: string;
}) => {
    setLoading(true)
    setError(null)

    try {
        const response = await api.post("/users/onboarding1", {
            ...user,
        })
        create(response.data)
        return response.data
    } catch (err) {
        setError("Erro ao criar usuário")
        throw new Error("Erro ao criar usuário")
    } finally {
        setLoading(false)
    }
}

const getUsers = async () => {
    setLoading(true)
    setError(null)
    try {
        const response = await api.get<UserType[]>("/users")
        setUsers(response.data)
    } catch (err) {
        setError("Erro ao buscar usuários")
    } finally {
        setLoading(false)
    }
}

return { 
    users, 
    createUser, 
    userLogin , 
    getUsers, 
    getUserById, 
    loading, 
    error, 
    setError 
}

}