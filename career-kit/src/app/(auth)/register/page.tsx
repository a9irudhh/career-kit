import React from 'react';
import { Card } from '@/components/ui/card';
import RegisterForm from '@/components/shared/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="p-6 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
                <RegisterForm />
            </Card>
        </div>
    );
};

export default RegisterPage;