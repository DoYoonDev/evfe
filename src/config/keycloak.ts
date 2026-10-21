import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

// 초기화가 중복 실행되지 않도록 결과를 보관합니다.
let initialization: Promise<boolean> | undefined;

export function initializeKeycloak(): Promise<boolean> {
  if (!initialization) {
    initialization = keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: window.location.origin + '/',
    });
  }

  return initialization;
}

// 유효한 액세스 토큰으로 백엔드 API를 호출합니다.
export async function fetchWithSso(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!keycloak.authenticated) {
    throw new Error('SSO 로그인이 필요합니다.');
  }

  // 토큰 만료까지 30초 미만이면 갱신합니다.
  await keycloak.updateToken(30);

  if (!keycloak.token) {
    throw new Error('SSO 액세스 토큰을 가져오지 못했습니다.');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${keycloak.token}`);

  return fetch(path, {
    ...options,
    headers,
  });
}