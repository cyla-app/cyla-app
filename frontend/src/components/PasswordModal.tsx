import * as React from 'react'
import { useState } from 'react'
import { Button, Modal, Portal, TextInput } from 'react-native-paper'
import { FlexStyle, StyleSheet, ViewStyle } from 'react-native'

export default ({ onSave }: { onSave: (passphrase: string) => void }) => {
  const [visible, setVisible] = useState(true)
  const [passphrase, setPassphrase] = useState('')

  const hideModal = () => setVisible(false)

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'space-evenly',
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
          value={passphrase}
          mode="outlined"
          onChangeText={(newPassword) => setPassphrase(newPassword)}
        />
        <Button
          icon="content-save"
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
