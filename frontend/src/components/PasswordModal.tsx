import * as React from 'react'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper'
import { ViewStyle } from 'react-native'

export default ({
  onSave,
  loading,
}: {
  onSave: (passphrase: string) => void
  loading: boolean
}) => {
  const [visible, setVisible] = useState(true)
  const [passphrase, setPassphrase] = useState('')

  if (loading) {
    return <ActivityIndicator animating={true} />
  }

  const hideModal = () => setVisible(false)

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  } as ViewStyle

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
        dismissable={false}>
        <TextInput
          label="Password"
          secureTextEntry
          value={passphrase}
          mode="outlined"
          onChangeText={(newPassword) => setPassphrase(newPassword)}
        />
        <Button
          icon="content-save"
          style={{
            margin: 20,
          }}
          onPress={() => {
            hideModal()
            onSave(passphrase)
          }}>
          Save
        </Button>
      </Modal>
    </Portal>
  )
}
