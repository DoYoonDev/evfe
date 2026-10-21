// import '@/styles/global.css';
// import 'react-complex-tree/lib/style-modern.css';

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';

// import { App } from '@/app.tsx';

// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }

//   //const { worker } = await import('./mocks/browser');

//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and ready to intercept requests.
//   //return worker.start();
// }

// const root = createRoot(document.getElementById('root')!);

// enableMocking().then(() => {
//   root.render(
//     <BrowserRouter>
//       <StrictMode>
//         <App />
//       </StrictMode>
//     </BrowserRouter>,
//   );
// });

import '@/styles/global.css';
import 'react-complex-tree/lib/style-modern.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

const container = document.getElementById('root');

if (!container) {
  throw new Error('root 요소를 찾을 수 없습니다.');
}

const root = createRoot(container);

async function bootstrap() {
  if (import.meta.env.VITE_SSO_ENABLED === 'true') {
    const { initializeKeycloak } = await import('@/config/keycloak');

    const authenticated = await initializeKeycloak();

    if (!authenticated) {
      return;
    }

    const { SsoPracticeApp } = await import('@/sso/SsoPracticeApp');

    root.render(
      <StrictMode>
        <SsoPracticeApp />
      </StrictMode>,
    );

    return;
  }

  const { App } = await import('@/app.tsx');

  root.render(
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>,
  );
}

bootstrap().catch((cause: unknown) => {
  console.error('서비스 시작에 실패했습니다.', cause);

  root.render(
    <main style={{ padding: 24 }}>
      <h1>서비스 시작 실패</h1>
      <p>
        인증 서버 실행 상태와 SSO 설정을 확인해 주세요.
        자세한 내용은 브라우저 개발자 도구의 Console에서 확인할 수 있습니다.
      </p>
    </main>,
  );
});