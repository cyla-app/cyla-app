import { useEffect, useState, useRef } from 'react'
import { EventSubscription, Keyboard } from 'react-native'

export const useKeyboardStatus = () => {
  const [isOpen, setIsOpen] = useState(false)
  const keyboardShowListener = useRef<EventSubscription | null>(null)
  const keyboardHideListener = useRef<EventSubscription | null>(null)

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', () =>
      setIsOpen(true),
    )
    keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', () =>
      setIsOpen(false),
    )

    return () => {
      keyboardShowListener.current?.remove()
      keyboardHideListener.current?.remove()
    }
  })

  return isOpen
}
