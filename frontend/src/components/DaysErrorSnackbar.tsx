import { Snackbar } from 'react-native-paper'
import React, { useState } from 'react'

type PropsType = { daysError: string | undefined }

export default ({ daysError }: PropsType) => {
  const [dayErrorVisible, setDayErrorVisible] = useState<boolean>(true)

  return (
    <Snackbar
      visible={dayErrorVisible && !!daysError}
      onDismiss={() => setDayErrorVisible(false)}
      action={{
        label: 'Dismiss',
        onPress: () => {
          setDayErrorVisible(false)
        },
      }}>
      {daysError}
    </Snackbar>
  )
}
