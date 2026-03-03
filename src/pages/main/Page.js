import './Styles.css';
import AZLink from '../../components/elements/AZLink';
import AZSpan from '../../components/elements/AZSpan';

function Page() {
    return (<main className='page_main'>

        <div className='landing'>

            <div className='landing_identity'>
                <h1>AZsSPC</h1>
                <div className='landing_caption'>
                    <p>
                        <AZSpan color="blue">Independent software laboratory</AZSpan>
                    </p>
                    <p>
                        Ideas are implemented, tested, refactored, and published in motion
                    </p>
                    <p>
                        <AZSpan color="gold">Feel free to explore!</AZSpan>
                    </p>
                </div>
            </div>

            <div className='landing_directions'>
                <div className='direction_grid'>
                    <div className='direction'>
                        <h3>
                            <AZLink href='/projects/?q=(tool)' color='blue'>Tools</AZLink>
                        </h3>
                        <p>
                            Interactive utilities and web-based systems
                            designed to solve specific technical problems
                        </p>
                    </div>
                    <div className='direction'>
                        <h3>
                            <AZLink href='/projects/?q=(simulation)' color='magenta'>Simulations</AZLink>
                        </h3>
                        <p>
                            System modeling, mechanics experiments
                            and rule-driven environments
                        </p>
                    </div>
                    <div className='direction'>
                        <h3>
                            <AZLink href='/projects/?q=(experimen)' color='purple'>Experiments</AZLink>
                        </h3>
                        <p>
                            Architectural trials, rendering ideas
                            and unconventional implementation patterns
                        </p>
                    </div>
                    <div className='direction'>
                        <h3>
                            <AZLink href='/projects/?q=(game)' color='green'>Games</AZLink>
                        </h3>
                        <p>
                            Interactive utilities and web-based systems
                            designed to solve specific technical problems
                        </p>
                    </div>
                </div>
            </div>

            <div className='landing_links'>
                <AZLink href='/projects/' color='green'>Projects</AZLink>
                <AZLink href='/about/' color='blue'>About</AZLink>
                <AZLink href='/contacts/' color='gold'>Contacts</AZLink>
            </div>

        </div>

    </main>);
}

export default Page;