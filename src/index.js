import React from 'react'
import ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'

import { NotificationProvider } from 'providers/NotificationProvider'
import AZHeader from 'components/elements/AZHeader'
import Page404 from 'pages/_404/Page.js'

import './Styles.css'
import './AZBasicElements.css'

import { ALL_PAGES } from './Pages'


export function navigate(path) {
  if (window.location.pathname === path) return
  console.log('>>>', path)

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
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
    let cancelled = false;

    const page = ALL_PAGES[pathname];

    if (!page) {
      setPage(() => Page404)
      document.title = 'AZsSPC - 404';
      return;
    }

    page.load().then(mod => {
      if (cancelled) return;

      setPage(() => mod.default);
      document.title = `AZsSPC - ${page.title || pathname}`;
    })

    return () => {
      cancelled = true;
    }
  }, [pathname]);


  useEffect(() => {
    if (!Page) return;

    const { hash } = window.location;
    if (!hash) return;

    requestAnimationFrame(() => {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    });
  }, [Page]);


  return Page ? <Page /> : <Page404 />
}

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('index');
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AZHeader />
      <main>
        <App />
      </main>
    </NotificationProvider>
  </React.StrictMode>
);
