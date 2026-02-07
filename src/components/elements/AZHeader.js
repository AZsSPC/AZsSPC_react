import AZLink from 'components/elements/AZLink';
import { AZButton, AZButtonCopy } from 'components/elements/AZButton';
import 'styles/header.css';
import { useNotify } from "components/providers/NotificationProvider";


function AZHeader() {
    const pathname = 'https://github.com/AZsSPC/AZsSPC_react/blob/main' + window.location.pathname;
    const notify = useNotify();

    return (
        <div className='az-header-container'>
            <header className='az-header'>
                <AZLink color='red' href='/' pure={true}>main</AZLink>
                <AZLink color='green' href={window.location.pathname === '/' ? '#pages' : '/#pages'} pure={true}>pages</AZLink>
                <AZButtonCopy color='gray' copy={window.location.href} pure={true}>AZsSPC{window.location.pathname}</AZButtonCopy>
                <AZLink color='blue' href={pathname} pure={true}>code</AZLink>
                <AZButton color='gold' onClick={(e) => {
                    notify('Unavailable yet', { type: 'warning' });
                }}>info</AZButton>
            </header>
        </div>
    );
}
/* <AZLink color='magenta' href={`${pathname}README.md`} pure={true}>.md</AZLink> */


export default AZHeader;
