import { useNotify } from '../../providers/NotificationProvider';
import AZButton from './AZButton';

export function AZButtonCopy({ children, copy, onClick, ...props }) {
    const notify = useNotify();

    const handleClick = (e) => {
        navigator.clipboard.writeText(copy ?? e.currentTarget.textContent);
        notify('Copied to clipboard', { type: 'success' });
        onClick?.(e);
    };

    return (
        <AZButton
            className='az-button-copy'
            onClick={handleClick}
            {...props}
        >
            {children}
        </AZButton>
    );
}

export default AZButtonCopy;