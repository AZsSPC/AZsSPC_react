import AZLinkPanel from '../../components/elements/AZLinkPanel';
import { PROJECTS } from '../../Pages.js';
import './Styles.css';

function Page() {

    return <>
        <div id='projects'>
            {Object.keys(PROJECTS).map(project => (
                <AZLinkPanel key={project} href={project} classes='project-link-panel'>
                    <span className='project-path'>AZsSPC{project}</span>
                    <span className='project-title'>{PROJECTS[project].title || project}</span>
                    <span className='project-description'>{PROJECTS[project].description}</span>
                    <div className='project-tags'>{PROJECTS[project].tags?.join(', ')}</div>
                    <div className='project-marks'></div>
                </AZLinkPanel>
            ))}
        </div>
    </>;
}

export default Page;