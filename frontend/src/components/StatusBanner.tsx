import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Banner } from 'react-native-paper'
import React, { useState } from 'react'

type PropsType = { isOnline: boolean; profileError: string | undefined }

export default ({ isOnline, profileError }: PropsType) => {
  const [showError, setShowError] = useState<boolean>(true)
  const [showConnectivity, setShowConnectivity] = useState<boolean>(true)

  return (
    <Banner
      visible={(showConnectivity && !isOnline) || (showError && !!profileError)}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => {
            profileError ? setShowError(false) : setShowConnectivity(false)
          },
        },
      ]}
      icon={({ size }) => (
        <MaterialCommunityIcons size={size} name={'alert-circle'} />
      )}>
      {profileError
        ? profileError ?? 'Unknown Error'
        : !isOnline
        ? 'You are currently offline. Some functionality may not work.'
        : ''}
    </Banner>
  )
}
