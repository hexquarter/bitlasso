import { useRef, useEffect } from 'react';

/**
 * Custom hook that maintains a stable reference to the latest value.
 * Useful for callbacks that need the current state without changing dependencies.
 * 
 * Example:
 * ```tsx
 * const walletRef = useLatest(wallet);
 * const myCallback = useCallback(() => {
 *   const currentWallet = walletRef.current; // Always fresh
 * }, []); // No wallet dependency needed
 * ```
 */
export function useLatest<T>(value: T) {
    const ref = useRef(value);
    
    useEffect(() => {
        ref.current = value;
    }, [value]);
    
    return ref;
}
