import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { checkDuplicateUserId, createMember } from '@/api/admin/member';
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
import { SignUpCreateSchema, SignUpCreateSchemaValues } from '@/schemas/common/signup';

type Props = {
  agreements: { service: boolean; privacy: boolean };
  tosId: string | undefined;
  topId: string | undefined;
};

export const SignUpForm = ({ 
  agreements,
  tosId,
  topId
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const form = useForm<SignUpCreateSchemaValues>({
    resolver: zodResolver(SignUpCreateSchema),
    defaultValues: {
      userId: '',
      password: '',
      confirmedPassword: '',
      koName: '',
      enName: '',
      email1: '',
      email2: '',
      phone1: '',
      phone2: '',
      phone3: '',
      isActive: false,
      termsAgreed: agreements,
    },
  });

  const isPassword = form.watch('password') && form.watch('confirmedPassword');
  const isMatch = form.watch('password') === form.watch('confirmedPassword');
  const [isUserIdChk, setIsUserIdChk] = useState<'valid' | 'invalid' | null>(null);
  const changeId = form.watch('userId');

  const createMemberMutation = useMutation({
    mutationFn: createMember,
  });
  
  const checkDuplicateMutation = useMutation({
    mutationFn: checkDuplicateUserId,
  });

  const handleSignUp = form.handleSubmit((values) => {
    const id = values.userId;
    const email = `${values.email1}@${values.email2}`;
    const phoneNumber = `${values.phone1}-${values.phone2}-${values.phone3}`;

    if (isUserIdChk !== 'valid') {
        toast.warning(
        t('msg.auth.check.userId', {
          defaultValue: '아이디 중복 확인을 진행해 주세요.',
        }),
      );
      return;
    }
    if (!isMatch) {
      toast.warning(
        t('msg.auth.check.password', {
          defaultValue: '비밀번호를 다시 확인해 주세요.',
        }),
      );
      return;
    }

    createMemberMutation.mutate(
      {...values, id, email, phoneNumber, tosId, topId},
      {
        onSuccess: () => {
          toast.success(
            t('msg.auth.register.success', { 
              defaultValue: '회원가입이 완료되었습니다.',
            }),
          );
          navigate('/login');
        },
        onError: (error) => {
          console.error('onError', error);
          toast.error(
            t('msg.auth.register.fail', {
              defaultValue: '회원가입에 실패했습니다.',
            }),
          );
        },
      },
    )
  });

  useEffect(() => {
    setIsUserIdChk(null);
  }, [changeId]);

  // ID 중복체크
  const handleCheck = async () => {
    const userId = form.getValues('userId');

    if (!userId) {
      toast.warning(
        t('msg.auth.input.userId', {
          defaultValue: '아이디를 먼저 입력해 주세요.',
        }),
      );
      return;
    }

    const userIdSchema = SignUpCreateSchema.shape.userId;
    const result = userIdSchema.safeParse(userId);

    if (!result.success) {
      toast.warning(result.error.errors[0].message);
      setIsUserIdChk(null);
      return;
    }

    checkDuplicateMutation.mutate( 
      userId,
      {
        onSuccess: (isDuplicate: boolean) => {
          if (!isDuplicate) {
            setIsUserIdChk('valid');
          } else {
            setIsUserIdChk('invalid');
          }
        },
        onError: (error) => {
          console.error('onError', error);
          toast.error(
            t('msg.auth.check.userId.fail', {
              defaultValue: '아이디 중복 확인에 실패했습니다.',
            }),
          );
          setIsUserIdChk('invalid');
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[35rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            {t('col.auth.signUp', { defaultValue: '회원가입' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSignUp} className="space-y-6">
            {/* ID */}
            <FormField
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('col.auth.userId', { defaultValue: '아이디' })}
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder={t('msg.auth.input.userId', { defaultValue: '아이디를 입력하세요' })} {...field} />
                    </FormControl>
                    <Button onClick={handleCheck} type="button" variant="outline" className="whitespace-nowrap">
                      {t('btn.duplicateCheck', { defaultValue: '중복 확인' })}
                    </Button>
                  </div>
                  {isUserIdChk === 'valid' && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {t('msg.auth.id.available', { defaultValue: '✔ 사용 가능한 아이디입니다.' })}
                    </p>
                  )}
                  {isUserIdChk === 'invalid' && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {t('msg.auth.id.unavailable', { defaultValue: '✘ 중복된 아이디입니다.' })}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('col.auth.password', { defaultValue: '비밀번호' })}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('msg.auth.input.password', { defaultValue: '비밀번호를 입력하세요.' })} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              name="confirmedPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('col.auth.passwordConfirm', { defaultValue: '비밀번호 확인' })}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('msg.auth.input.passwordConfirm', { defaultValue: 'Re-enter your password.' })} {...field} />
                  </FormControl>
                  {isPassword && (
                    <p className={`text-xs ${isMatch ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {isMatch
                        ? t('msg.auth.password.match', { defaultValue: '✔ 비밀번호가 동일합니다.' })
                        : t('msg.auth.password.mismatch', { defaultValue: '✘ 비밀번호가 동일하지 않습니다.' })}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ko Name */}
            <FormField
              name="koName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('col.auth.nameKo', { defaultValue: '이름 (한글)' })}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* En Name */}
            <FormField
              name="enName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('col.auth.nameEn', { defaultValue: '이름 (영문)' })}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Hong Gil Dong" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormItem>
              <FormLabel className="text-foreground">
                {t('col.auth.email', { defaultValue: '이메일' })}
              </FormLabel>
              <div className="flex items-center gap-2">
              <FormField
                name="email1"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="example" {...field} />
                  </FormControl>
                )}
              />
              <span className="text-muted-foreground">@</span>
              <FormField
                name="email2"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="domain.com" {...field} />
                  </FormControl>
                )}
              />
              </div>
            </FormItem>

            {/* Phone */}
            <FormItem>
              <FormLabel className="text-foreground">
                {t('col.auth.phone', { defaultValue: '휴대폰 번호' })}
              </FormLabel>
              <div className="flex items-center gap-2">
                <FormField
                  name="phone1"
                  render={({ field }) => (
                    <FormControl>
                      <Input maxLength={3} className="w-20" placeholder="010" {...field} />
                    </FormControl>
                  )}
                />
                <span className="text-muted-foreground">-</span>
                <FormField
                  name="phone2"
                  render={({ field }) => (
                    <FormControl>
                      <Input maxLength={4} className="w-24" placeholder="1234" {...field} />
                    </FormControl>
                  )}
                />
                <span className="text-muted-foreground">-</span>
                <FormField
                  name="phone3"
                  render={({ field }) => (
                    <FormControl>
                      <Input maxLength={4} className="w-24" placeholder="5678" {...field} />
                    </FormControl>
                  )}
                />
              </div>
            </FormItem>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                {t('btn.cancel', { defaultValue: '취소' })}
              </Button>
              <Button type="submit" variant="success" className="flex-1">
                {t('btn.signUp', { defaultValue: '회원가입' })}
              </Button>
            </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
