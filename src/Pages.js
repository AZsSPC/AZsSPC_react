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
    '/projects/test': {
        path: 'projects/test',
        title: 'Test projsdsdect',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo'],
        marks: ['wip']
    },
    '/projects/test1': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
    '/projects/test2': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
    '/projects/tes3t': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
    '/projects/test4': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
    '/projects/test5': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
    '/projects/test6': {
        path: 'projects/test',
        title: 'Test project',
        description: 'This is a test project used to demonstrate the project page layout. It has no actual content.',
        tags: ['test', 'demo']
    },
}

const ALL_PAGES = {
    ...PAGES,
    ...PROJECTS
}

export { PAGES, PROJECTS, ALL_PAGES }