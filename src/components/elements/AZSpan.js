function AZSpan({ children, classes = '', color, ...props }) {
    return <span className={`az-span ${classes} ${color ? `color-${color}` : ''}`} {...props}>{children}</span>;
}


export default AZSpan;