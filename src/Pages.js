const PAGES = {
  '/': {
    load: () => import('./pages/main/Page.js'),
    title: 'Main page',
    color: 'red'
  },
  
  '/contacts/': {
    load: () => import('./pages/contacts/Page.js'),
    title: 'Contacts',
    color: 'green'
  },

  '/about/': {
    load: () => import('./pages/about/Page.js'),
    title: 'About',
    color: 'blue'
  },

  '/projects/': {
    load: () => import('./pages/projects/Page.js'),
    title: 'Projects',
    color: 'magenta'
  }
}

const PROJECTS = {
  '/layout_translator/': {
    load: () => import('./pages/projects/layout_translator/Page.js'),
    title: 'Layout Translator',
    description: 'Insert mistyped russian or ukrainian text and receive the right version',
    tags: ['web', 'for all', 'translator', 'utility']
  },

  '/evo/': {
    load: () => import('./pages/projects/evo/Page.js'),
    title: 'Evo',
    description: 'An evolutionary simulation of cells',
    tags: ['web', 'for all', 'simulation', 'evolution']
  },

  '/evo2/': {
    load: () => import('./pages/projects/evo_pro/Page.js'),
    title: 'Evo 2.0',
    description: 'An advanced evolutionary simulation of cells',
    tags: ['WIP', 'web', 'for all', 'simulation', 'evolution']
  }
}

const ALL_PAGES = { ...PAGES, ...PROJECTS }
export { PAGES, PROJECTS, ALL_PAGES }