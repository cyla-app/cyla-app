import { Button } from 'react-native-paper'
import React from 'react'

export default ({ onPress }: { onPress: () => void }) => {
  return (
    <Button mode="text" onPress={onPress}>
      🌍 Connected to Earth. Change now
    </Button>
  )
}
