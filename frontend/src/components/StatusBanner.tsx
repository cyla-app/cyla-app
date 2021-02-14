import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Banner } from 'react-native-paper'
import React, { useState } from 'react'

type PropsType = { isOnline: boolean; sessionError: string | undefined }

export default ({ isOnline, sessionError }: PropsType) => {
  const [showError, setShowError] = useState<boolean>(true)
  const [showConnectivity, setShowConnectivity] = useState<boolean>(true)

  return (
    <Banner
      visible={(showConnectivity && !isOnline) || (showError && !!sessionError)}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => {
            sessionError ? setShowError(false) : setShowConnectivity(false)
          },
        },
      ]}
      icon={({ size }) => (
        <MaterialCommunityIcons size={size} name={'alert-circle'} />
      )}>
      {sessionError
        ? sessionError ?? 'Unknown Error'
        : !isOnline
        ? 'You are currently offline. Some functionality may not work.'
        : ''}
    </Banner>
  )
}
