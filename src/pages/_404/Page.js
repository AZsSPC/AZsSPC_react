import AZLink from '../../components/elements/AZLink';

function Page404() {

    return <main>
        <h1>404 - Page not found</h1>
        <p>
            The page you are looking for does not exist or has been moved.
        </p>
        <p>
            Please check the URL or go back to the{' '}
            <AZLink color="blue" href="/">main page</AZLink>
        </p>
    </main>;
}

export default Page404;
