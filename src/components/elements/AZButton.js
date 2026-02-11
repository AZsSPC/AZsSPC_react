function AZButton({ children, color, className = '', pure = false, ...props }) {
    return (
        <button
            className={`az-button ${className} ${color ? `color-${color}` : ''} ${pure ? 'pure' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default AZButton;
