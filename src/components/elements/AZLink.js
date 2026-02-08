function AZLink({ children, href, classes = '', color, target, pure = false, ...props }) {
    return <a className={`az-link-button ${classes} ${color ? `color-${color}` : ''} ${pure ? 'pure' : ''}`}
        target={href && href.startsWith("http") ? "_blank" : target || ""}
        rel="noreferrer"
        href={href} {...props}>{children}</a>;
}

export default AZLink;
