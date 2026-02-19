import './Styles.css'
import AZLink from '../../components/elements/AZLink'
import AZSpan from '../../components/elements/AZSpan'
import AZButtonCopy from '../../components/elements/AZButtonCopy'

function Page() {
    return (<>
        <section>
            <h2>Contacts</h2>

            <p>
                You can call me <AZSpan color="gold">AZ</AZSpan>.
                Glad you stopped by.
            </p>

            <p>
                I’m an independent developer creating{' '}
                <AZSpan color="blue">web tools</AZSpan>,{' '}
                <AZSpan color="magenta">simulations</AZSpan>{' '}
                and experimental programming projects.
            </p>

            <p>
                Choose the most convenient way to reach me below.
            </p>
        </section>


        <section>
            <h2>What you can contact me about</h2>

            <p>
                Feel free to write me regarding:
                <ul>
                    <li> project feedback or suggestions </li>
                    <li> collaboration ideas </li>
                    <li> bug reports or issues you found </li>
                </ul>
            </p>

            <p>
                Questions related to projects published on this site are always welcome!
            </p>
        </section>


        <section>
            <h2>Contact methods</h2>

            <p className="contact-item">
                <AZSpan color="blue">Telegram:</AZSpan>{' '}
                <AZSpan>fastest response, preferred way</AZSpan>{' '}
                <AZLink color="blue" href="https://t.me/AZ_218">
                    t.me/AZ_218
                </AZLink>
            </p>

            <p className="contact-item">
                <AZSpan color="magenta">Discord:</AZSpan>{' '}
                <AZSpan>alternative contact, replies may take longer</AZSpan>{' '}
                <AZLink
                    color="magenta"
                    href="https://discord.com/users/467051304985034784"
                >
                    az_218
                </AZLink>
            </p>

            <p className="contact-item">
                <AZSpan color="gold">Email:</AZSpan>{' '}
                <AZSpan>formal or long messages</AZSpan>{' '}
                <AZLink color="gold" href="mailto:az.spc.contact@gmail.com">
                    Send email
                </AZLink>{' '}
                <AZButtonCopy color="gray">
                    az.spc.contact@gmail.com
                </AZButtonCopy>
            </p>
        </section>


        <section>
            <h2>Availability</h2>

            <p>
                I usually respond within a day on{' '}
                <AZSpan color="blue">Telegram</AZSpan>.
                Other platforms may take longer depending on workload.
            </p>

            <p>
                Please note that this is a personal project space,
                so response times may vary.
            </p>
        </section>
    </>
    )
}

export default Page
