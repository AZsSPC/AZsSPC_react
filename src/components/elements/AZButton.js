function AZButton({ children, color, className = '', pure = false, ...props }) {
    return (
        <button
            className={`az-button ${className} ${pure ? 'pure' : ''}`}
            color={color || 'unset'}
            {...props}
        >
            {children}
        </button>
    );
}

export default AZButton;
