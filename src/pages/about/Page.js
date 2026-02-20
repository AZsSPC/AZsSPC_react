import AZLink from '../../components/elements/AZLink'
import AZSpan from '../../components/elements/AZSpan'
import './Styles.css'

function Page() {
    return (<main className='page_about'>
        <section>
            <h2>About</h2>

            <p>
                You can call me <AZSpan color="gold">AZ</AZSpan>.
                I’m an independent developer focused on building
                experimental software and exploring programming ideas
                through practical implementation.
            </p>

            <p>
                My work mainly revolves around{' '}
                <AZSpan color="blue">web tools</AZSpan>,{' '}
                <AZSpan color="magenta">simulations</AZSpan>{' '}
                and small standalone projects designed to test concepts,
                mechanics and technical approaches.
            </p>
        </section>


        <section>
            <h2>This website</h2>

            <p>
                This site acts as a personal development space where
                projects, experiments and utilities are published as they evolve.
            </p>

            <p>
                Some projects are finished tools, while others remain
                prototypes or technical explorations.
                The platform itself is part of the experiment and
                continuously changes alongside the projects hosted here.
            </p>
        </section>


        <section>
            <h2>Development approach</h2>

            <p>
                I prefer learning through implementation —
                building systems, testing edge cases and refining ideas
                iteratively rather than designing everything theoretically first.
            </p>

            <p>
                Many projects begin as small technical curiosities
                and gradually grow into more complex systems over time.
            </p>
        </section>


        <section>
            <h2>Get in touch</h2>

            <p>
                If you want to discuss a project or share feedback,
                visit the{' '}
                <AZLink color="gold" href="/contacts/">
                    contacts page
                </AZLink>.
            </p>
        </section>
    </main>
    )
}

export default Page
