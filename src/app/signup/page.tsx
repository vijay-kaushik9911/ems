'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signUpWithEmail } from '@/firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react";



// import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
// import { AuthForm } from "@/components/auth/auth-form"

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  // useEffect(() => {
  //   toast({
  //     title: "Toast Test",
  //     description: "If you're seeing this, toasts are working 🎉",
  //   })
  // }, [])  

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
        if (error === "Firebase: Error (auth/email-already-in-use).") {
          toast({
            title: "Email already in use",
            description: "Please try logging in instead. ",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        // console.log("Signup error:", error);
        //   toast({
        //     title: "Email already in use",
        //     description: "Please try logging in instead.",
        //     variant: "destructive",
        //   });
        return;
      }

      router.push(`/${isEmployee ? 'employee' : 'lead'}/dashboard`);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to home</span>
                </Link>
              </Button>
            </div>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <AuthForm type="signup" /> */}
              <SignupForm onSubmit={handleSignup} />


            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* <GoogleSignInButton /> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm w-full">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
