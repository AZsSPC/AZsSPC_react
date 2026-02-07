
function AZLink({ children, href, color, target, pure = false, ...props }) {
    return <a class={`az-link-button ${color ? `color-${color}` : ''} ${pure ? 'pure' : ''}`}
        target={href && href.startsWith("http") ? "_blank" : target || ""}
        rel="noreferrer"
        href={href} {...props}>{children}</a>;
}

export default AZLink;
