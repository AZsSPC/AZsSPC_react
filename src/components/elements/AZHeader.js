import AZLink from './AZLink';
import { AZButton, AZButtonCopy } from './AZButton';
import '../../styles/header.css';


function AZHeader() {
    const pathname = 'https://github.com/azsspc/azsspc.github.io/blob/main' + window.location.pathname;

    return (
        <div className='az-header-container'>
            <header className='az-header'>
                <AZLink color='red' href='/' pure={true}>main</AZLink>
                <AZLink color='green' href='/pages/' pure={true}>pages</AZLink>
                <AZButtonCopy color='gray' copy={window.location.href} pure={true}>AZsSPC{window.location.pathname}</AZButtonCopy>
                <AZLink color='blue' href={pathname} pure={true}>code</AZLink>
                <AZButton color='gold'>info</AZButton>
            </header>
        </div>
    );
}
/* <AZLink color='magenta' href={`${pathname}README.md`} pure={true}>.md</AZLink> */


export default AZHeader;
