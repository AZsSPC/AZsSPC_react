import { useState } from 'react';
import AZLink from './AZLink';
import { AZButton, AZButtonCopy } from './AZButton';


function AZHeader() {
    const [CurrentPage, setCurrentPage] = useState(window.location.pathname);
    const pathname = 'https://github.com/azsspc/azsspc.github.io/blob/main' + window.location.pathname;

    return (
        <div className='az-header-container'>
            <header className='az-header'>
                <AZLink color='red' href='/' pure={true}>./</AZLink>
                <AZLink color='green' href={`${pathname}README.md`} pure={true}>.md</AZLink>
                <AZLink color='blue' href={pathname} pure={true}>{"</>"}</AZLink>
                <AZButtonCopy color='gray'>{CurrentPage}</AZButtonCopy>
            </header>
        </div>
    );
}


export default AZHeader;
