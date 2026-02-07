function AZSpan({ children, color, ...props }) {
    return <span class={`az-span ${color ? `color-${color}` : ''}`} {...props}>{children}</span>;
}


export default AZSpan;