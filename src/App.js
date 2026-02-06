import './App.css';
import { AZButton, AZButtonCopy } from './components/elements/AZButton';
import AZLink from './components/elements/AZLink';
import AZHeader from './components/elements/AZHeader';
import { NotificationProvider } from './components/providers/NotificationProvider';

function App() {
  const pathname = 'https://github.com/azsspc/azsspc.github.io/blob/main' + window.location.pathname;

  return <>
    <NotificationProvider>
      <AZHeader />
      <main>
        <section>
          <h2>Welcome to AZsSPC's site!</h2>
          <p>
            This is my personal site, where I will post some of my{' '}
            <AZLink color="magenta" href="/projects/">projects</AZLink>{' '}
            and other things related to programming, gaming and other stuff I'd like to share
          </p>
          <p>
            If you have any questions or suggestions, please feel free to contact me through{' '}
            <AZLink color="gold" href="/contacts/">contacts page</AZLink>
          </p>
          <p>
            I hope you will find something interesting here! Enjoy your stay!
          </p>
        </section>
        <section>
          <h2>Important information</h2>
          <p>
            The purpose of this page is to tell you some meanings and useful information for using the site,
            so plase, make sure you read this page carefully
          </p>
          <p>
            Also I must say that the site is still in development, so some of the features may not work properly, but I will try to fix it as soon as possible
          </p>
        </section>
        <section>
          <h2>Elements explanation</h2>
          <p>
            Basic elements look like this:{' '}
            <AZLink color="purple" href='#' >anchor</AZLink>{' '} to specific element on the current page,{' '}
            <AZLink color="red" href='/'>internal link</AZLink>,{' '}
            <AZLink color="blue" href='http://google.com/' >external link</AZLink>,{' '}
            <AZButton color="green">button</AZButton>{' '}
            and{' '}
            <AZButtonCopy color='gray'>copy</AZButtonCopy>{' '}
            button
          </p>
          <p>
            They can be colored differently to satisfy various design needs,
            look at the helping icons before or after element content to specify it's purpose
          </p>
        </section>
        <section>
          <h2>Header content explanation</h2>
          <p>
            <AZLink color='red' href='/' pure={true}>./</AZLink>{' '}
            is the link to the{' '}
            <AZLink color='red' href='/'>main page</AZLink>{' '}
            of the site
          </p>
          <p>
            <AZLink color='green' href={`${pathname}README.md`} pure={true}>.md</AZLink>{' '}
            is the link to the{' '}
            <AZLink color='green' href={`${pathname}README.md`}>README.md</AZLink>{' '}
            file of current page
          </p>
          <p>
            <AZLink color='blue' href={pathname} pure={true}>{"</>"}</AZLink>{' '}
            is the link to the{' '}
            <AZLink color='blue' href={pathname} >source code</AZLink>{' '}
            of current page on{' '}
            <AZLink color="gray" href="https://github.com/AZsSPC" >GitHub</AZLink>{' '}
          </p>
          <p>
            <AZButton color='gold'>?</AZButton>{' '}
            is the button to show the information about the current page
          </p>
          <p>
            Clicking on{' '}
            <AZButtonCopy color='gray'>current page's path</AZButtonCopy>{' '}
            will copy it to the clipboard
          </p>
        </section>
      </main>
    </NotificationProvider>
  </>;
}

export default App;
