
function AZLink({ children, href, color, target, pure = false, ...props }) {
    return <a class={`az-link-button ${color ? `color-${color}` : ''} ${pure ? 'az-link-pure' : ''}`}
        target={href && href.startsWith("http") ? "_blank" : target || ""}
        href={href} {...props}>{children}</a>;
}

export default AZLink;
