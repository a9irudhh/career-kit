import React from 'react';
import { Card } from '@/components/ui/card';
import RegisterForm from '@/components/shared/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 p-3">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">
                    Welcome to Career-Kit!
                </h2>
                <p className="text-sm text-center text-gray-600">
                    Create your account to unlock all the features of Career-Kit and take the next step in your journey.
                </p>
                <RegisterForm />
            </div>
        </div>
    );

};

export default RegisterPage;