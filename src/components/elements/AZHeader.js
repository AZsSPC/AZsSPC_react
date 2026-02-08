import AZLink from './AZLink';
import { AZButton, AZButtonCopy } from './AZButton';
import '../../styles/header.css';
import { useNotify } from "../providers/NotificationProvider";
import { ALL_PAGES } from '../../Pages.js';


function AZHeader() {
    const pathname = 'https://github.com/AZsSPC/AZsSPC_react/blob/main/src/pages/' + ALL_PAGES[window.location.pathname]?.path + '/';
    const notify = useNotify();

    return (
        <div className='az-header-container'>
            <header className='az-header'>
                <AZLink color='red' href='/' pure={true}>main</AZLink>
                <AZLink color='green' href={window.location.pathname === '/' ? '#pages' : '/#pages'} pure={true}>pages</AZLink>
                <AZLink color='blue' href={pathname} pure={true}>code</AZLink>
                <AZButton color='gold' onClick={(e) => {
                    notify('Unavailable yet', { type: 'info' });
                }}>info</AZButton>
                <AZButtonCopy color='gray' copy={window.location.href} pure={true}>AZsSPC{window.location.pathname}</AZButtonCopy>
            </header>
        </div>
    );
}
/* <AZLink color='magenta' href={`${pathname}README.md`} pure={true}>.md</AZLink> */


export default AZHeader;
