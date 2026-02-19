import AZLink from '../../components/elements/AZLink'
import AZSpan from '../../components/elements/AZSpan'
import './Styles.css'

function Page() {
    return (<>
        <section>
            <h2>About</h2>

            <p>
                You can call me <AZSpan color="gold">AZ</AZSpan>.
                I’m an independent developer interested in building
                experimental software and exploring programming ideas through practice.
            </p>

            <p>
                Most of my work focuses on{' '}
                <AZSpan color="blue">web tools</AZSpan>,{' '}
                <AZSpan color="magenta">simulations</AZSpan>{' '}
                and small standalone projects created to test concepts,
                mechanics or technical approaches.
            </p>
        </section>


        <section>
            <h2>What this site is</h2>

            <p>
                This website serves as a personal space where I publish projects,
                experiments and utilities that I find interesting or useful.
            </p>

            <p>
                Some projects are complete tools, while others are ongoing
                experiments or prototypes exploring specific ideas.
            </p>

            <p>
                The site itself is also part of the experiment —
                it evolves together with the projects hosted here.
            </p>
        </section>


        <section>
            <h2>Approach</h2>

            <p>
                I prefer learning through implementation:
                building systems, testing edge cases and refining ideas
                through iteration rather than theoretical design alone.
            </p>

            <p>
                Many projects start as small technical curiosities
                and gradually grow into more complex systems.
            </p>
        </section>


        <section>
            <h2>Contact</h2>

            <p>
                If you want to discuss a project, share feedback or ask a question,
                feel free to visit the{' '}
                <AZLink color="gold" href="/contacts/">
                    contacts page
                </AZLink>.
            </p>
        </section>
    </>
    )
}

export default Page
