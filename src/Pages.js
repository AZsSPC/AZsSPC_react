const PROJECTS = {
  '/layout_translator/': {
    load: () => import('./pages/projects/layout_translator/Page.js'),
    path: 'projects/layout_translator',
    title: 'Layout Translator',
    description: 'Corrects mistyped Russian or Ukrainian text caused by keyboard layout mismatch',
    tags: ['web', 'for all', 'translator', 'utility']
  },

  '/evo/': {
    load: () => import('./pages/projects/evo/Page.js'),
    path: 'projects/evo',
    title: 'Evo',
    description: 'A cellular evolution simulation running on a 2D grid environment',
    tags: ['web', 'for all', 'simulation', 'evolution']
  },

  '/evo2/': {
    load: () => import('./pages/projects/evo_pro/Page.js'),
    path: 'projects/evo_pro',
    title: 'Evo 2.0',
    description: 'An advanced evolutionary simulation featuring processor-driven cells in a hex world',
    tags: ['WIP', 'web', 'for all', 'simulation', 'evolution']
  }
}

const PAGES = {
  '/': {
    load: () => import('./pages/main/Page.js'),
    path: 'main',
    title: 'Main page',
    description: 'Overview of the site, including navigation, guides, and essential information',
    color: 'red'
  },

  '/contacts/': {
    load: () => import('./pages/contacts/Page.js'),
    path: 'contacts',
    title: 'Contacts',
    description: 'Available communication channels and preferred ways to reach the developer',
    color: 'gold'
  },

  '/about/': {
    load: () => import('./pages/about/Page.js'),
    path: 'about',
    title: 'About',
    description: 'Background information about the developer and the purpose of this site',
    color: 'blue'
  },

  '/projects/': {
    load: () => import('./pages/projects/Page.js'),
    path: 'projects',
    title: 'Projects',
    description: 'Collection of experimental tools, simulations, and programming projects',
    color: 'magenta',
    child: PROJECTS
  },

}

const ALL_PAGES = { ...PAGES, ...PROJECTS }
export { PAGES, PROJECTS, ALL_PAGES }