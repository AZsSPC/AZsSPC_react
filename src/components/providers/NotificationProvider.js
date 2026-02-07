import { createContext, useContext, useState, useCallback } from 'react';
import 'styles/notifications.css';

const NotificationContext = createContext(null);

const notfication_timeout = 3000;

export function NotificationProvider({ children }) {
    const [items, setItems] = useState([]);

    const notify = useCallback((message, options = {}) => {
        const id = crypto.randomUUID();

        setItems(list => [...list, { id, message, ...options }]);

        setTimeout(() => {
            setItems(list => list.filter(n => n.id !== id));
        }, options.duration ?? notfication_timeout);
    }, []);

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            <NotificationHost items={items} />
        </NotificationContext.Provider>
    );
}

export function useNotify() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotify must be used inside NotificationProvider');
    return ctx;
}

function NotificationHost({ items }) {
    return (
        <div className='az-notifications'>
            {items.map(n => (
                <div key={n.id} className={`az-notification ${`az-notification-${n.type}` ?? ''}`}>
                    {n.message}
                </div>
            ))}
        </div>
    );
}
