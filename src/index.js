import React from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/main_styles.css';
import 'styles/buttons_and_links.css';
import { useEffect, useState } from 'react'
import AZHeader from 'components/elements/AZHeader'
import Page404 from 'pages/_404/Page.js'
import { NotificationProvider } from 'components/providers/NotificationProvider'

const pages = {
  '/': () => import('./pages/Main/Page.js'),
}

const App = () => {
  const [Page, setPage] = useState(null)

  useEffect(() => {
    const path = window.location.pathname
    const loader = pages[path]

    if (!loader) return

    loader().then(mod => {
      setPage(() => mod.default)
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