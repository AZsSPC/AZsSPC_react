function AZSpan({ children, className = '', color, ...props }) {
    return <span className={`az-span ${className} ${color ? `color-${color}` : ''}`} {...props}>{children}</span>;
}


export default AZSpan;