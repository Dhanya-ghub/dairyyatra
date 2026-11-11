import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const AdminPortal = lazy(() => import('./components/admin/Adminportal'))

// Pages of the site. Anything not listed is the home page.
const PAGES = { '/programme': 'programme', '/programme/fee': 'fee' }
const pageFor = (pathname) => PAGES[pathname.replace(/\/+$/, '')] || 'home'

/* Moving between the site's pages without reloading:
   clicks on links inside the site (e.g. /programme, /#overview) only change the address and the page shown. */
function Site() {
  const [page, setPage] = useState(() => pageFor(window.location.pathname))

  useEffect(() => {
    const show = () => {
      setPage(pageFor(window.location.pathname))
      // after the new page has drawn, go to the section in the address (/#overview) or to the top
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const hash = window.location.hash
          const target = hash && hash !== '#apply' ? document.querySelector(hash) : null
          if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
          else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        })
      )
    }

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith('/admin') || /\.[a-z0-9]+$/i.test(url.pathname)) return // admin and files load normally
      const samePage = pageFor(url.pathname) === pageFor(window.location.pathname)
      if (samePage && url.hash) return // a section on this page: let the browser scroll to it
      e.preventDefault()
      window.history.pushState({}, '', url.pathname + url.search + url.hash)
      show()
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', show)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', show)
    }
  }, [])

  return <App page={page} />
}

const isAdminRoute = window.location.pathname.startsWith('/admin')

// Opening (or refreshing) the site always starts on the front page, at the top, right after the intro video,
// even if the address still has a section in it from earlier browsing (e.g. /#overview).
// Section links clicked inside the site still jump to their section as before. (#apply still opens the form.)
if (!isAdminRoute && pageFor(window.location.pathname) === 'home') {
  const { hash } = window.location
  if (hash && hash !== '#apply') window.history.replaceState(null, '', '/')
}
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <AdminPortal />
      </Suspense>
    ) : (
      <Site />
    )}
  </React.StrictMode>,
)
