import { useEffect, useState } from 'react';
import AZLink from './AZLink';
import AZButton from '../../components/elements/AZButton'
import AZButtonCopy from '../../components/elements/AZButtonCopy'
import { useNotify } from "../../providers/NotificationProvider";
import { ALL_PAGES } from '../../Pages.js';
import './AZHeader.css';

function AZHeader() {
    const [location, setLocation] = useState({
        pathname: window.location.pathname,
        href: window.location.href
    });

    const notify = useNotify();

    useEffect(() => {
        const update = () => setLocation({
            pathname: window.location.pathname,
            href: window.location.href
        });

        window.addEventListener('popstate', update);
        window.addEventListener('hashchange', update);

        return () => {
            window.removeEventListener('popstate', update);
            window.removeEventListener('hashchange', update);
        };
    }, []);


    const page = ALL_PAGES[location.pathname];
    const githubPath = page ? `https://github.com/AZsSPC/AZsSPC_react/blob/main/src/pages/${page.path}/` : null;

    return (
        <div className='az-header-container'>
            <header className='az-header'>
                <AZLink color='red' href='/' pure>main</AZLink>

                <AZLink color='green' href='/#pages' pure>pages</AZLink>

                {githubPath && (<AZLink color='blue' href={githubPath} pure>code</AZLink>)}

                <AZButton color='gold' onClick={() => notify('Unavailable yet', { type: 'info' })}>info</AZButton>

                <AZButtonCopy color='gray' copy={location.href} pure>AZsSPC{location.pathname}</AZButtonCopy>
            </header>
        </div>
    );
}

export default AZHeader;
