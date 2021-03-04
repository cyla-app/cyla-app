import * as React from 'react'
import { useState } from 'react'
import { Button, DefaultTheme, ThemeProvider } from 'react-native-paper'
import CylaModule from '../modules/CylaModule'
import { Clipboard, Linking, Text, ToastAndroid, View } from 'react-native'
import { DatePickerModal } from 'react-native-paper-dates'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default () => {
  const [open, setOpen] = React.useState(true)
  const [shareId, setShareId] = useState('')

  const onDismiss = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false)

      if (!startDate || !endDate) {
        return
      }

      CylaModule.shareData(startDate, endDate).then((lastShareId) =>
        setShareId(lastShareId),
      )
    },
    [setOpen],
  )

  return (
    <>
      {/* FIXME, avoid using specific theme just for the date picker */}
      <ThemeProvider
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#616182',
            accent: '#616182',
            onBackground: '#616182',
            surface: '#fff',
            background: '#ffeded',
            backdrop: '#000000',
            onSurface: '#ffffff',
            periodRed: '#CC1C21',
            buttonBackground: 'rgb(239,228,237)',
            daily: '#00075E',
            calendar: 'rgb(0,8,114)',
            add: 'rgb(0,10,133)',
            statistics: 'rgb(0,11,153)',
            profile: 'rgb(0,13,172)',
          },
        }}>
        <DatePickerModal
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={undefined}
          endDate={undefined}
          onConfirm={onConfirm}
          saveLabel={'Share'}
        />
      </ThemeProvider>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons size={128} name={'check-circle-outline'} />
        <Text>Medical data shared! Use the link below.</Text>

        <Text
          style={{ color: 'blue' }}
          onPress={() =>
            Linking.openURL(`http://localhost:3000/share/${shareId}`)
          }
          onLongPress={() => {
            Clipboard.setString(`http://localhost:3000/share/${shareId}`)
            ToastAndroid.show('Copied to clipboard!', 1000)
          }}>
          share.cyla.app/share/{shareId}
        </Text>
      </View>
    </>
  )
}
