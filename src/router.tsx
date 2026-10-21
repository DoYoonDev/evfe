import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth, RequireMenuAccess } from '@/components/boundary';
import { AppLayout, DefaultLayout, LightOnly } from '@/components/layouts';

const ErrorPage = lazy(() => import('@/pages/error/error-page'));

const CodePage = lazy(() => import('@/pages/code/code-page'));
const CodeNewPage = lazy(() => import('@/pages/code/code-new-page'));
const CodeDetailPage = lazy(() => import('@/pages/code/code-detail-page'));
const CodeEditPage = lazy(() => import('@/pages/code/code-edit-page'));
const CodeGroupNewPage = lazy(() => import('@/pages/code/code-group-new-page'));
const CodeGroupDetailPage = lazy(() => import('@/pages/code/code-group-detail-page'));
const CodeGroupEditPage = lazy(() => import('@/pages/code/code-group-edit-page'));

const MessagePage = lazy(() => import('@/pages/message/message-page'));
const MessageNewPage = lazy(() => import('@/pages/message/message-new-page'));
const MessageDetailPage = lazy(() => import('@/pages/message/message-detail-page'));
const MessageEditPage = lazy(() => import('@/pages/message/message-edit-page'));

const MenuPage = lazy(() => import('@/pages/menu/menu-page'));

const RolePage = lazy(() => import('@/pages/role/role-page'));
const RoleMemberPage = lazy(() => import('@/pages/role/role-member-page'));
const RoleMenuPage = lazy(() => import('@/pages/role/role-menu-page'));

const MemberPage = lazy(() => import('@/pages/member/member-page'));
const MemberDetailPage = lazy(() => import('@/pages/member/member-detail-page'));
const MemberEditPage = lazy(() => import('@/pages/member/member-edit-page'));

const BoardPage = lazy(() => import('@/pages/board/board-page'));
const BoardDetailPage = lazy(() => import('@/pages/board/board-detail-page'));
const BoardEditPage = lazy(() => import('@/pages/board/board-edit-page'));
const BoardCreatePage = lazy(() => import('@/pages/board/board-create-page'));

const LogAccessPage = lazy(() => import('@/pages/log/log-access-page'));
const LogLoginPage = lazy(() => import('@/pages/log/log-login-page'));

const HomePage = lazy(() => import('@/pages/home-page'));
const LoginPage = lazy(() => import('@/pages/login-page'));
const SignUpPage = lazy(() => import('@/pages/signup/signup-page'));
const UserInfoPage = lazy(() => import('@/pages/user/user-info-page'));
const UserInfoEditPage = lazy(() => import('@/pages/user/user-info-edit-page'));
const UserPwEditPage = lazy(() => import('@/pages/user/user-pw-edit-page'));

export const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route element={<DefaultLayout isShowBreadcrumb={false} />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* 공통 레이아웃 */}
        <Route element={<RequireAuth />}>
          <Route element={<DefaultLayout />}>
            <Route element={<RequireMenuAccess />}>
              {/* 배포관리 */}
              <Route path="rlse">
                <Route path="master" element={<div>배포관리 (/rlse/master)</div>} />
                <Route path="01/01" element={<div>배포관리 (/rlse/master/01/01)</div>} />
              </Route>

              {/* 기준정보관리 */}
              <Route path="master">
                <Route path="01">
                  <Route path="01" element={<div>기준정보관리 (/master/01/01)</div>} />
                  <Route path="02" element={<div>기준정보관리 (/master/01/02)</div>} />
                </Route>
              </Route>

              {/* 결재 관리 */}
              <Route path="approve">
                <Route path="01" element={<div>결재 관리 (/approve/01)</div>} />
              </Route>

              {/* 시스템관리 */}
              <Route path="system">
                {/* 코드관리 */}
                <Route path="code">
                  <Route index element={<CodePage />} />
                  <Route path="new" element={<CodeNewPage />} />
                  <Route path=":id" element={<CodeDetailPage />} />
                  <Route path=":id/edit" element={<CodeEditPage />} />
                  <Route path="code-group">
                    <Route path="new" element={<CodeGroupNewPage />} />
                    <Route path=":id" element={<CodeGroupDetailPage />} />
                    <Route path=":id/edit" element={<CodeGroupEditPage />} />
                  </Route>
                </Route>

                {/* 메시지관리 */}
                <Route path="message">
                  <Route index element={<MessagePage />} />
                  <Route path="new" element={<MessageNewPage />} />
                  <Route path=":id" element={<MessageDetailPage />} />
                  <Route path=":id/edit" element={<MessageEditPage />} />
                </Route>

                {/* 메뉴관리 */}
                <Route path="menu">
                  <Route index element={<MenuPage />} />
                </Route>

                {/* 권한관리 */}
                <Route path="role">
                  <Route index element={<RolePage />} />
                  <Route path="member" element={<RoleMemberPage />} />
                  <Route path="menu" element={<RoleMenuPage />} />
                </Route>

                {/* 로그관리 */}
                <Route path="log">
                  <Route index element={<Navigate to="access" replace />} />
                  <Route path="access" element={<LogAccessPage />} />
                  <Route path="login" element={<LogLoginPage />} />
                </Route>

                {/* 사용자관리 */}
                <Route path="members">
                  <Route index element={<MemberPage />} />
                  <Route path=":id" element={<MemberDetailPage />} />
                  <Route path=":id/edit" element={<MemberEditPage />} />
                </Route>
              </Route>

              {/* 통계 */}
              <Route path="report">
                <Route path="01" element={<div>통계 (/report/01)</div>} />
              </Route>

              {/* 사용자 */}
              <Route path="user">
                <Route path="profile" element={<UserInfoPage />} />
                <Route path="edit" element={<UserInfoEditPage />} />
                <Route path="pw-edit" element={<UserPwEditPage />} />
              </Route>

              {/* 공지사항 */}
              <Route path="board">
                <Route index element={<BoardPage />} />
                <Route path=":id" element={<BoardDetailPage />} />
                <Route path=":id/edit" element={<BoardEditPage />} />
                <Route path="create" element={<BoardCreatePage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* 로그인/회원가입 */}
      <Route path="/login" element={<LightOnly><LoginPage /></LightOnly>} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* error */}
      <Route path="/error/:code" element={<ErrorPage />} />
      {/* 404 */}
      <Route path="*" element={<Navigate to="/error/404" replace />} />

    </Routes>
  );
};
