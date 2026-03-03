import './Styles.css';
import AZLink from '../../components/elements/AZLink';
import AZSpan from '../../components/elements/AZSpan';
import AZButton from '../../components/elements/AZButton';
import AZButtonCopy from '../../components/elements/AZButtonCopy';
import { PAGES } from '../../Pages.js';

function Page() {

    const pathname =
        'https://github.com/AZsSPC/AZsSPC_react/blob/main/src/pages' +
        window.location.pathname;

    function recursiveRender(dictionary) {
        return (<ul>{Object.keys(dictionary).map(page => (<li key={page}>
            <div>
                <AZLink color={dictionary[page].color} href={page}>{dictionary[page].title}</AZLink>
                <span className='page-path'>{page}</span>
            </div>

            <span className='page-description'>
                {dictionary[page].description}
            </span>

            {dictionary[page]?.child && recursiveRender(dictionary[page].child)}
        </li>))}</ul>);
    }

    return (<main className='page_about'>
        <section>
            <h2>About</h2>

            <p>
                You can call me <AZSpan color="gold">AZ</AZSpan>.
                I’m an independent developer focused on building
                experimental software and exploring programming
                ideas through practical implementation.
            </p>

            <p>
                My work mainly revolves around{' '}
                <AZSpan color="blue">web tools</AZSpan>,{' '}
                <AZSpan color="magenta">simulations</AZSpan>{' '}
                and technical experiments designed to test
                mechanics, architectures and implementation strategies.
            </p>
        </section>

        <section>
            <h2>This website</h2>

            <p>
                This site is both a portfolio and a development sandbox.
                Projects are published as they evolve rather than only
                after completion.
            </p>

            <p>
                Some pages contain finished tools, while others document
                experiments or intermediate research results.
                The platform itself is part of the experiment and
                changes alongside the projects hosted here.
            </p>

            <p>
                The website is still in{' '}
                <AZSpan color="blue">active development</AZSpan>,
                so certain features may behave inconsistently.
            </p>
        </section>

        <section>
            <h2>Development approach</h2>

            <p>
                I prefer learning through implementation —
                building systems, testing edge cases and refining
                ideas iteratively instead of designing everything
                theoretically beforehand.
            </p>

            <p>
                Many projects begin as small technical curiosities
                and gradually evolve into larger systems.
            </p>
        </section>

        <section>
            <h2>Interface elements</h2>

            <p>
                The site uses several reusable elements:
                {' '}<AZLink color="purple" href="#">anchor link</AZLink>,
                {' '}<AZLink color="red" href="/">internal link</AZLink>,
                {' '}<AZLink color="blue" href="https://google.com">external link</AZLink>,
                {' '}<AZButton color="green">button</AZButton>
                {' '}and{' '}
                <AZButtonCopy color="gray">
                    copy button
                </AZButtonCopy>.
            </p>

            <p>
                Color accents help distinguish interaction types
                and navigation intent across the interface.
            </p>
        </section>

        <section>
            <h2>Header navigation</h2>

            <p>
                <AZLink color='red' href='/' pure>main</AZLink>
                {' '}returns to the landing page.
            </p>

            <p>
                <AZLink color='green' href='#pages' pure>pages</AZLink>
                {' '}opens the complete list of site sections.
            </p>

            <p>
                <AZLink color='blue' href={pathname} pure>code</AZLink>
                {' '}links to the source code of the current page on GitHub.
            </p>

            <p>
                The{' '}
                <AZButton color='gold'>info</AZButton>{' '}
                button displays contextual information,
                while{' '}
                <AZButtonCopy color='gray'>
                    AZsSPC/current/path/
                </AZButtonCopy>
                {' '}copies the page URL.
            </p>
        </section>

        <section id='pages'>
            <h2>Pages</h2>
            {recursiveRender(PAGES)}
        </section>
    </main>);
}

export default Page;