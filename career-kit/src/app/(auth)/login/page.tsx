"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/shared/LoginForm';

const LoginPage = () => {
    const router = useRouter();

    const handleLoginSuccess = () => {
        router.push('/dashboard');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <LoginForm onSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

export default LoginPage;