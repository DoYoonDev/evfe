import { useState } from 'react';
import { fetchWithSso, keycloak } from '@/config/keycloak';

type SsoUser = {
  subject: string;
  username: string;
  issuer: string;
};

export function SsoPracticeApp() {
  const [user, setUser] = useState<SsoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkAuthentication() {
    setLoading(true);
    setError('');
    setUser(null);

    try {
      const response = await fetchWithSso('/api/sso/me');

      if (!response.ok) {
        throw new Error(
          `백엔드 인증 확인 실패: HTTP ${response.status}`,
        );
      }

      const data: SsoUser = await response.json();
      setUser(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : '인증 확인 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setError('');

    try {
      await keycloak.logout({
        redirectUri: window.location.origin + '/',
      });
    } catch {
      setError('로그아웃 요청에 실패했습니다.');
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '60px auto',
        padding: 24,
        lineHeight: 1.8,
      }}
    >
      <h1>SSO 인증 실습</h1>

      <p>
        Keycloak 로그인 사용자:{' '}
        <strong>
          {keycloak.tokenParsed?.preferred_username ?? '확인되지 않음'}
        </strong>
      </p>

      <p>
        아래 버튼을 누르면 Keycloak 토큰을 백엔드에 전달하고,
        백엔드의 검증 결과를 확인합니다.
      </p>

      <div style={{ display: 'flex', gap: 16, margin: '24px 0' }}>
        <button
          type="button"
          disabled={loading}
          onClick={checkAuthentication}
        >
          {loading ? '확인 중…' : '백엔드 인증 확인'}
        </button>

        <button type="button" onClick={logout}>
          Keycloak 로그아웃
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {user && (
        <section>
          <h2>백엔드 토큰 검증 성공</h2>
          <dl>
            <dt>사용자 이름</dt>
            <dd>{user.username}</dd>

            <dt>사용자 고유 ID</dt>
            <dd>{user.subject}</dd>

            <dt>토큰 발급자</dt>
            <dd>{user.issuer}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}