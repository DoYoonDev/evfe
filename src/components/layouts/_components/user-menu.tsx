import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { useAuthStore } from '@/store/use-auth-store.tsx';

export const UserMenu = () => {
  const { t } = useTranslation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { userId, logout } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  if (!accessToken) return null;

  const handleLogout = async () => {
    await logout();
    qc.clear?.();
    navigate('/login', { replace: true });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("menu.user", { defaultValue: "사용자" })}
        </DropdownMenuLabel>
        <div className="px-2 pb-1.5 text-sm text-muted-foreground break-all">
          {userId ?? "-"}
        </div>

        <DropdownMenuSeparator />

        {userId ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/user/profile" className="w-full cursor-pointer">
                  {t("menu.user.profile", { defaultValue: "사용자 프로필" })}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/user/pw-edit" className="w-full cursor-pointer">
                  {t("menu.user.pwEdit", { defaultValue: "패스워드 변경" })}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              {t("menu.user.logout", { defaultValue: "로그아웃" })}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/login" className="w-full cursor-pointer">
              {t("menu.user.login", { defaultValue: "로그인" })}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}