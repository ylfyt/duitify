import { useRef, useState } from 'react';

export function useStateWithRef<T>(initialValue: T) {
    const [state, setState] = useState<T>(initialValue);
    const ref = useRef<T>(initialValue);
    ref.current = state;
    return [state, setState, ref] as const;
}
