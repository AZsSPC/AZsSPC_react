function AZSpan({ children, className = '', color, ...props }) {
    return <span className={`az-span ${className}`} color={color || 'none'} {...props}>{children}</span>;
}


export default AZSpan;