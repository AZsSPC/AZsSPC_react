function AZLink({ children, href, className = '', color, target, pure = false, ...props }) {
    const isExternal = href?.startsWith('http');

    return (
        <a
            className={`az-link-button ${className} ${color ? `color-${color}` : ''} ${pure ? 'pure' : ''}`}
            href={href}
            target={isExternal ? '_blank' : target}
            rel={isExternal ? 'noreferrer' : undefined}
            {...props}
        >
            {children}
        </a>
    );
}

export default AZLink;
