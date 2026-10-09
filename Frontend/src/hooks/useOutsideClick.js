import { useEffect } from 'react';

/**
 * Custom hook to detect clicks outside of a referenced DOM element.
 * @param {React.RefObject} ref - Reference to the target DOM element
 * @param {Function} callback - Function to execute when a click outside occurs
 */
export function useOutsideClick(ref, callback) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendant elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
}

export default useOutsideClick;
