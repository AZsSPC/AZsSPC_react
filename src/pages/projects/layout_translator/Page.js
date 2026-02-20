import AZButton from '../../../components/elements/AZButton'
import AZButtonCopy from '../../../components/elements/AZButtonCopy'
import AZInstrumentsPanel from '../../../components/elements/AZInstrumentsPanel'
import './Styles.css'
import { useState, useEffect, useMemo } from 'react'
import { useNotify } from '../../../providers/NotificationProvider'
import AZInputSelect from '../../../components/elements/AZInputSelect'

function Page() {
    const notify = useNotify()

    const [input, setInput] = useState('')
    const [fromLang, setFromLang] = useState('en')
    const [toLang, setToLang] = useState('ru')

    const [fromLayout, setFromLayout] = useState(null)
    const [toLayout, setToLayout] = useState(null)

    const LAYOUTS = ['en', 'ru', 'fr']

    useEffect(() => {
        let alive = true

        Promise.all([
            import(`./layouts/${fromLang}.json`),
            import(`./layouts/${toLang}.json`)
        ]).then(([from, to]) => {
            if (!alive) return

            setFromLayout(from.default)
            setToLayout(to.default)

            notify(`Loaded ${fromLang} → ${toLang}`, { type: 'success' })
        })

        return () => { alive = false }
    }, [fromLang, toLang, notify])

    const translateLayout = useMemo(() => {
        if (!fromLayout || !toLayout) return null

        const map = {}

        for (const [iso, [a, b]] of Object.entries(fromLayout)) {
            map[a] = toLayout[iso][0]
            map[b] = toLayout[iso][1]
        }

        return map
    }, [fromLayout, toLayout])

    const output = useMemo(() => {
        if (!input || !translateLayout) return ''

        let result = ''
        for (const ch of input)
            result += translateLayout[ch] ?? ch

        return result
    }, [input, translateLayout])

    return (<main>
        <div className='translator-page'>
            <AZInstrumentsPanel>
                <AZButton onClick={() => setInput('')} color='magenta'>Clear</AZButton>
                <AZInputSelect options={LAYOUTS} value={fromLang} onChange={e => setFromLang(e.target.value)} label='From Layout' />
                <AZInputSelect options={LAYOUTS} value={toLang} onChange={e => setToLang(e.target.value)} label='To Layout' />
                <AZButtonCopy copy={output} disabled={!output} color='blue'>Copy output</AZButtonCopy>
            </AZInstrumentsPanel>
            <textarea id='text-input' value={input} onChange={e => (setInput(e.target.value))} placeholder='Input you cursed text here' />
            <textarea id='text-output' value={output} readOnly placeholder='Output will appear here' />
        </div>
    </main>
    )
}

export default Page
