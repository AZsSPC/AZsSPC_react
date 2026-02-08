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
    '/projects/layout_translator/': {
        path: 'projects/layout_translator',
        title: 'Layout Translator',
        description: 'Insert mistyped russian or ukrainian text and receive the right version',
        tags: ['test', 'demo'],
        marks: ['wip']
    },

}

const ALL_PAGES = {
    ...PAGES,
    ...PROJECTS
}

export { PAGES, PROJECTS, ALL_PAGES }