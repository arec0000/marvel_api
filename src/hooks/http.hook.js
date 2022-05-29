import { useState, useCallback } from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        setLoading(true);
        setProcess('loading');
        try {
            const res = await fetch(url, {method, body, headers});
            if (!res.ok) throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            const data = await res.json();
            setLoading(false);
            return data;
        } catch(err) {
            setLoading(false);
            setProcess('error');
            throw err;
        }
    }, []);

    const clearError = useCallback(() => setProcess('loading'), []);

    return {loading, process, setProcess, request, clearError};
}