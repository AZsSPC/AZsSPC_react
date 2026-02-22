import { navigate } from '../../index'

function AZLink({ children, href, className = '', color, target, pure = false, is_panel = false, ...props }) {

    const isExternal =
        href?.startsWith('http') ||
        href?.startsWith('mailto:') ||
        href?.startsWith('tel:');

    const isHashLink =
        href?.startsWith('#') ||
        href?.startsWith(window.location.pathname + '#');

    const handleClick = (e) => {
        if (!href || isExternal) return;

        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            target === '_blank'
        ) return;

        if (isHashLink) return;

        e.preventDefault();
        navigate(href);
    };

    return (
        <a
            className={`${is_panel ? 'az-link-panel' : 'az-link-button'} ${className} ${pure ? 'pure' : ''}`}
            color={color || 'unset'}
            href={href}
            target={isExternal ? '_blank' : target}
            rel={isExternal ? 'noreferrer' : undefined}
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    )
}

export default AZLink
