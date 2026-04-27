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

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    // 1. Authenticate with backend
                    const response = await apiClient.post('/auth/login', { email, password });

                    // Your backend AuthResponse returns 'access_token'
                    const { access_token } = response.data;

                    // Store token immediately so subsequent interceptor calls work
                    localStorage.setItem('access_token', access_token);

                    // 2. Fetch actual user data from the protected profile endpoint
                    const profileResponse = await apiClient.get('/users/me');
                    const user = profileResponse.data;

                    set({ user, token: access_token, isLoading: false });
                    toast.success(`Welcome back, ${user.firstName || 'User'}!`);
                } catch (error: any) {
                    set({ isLoading: false });
                    const message = error.response?.data?.message || 'Invalid credentials';
                    toast.error(message);
                    throw error;
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