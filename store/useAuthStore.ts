import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { apiClient } from '../services/apiClient';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,

            // services/useAuthStore.ts

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.post('/auth/login', { email, password });
                    const { token, user: userSummary } = response.data; // Backend returns 'token' and 'user' object

                    localStorage.setItem('access_token', token);

                    // FIX: Change '/users/me' to '/users/profile' to match your UserController.java
                    const profileResponse = await apiClient.get('/users/profile');
                    const user = profileResponse.data;

                    set({ user, token, isLoading: false });
                    toast.success(`Welcome back, ${user.firstName}!`);
                } catch (error: any) {
                    set({ isLoading: false });
                    // Handle the error specifically
                    const message = error.response?.status === 401 ? "Invalid email or password" : "Server error";
                    toast.error(message);
                }
            },

            logout: () => {
                set({ user: null, token: null });
                localStorage.removeItem('access_token');
                toast.success('Logged out successfully');
            },

            updateUser: (updates) => {
                set((state) => {
                    if (!state.user) return state;
                    return { user: { ...state.user, ...updates } };
                });
            }
        }),
        {
            name: 'auth_storage',
            // Only persist user data and token in storage
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);