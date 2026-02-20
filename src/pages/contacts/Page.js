import './Styles.css'
import AZLink from '../../components/elements/AZLink'
import AZSpan from '../../components/elements/AZSpan'
import AZButtonCopy from '../../components/elements/AZButtonCopy'

function Page() {
    return (<main className='page_contacts'>
        <section>
            <h2>Contacts</h2>

            <p>
                Choose the most convenient way to reach me.
            </p>
            <p>
                Messages related to projects published on this site
                are always welcome!
            </p>
        </section>


        <section>
            <h2>What you can contact me about</h2>

            <ul>
                <li>project feedback or suggestions</li>
                <li>collaboration ideas</li>
                <li>bug reports or issues</li>
                <li>technical discussions related to published projects</li>
            </ul>
        </section>


        <section>
            <h2>Contact methods</h2>

            <p className="contact-item">
                <AZSpan color="blue">Telegram:</AZSpan>{' '}
                <AZSpan>fastest response, preferred channel</AZSpan>{' '}
                <AZLink color="blue" href="https://t.me/AZ_218">
                    t.me/AZ_218
                </AZLink>
            </p>

            <p className="contact-item">
                <AZSpan color="magenta">Discord:</AZSpan>{' '}
                <AZSpan>alternative contact</AZSpan>{' '}
                <AZLink
                    color="magenta"
                    href="https://discord.com/users/467051304985034784"
                >
                    az_218
                </AZLink>
            </p>

            <p className="contact-item">
                <AZSpan color="gold">Email:</AZSpan>{' '}
                <AZSpan>for formal or long messages</AZSpan>{' '}
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
                Telegram responses usually arrive within a day.
                Other platforms may take longer depending on workload.
            </p>

            <p>
                This is a personal project space, so response times
                are not guaranteed.
            </p>
        </section>
    </main>
    )
}

export default Page
