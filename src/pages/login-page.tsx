import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { login } from '@/api/auth.ts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { defaultAxios } from '@/config/api.ts';
import { queryClient } from '@/config/query-client.ts';
import {
  LoginRequestSchema,
  LoginRequestSchemaValues,
} from '@/schemas/common/login.ts';
import { useAuthStore } from '@/store/use-auth-store.tsx';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();
  
  const loginMutation = useMutation({
    mutationFn: login,
  });
  
  const form = useForm<LoginRequestSchemaValues>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      userId: 'userId',
      password: 'password',
    },
  });

  const handleLogin = form.handleSubmit((values) => {
    loginMutation.mutate(
      { ...values },
      {
        onSuccess: ({ accessToken }) => {
          setAccessToken(accessToken);
          defaultAxios.defaults.headers.Authorization = `Bearer ${accessToken}`;
          queryClient.clear();
          navigate('/');
        },
        onError: (error) => {
          console.error(error);
          toast.error(
            t('msg.login.fail', {
              defaultValue: '로그인 실패',
            }),
          );
        },
      },
    );
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleLogin} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button type="submit" variant="blue" className="w-full font-semibold">
                  Login
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;