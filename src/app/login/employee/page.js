'use client';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import { loginWithEmail } from '@/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeLogin() {
  const router = useRouter();

  const handleEmailLogin = async ({ email, password }) => {
    try {
      const { user, error } = await loginWithEmail(email, password);
      if (error) {
        console.error('Login error:', error);
        // Handle error (show toast/notification)
      } else {
        router.push('/employee/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm onSubmit={handleEmailLogin} type="employee" />
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleButton type="employee" />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
