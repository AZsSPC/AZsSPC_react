import { useNotify } from "components/providers/NotificationProvider";

function AZButton({ children, color, pure = false, ...props }) {
    return <button class={`az-button ${color ? `color-${color}` : ''}  ${pure ? 'pure' : ''}`} {...props}>{children}</button>;
}

function AZButtonCopy({ children, copy, color, pure = false, ...props }) {
    const notify = useNotify();
    return <button class={`az-button az-button-copy ${color ? `color-${color}` : ''}  ${pure ? 'pure' : ''}`} {...props}
        onClick={(e) => {
            navigator.clipboard.writeText(copy || e.target.textContent);
            notify('Copied to clipboard', { type: 'success' });
        }}
    >{children}</button>;
}

export default AZButton;
export { AZButton, AZButtonCopy };