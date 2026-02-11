import './AZInstrumentsPanel.css'

function AZInstrumentsPanel({ children }) {
    return (
        <div className='az-instruments-panel'>
            {children}
        </div>
    )
}

function AZInstrumentsSubpanel({ children }) {
    return (
        <div className='az-instruments-subpanel'>
            {children}
        </div>
    )
}

export default AZInstrumentsPanel
export { AZInstrumentsSubpanel }