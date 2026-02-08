import AZButton, { AZButtonCopy } from '../../../components/elements/AZButton'
import './Styles.css'
import { useState, useEffect, useMemo } from 'react'
import { useNotify } from '../../../components/providers/NotificationProvider'

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

    return (
        <div className='translator-page'>
            <div className='instruments'>
                <AZButton onClick={() => setInput('')} color='magenta'>Clear</AZButton>
                <select id='from-layout' name='from-layout' value={fromLang} onChange={e => setFromLang(e.target.value)}>
                    {LAYOUTS.map(l => <option key={l} value={l}>From "{l}"</option>)}
                </select>

                <select id='to-layout' name='to-layout' value={toLang} onChange={e => setToLang(e.target.value)}>
                    {LAYOUTS.map(l => <option key={l} value={l}>To "{l}"</option>)}
                </select>
                <AZButtonCopy copy={output} disabled={!output} color='blue'>Copy output</AZButtonCopy>
            </div>
            <textarea id='text-input' value={input} onChange={e => (setInput(e.target.value))} placeholder='Input you cursed text here' />
            <textarea id='text-output' value={output} readOnly placeholder='Output will appear here' />
        </div>
    )
}

export default Page
