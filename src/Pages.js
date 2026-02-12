/*
  IMPORTANT: each page key must start and end with a slash, for example: '/projects/' or '/projects/layout_translator/'
*/

const PAGES = {
    '/': {
        path: 'main',
        title: 'Main page',
        color: 'red'
    },
    '/projects/': {
        path: 'projects',
        title: 'Projects',
        color: 'magenta'
    }
}

const PROJECTS = {
    '/layout_translator/': {
        path: 'projects/layout_translator',
        title: 'Layout Translator',
        description: 'Insert mistyped russian or ukrainian text and receive the right version',
        tags: ['web', 'for all', 'translator', 'utility']
    },
    '/evo/': {
        path: 'projects/evo',
        title: 'Evo',
        description: 'An evolutionary simulation of cells',
        tags: ['web', 'for all', 'simulation', 'evolution']
    },
    '/evo2/': {
        path: 'projects/evo_pro',
        title: 'Evo 2.0',
        description: 'An advanced evolutionary simulation of cells',
        tags: ['web', 'for all', 'simulation', 'evolution']
    },

}

const ALL_PAGES = {
    ...PAGES,
    ...PROJECTS
}

export { PAGES, PROJECTS, ALL_PAGES }