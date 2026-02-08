import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react'
import { NotificationProvider } from 'components/providers/NotificationProvider'
import AZHeader from 'components/elements/AZHeader'
import Page404 from 'pages/_404/Page.js'
import './Styles.css';
import 'styles/buttons_and_links.css';
import { ALL_PAGES } from './Pages.js';

const App = () => {
  const [Page, setPage] = useState(null)

  useEffect(() => {
    const page = ALL_PAGES[window.location.pathname]

    if (!page) return

    import(`./pages/${page.path}/Page.js`).then(mod => {
      setPage(() => mod.default)

      document.title = `AZsSPC - ${page.title || window.location.pathname}`;
    })
  }, [])

  // handle hash AFTER page render
  useEffect(() => {
    if (!Page) return

    const { hash } = window.location
    if (!hash) return

    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView()
  }, [Page])

  return Page ? <Page /> : <Page404 />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
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