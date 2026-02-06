import { useNotify } from "../providers/NotificationProvider";

function AZButton({ children, color, ...props }) {
    return <button class={`az-button ${color ? `color-${color}` : ''}`} {...props}>{children}</button>;
}

function AZButtonCopy({ children, copy, color, ...props }) {
    const notify = useNotify();
    return <button class={`az-button az-button-copy ${color ? `color-${color}` : ''}`} {...props}
        onClick={(e) => {
            navigator.clipboard.writeText(copy || e.target.textContent);
            notify('Saved successfully', { type: 'success' });
        }}
    >{children}</button>;
}

export default AZButton;
export { AZButton, AZButtonCopy };