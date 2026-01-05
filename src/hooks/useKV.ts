import { useState, useEffect, useCallback } from 'react'

/**
 * A hook for persisting state in localStorage with automatic synchronization.
 * Replaces the @github/spark useKV hook.
 * 
 * @param key - The localStorage key to use
 * @param defaultValue - The default value if no stored value exists
 * @returns A tuple of [value, setValue] similar to useState
 */
export function useKV<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state from localStorage or use default
  const [value, setValueState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error)
    }
  }, [key, value])

  // Wrapper for setValue that supports both direct values and updater functions
  const setValue = useCallback((valueOrUpdater: React.SetStateAction<T>) => {
    setValueState(valueOrUpdater)
  }, [])

  return [value, setValue]
}
