import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { EmployeeLoginForm } from "@/components/auth/employee-login-form"
// import { LeadLoginForm } from "@/components/auth/lead-login-form"
import AuthForm from '@/components/auth/AuthForm';
import { loginWithEmail } from '@/firebase/auth';
import { useRouter } from 'next/navigation';



export default function HomePage() {
  const router = useRouter();
  
  const handleEmployeeLogin = async ({ email, password }) => {
    const { user, error } = await loginWithEmail(email, password);
    if (error) {
      console.error('Login error:', error);
      // Handle error (show toast/notification)
    } else {
      // Redirect to lead dashboard
      router.push('/employee/dashboard');
    }
  };    

  const handleLeadLogin = async ({ email, password }) => {
    const { user, error } = await loginWithEmail(email, password);
    if (error) {
      console.error('Login error:', error);
      // Handle error (show toast/notification)
    } else {
      // Redirect to lead dashboard
      router.push('/lead/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Task Management System</h1>
        <p className="text-muted-foreground">Sign in to access your dashboard</p>
      </div>
      <div className="mx-auto mt-8 w-full max-w-md">
        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee">Employee</TabsTrigger>
            <TabsTrigger value="lead">Team Lead</TabsTrigger>
          </TabsList>
          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>Enter your credentials to access your tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AuthForm onSubmit={handleEmployeeLogin} type="employee" />
                
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm w-full">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="lead">
            <Card>
              <CardHeader>
                <CardTitle>Team Lead Login</CardTitle>
                <CardDescription>Enter your credentials to manage your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AuthForm onSubmit={handleLeadLogin} type="lead" />

              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm w-full">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
