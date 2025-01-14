import { useCallback } from 'react';

export function useLocalStorage() {
    const setItem = useCallback(<T>(key: string, value: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    }, []);

    const getItem = useCallback((key: string) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const deleteItem = useCallback((key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    }, []);

    return { setItem, getItem, deleteItem };
}
