function AZLinkPanel({ children, href, color, target, classes = '', pure = false, ...props }) {
    return <a class={`az-link-panel ${classes} ${color ? `color-${color}` : ''} ${pure ? 'pure' : ''}`}
        target={href && href.startsWith("http") ? "_blank" : target || ""}
        rel="noreferrer"
        href={href} {...props}>{children}</a>;
}

export default AZLinkPanel;
