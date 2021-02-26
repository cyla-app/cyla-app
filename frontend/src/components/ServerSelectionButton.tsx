import { Button } from 'react-native-paper'
import React from 'react'

export default ({ onPress }: { onPress: () => void }) => {
  return (
    <Button style={{ marginTop: 10 }} mode="text" onPress={onPress}>
      🌍 Change Server
    </Button>
  )
}
