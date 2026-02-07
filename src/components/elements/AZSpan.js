function AZSpan({ children, classes = '', color, ...props }) {
    return <span class={`az-span ${classes} ${color ? `color-${color}` : ''}`} {...props}>{children}</span>;
}


export default AZSpan;