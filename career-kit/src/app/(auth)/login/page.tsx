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
        <div className="flex items-center justify-center h-screen bg-gray-100 p-3">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">
                    Welcome Back!
                </h2>
                <p className="text-md text-center text-gray-600">
                    Please login to access your account.
                </p>
                <LoginForm onSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

export default LoginPage;