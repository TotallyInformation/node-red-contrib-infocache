module.exports = {
    // See https://vuepress.vuejs.org/config/
    
    title: 'Documentation for node-red-contrib-infocache',
    description: 'Just playing around',
    
    base: '/node-red-contrib-infocache/',
    
    themeConfig: {
        // https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
        searchPlaceholder: 'Search h2/h3 text ...',
        lastUpdated: 'Updated', // string | boolean
        sidebar: [
            '/',
            '/design',
            '/node-configuration',
            '/input-messages',
            '/CHANGELOG',
            '/TODO',
            ['https://github.com/TotallyInformation/node-red-contrib-infocache', 'GitHub Code']
            //['/page-b', 'Explicit link text']
        ],

        // Assumes GitHub. Can also be a full GitLab url.
        repo: 'TotallyInformation/node-red-contrib-infocache',
        // Customising the header label
        // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
        //repoLabel: 'Contribute!',

        // Optional options for generating "Edit this page" link

        // if your docs are in a different repo from your main project:
        //docsRepo: 'vuejs/vuepress',
        // if your docs are not at the root of the repo:
        docsDir: 'docs',
        // if your docs are in a specific branch (defaults to 'master'):
        docsBranch: 'gh-pages',
        // defaults to false, set to true to enable
        editLinks: true,
        // custom text for edit link. Defaults to "Edit this page"
        //editLinkText: 'Edit this page!',
    },

    markdown: {
        // see https://www.npmjs.com/search?q=markdown-it
        // Already installed: anchors, toc, syntax (Prism), external, frontmatter, gh tables, emoji, custom containers
        lineNumbers: true,
        plugins: [
            'markdown-it-footnote',
            'markdown-it-task-lists'
            //'@org/foo', // equals to @org/markdown-it-foo if exists
            // ['markdown-it-bar', {
            //     // provide options here
            // }],
        ],
        extendMarkdown: md => {
            // use more markdown-it plugins!
            // Don't forget to `npm -D <name>` first.
            md.use(require('markdown-it-footnote'))
            md.use(require('markdown-it-task-lists'))
            //md.use(require('markdown-it-textual-uml') // https://www.npmjs.com/package/markdown-it-textual-uml
            //md.use(require('markdown-it-plantuml'), options)
            //md.use(require('markdown-it-sup'))
            //md.use(require('markdown-it-sub'))
            //md.use(require('@liradb2000/markdown-it-mermaid')) // https://github.com/liradb2000/markdown-it-mermaid
            //md.use(require('markdown-it-link-attributes'), {pattern: /^https:/, target: '_blank', rel: 'noopener', attrs: {class: 'my-class'}}) // https://www.npmjs.com/package/markdown-it-link-attributes
            //md.use(require('markdown-it-attrs')) // https://www.npmjs.com/package/markdown-it-attrs
        },
    },

    // plugins: [
    //     '@vuepress/back-to-top',
    // ],
  }