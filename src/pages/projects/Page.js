import AZLink from '../../components/elements/AZLink';
import { PROJECTS } from '../../Pages';
import './Styles.css';

function Page() {

    return <div id='projects'>
        {Object.keys(PROJECTS).map(project => (
            <AZLink key={project} href={project} className='project-link-panel' is_panel={true}>
                <span className='project-path'>AZsSPC{project}</span>
                <span className='project-title'>{PROJECTS[project].title || project}</span>
                <span className='project-description'>{PROJECTS[project].description}</span>
                <div className='project-tags'>{PROJECTS[project].tags?.join(', ')}</div>
                <div className='project-marks'></div>
            </AZLink>
        ))}
    </div>;
}

export default Page;