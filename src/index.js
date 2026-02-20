import React from 'react'
import ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'

import { NotificationProvider } from 'providers/NotificationProvider'
import AZHeader from 'components/elements/AZHeader'
import Page404 from 'pages/_404/Page.js'

import './Styles.css'
import './AZBasicElements.css'

import { ALL_PAGES } from './Pages'


export function navigate(url) {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  const [path, hash] = url.split('#');

  /* ---------- HASH ONLY NAVIGATION ---------- */
  if ((path === '' || path === currentPath) && hash !== undefined) {
    // same page → let browser handle scrolling logic
    if ('#' + hash === currentHash) return;

    window.location.hash = hash;
    return;
  }

  /* ---------- FULL SPA NAVIGATION ---------- */
  if (currentPath + currentHash === url) return;

  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}


const App = () => {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [Page, setPage] = useState(null)

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const page = ALL_PAGES[pathname];

    async function loadPage() {
      if (!page) {
        setPage(() => Page404);
        document.title = 'AZsSPC - 404';
      } else {
        const mod = await page.load();
        if (cancelled) return;

        setPage(() => mod.default);
        document.title = `AZsSPC - ${page.title || pathname}`;
      }

      requestAnimationFrame(() => {
        if (cancelled) return;

        const { hash } = window.location;

        if (hash) {
          const el = document.getElementById(hash.slice(1));
          if (el) {
            el.scrollIntoView({ block: 'start' });
            return;
          }
        }

        window.scrollTo(0, 0);
      });
    }

    loadPage();

    return () => { cancelled = true; };
  }, [pathname]);

  //id={`page-${pathname.toLowerCase().replace(/\W+/,'-')}`}
  return Page ? <Page /> : <Page404 />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('index');
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AZHeader />
      <App />
    </NotificationProvider>
  </React.StrictMode>
);
