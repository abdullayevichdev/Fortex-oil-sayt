import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    phone: string;
    password?: string; // In real app, never store plain text
    garage: Car[];
    points: number;
}

interface Car {
    id: string;
    brand: string;
    model: string;
    year: string;
    vin?: string;
}

interface AuthContextType {
    user: User | null;
    login: (phone: string, password: string) => boolean;
    register: (name: string, phone: string, password: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('fortex_current_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const login = (phone: string, password: string) => {
        const usersStr = localStorage.getItem('fortex_users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];
        const found = users.find(u => u.phone === phone && u.password === password);

        if (found) {
            setUser(found);
            localStorage.setItem('fortex_current_user', JSON.stringify(found));
            return true;
        }
        return false;
    };

    const register = (name: string, phone: string, password: string) => {
        const usersStr = localStorage.getItem('fortex_users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.find(u => u.phone === phone)) {
            alert("Bu raqam ro'yxatdan o'tgan");
            return;
        }

        const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            phone,
            password,
            garage: [],
            points: 0
        };

        users.push(newUser);
        localStorage.setItem('fortex_users', JSON.stringify(users));

        // Auto login
        setUser(newUser);
        localStorage.setItem('fortex_current_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fortex_current_user');
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('fortex_current_user', JSON.stringify(updatedUser));

        // Update in main db
        const usersStr = localStorage.getItem('fortex_users');
        if (usersStr) {
            const users: User[] = JSON.parse(usersStr);
            const idx = users.findIndex(u => u.id === updatedUser.id);
            if (idx >= 0) {
                users[idx] = updatedUser;
                localStorage.setItem('fortex_users', JSON.stringify(users));
            }
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
