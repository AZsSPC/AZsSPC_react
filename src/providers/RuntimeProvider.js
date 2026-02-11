import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const RuntimeContext = createContext(null);

export function RuntimeProvider({ children, initialTimeout = 100 }) {
    const [running, setRunning] = useState(false);
    const [timeout, setTimeoutLocal] = useState(initialTimeout);
    const runnerRef = useRef(null);
    const runningRef = useRef(false);
    const timeoutRef = useRef(initialTimeout);

    const registerRunner = useCallback((fn) => {
        runnerRef.current = fn;
    }, []);

    const start = useCallback(async () => {
        if (runningRef.current) return;
        runningRef.current = true;
        setRunning(true);
        while (runningRef.current && runnerRef.current && runnerRef.current()) {
            await new Promise((res) => setTimeout(res, timeoutRef.current));
        }
        runningRef.current = false;
        setRunning(false);
    }, []);

    const stop = useCallback(() => {
        runningRef.current = false;
        setRunning(false);
    }, []);

    const toggle = useCallback(() => {
        if (runningRef.current) stop();
        else start();
    }, [start, stop]);

    const handleSetTimeout = useCallback((newTimeout) => {
        timeoutRef.current = newTimeout;
        setTimeoutLocal(newTimeout);
    }, []);

    return (
        <RuntimeContext.Provider value={{ running, timeout, setTimeout: handleSetTimeout, registerRunner, start, stop, toggle }}>
            {children}
        </RuntimeContext.Provider>
    );
}

export function useRuntime() {
    const ctx = useContext(RuntimeContext);
    if (!ctx) throw new Error('useRuntime must be used within a RuntimeProvider');
    return ctx;
}

export default RuntimeProvider;
