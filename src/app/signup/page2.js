'use client';
import SignupForm from '@/components/auth/SignupForm';
import { signUpWithEmail } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data, isEmployee) => {
    try {
      const { user, error } = await signUpWithEmail(
        data.email,
        data.password,
        {
          name: data.name,
          employeeId: data.empId,
          role: isEmployee ? 'employee' : 'lead'
        }
      );
      
      if (error) {
        console.error('Signup error:', error);
        return;
      }

      router.push(`/dashboard/${isEmployee ? 'employee' : 'lead'}`);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
}
