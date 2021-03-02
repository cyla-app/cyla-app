import { Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper'

type PropsType = {
  initialString: string
  onTemperatureChanged: (temperature: number) => void
}

export default ({ initialString, onTemperatureChanged }: PropsType) => {
  const [temperatureString, setTemperatureString] = useState<string>(
    initialString,
  )
  const [focused, setFocus] = useState(false)

  const setTemperature = (
    newTemperature: number,
    newTemperatureString: string,
  ) => {
    onTemperatureChanged(newTemperature)
    setTemperatureString(newTemperatureString)
  }

  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 0.25,
        }}
      />

      <TextInput
        style={{
          width: 100,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          fontSize: 30,
          alignSelf: 'center',
          marginLeft: 5,
          marginRight: 5,
          backgroundColor: focused
            ? theme.colors.buttonBackground
            : 'transparent',
          borderRadius: 10,
        }}
        selectionColor={theme.colors.primary}
        value={temperatureString}
        onChangeText={(text) => {
          setTemperature(parseFloat(text), text)
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        maxLength={5}
        placeholder={'--.--'}
        keyboardType={'numeric'}
      />
      <Text
        style={{
          flex: 0.25,
          fontWeight: 'bold',
          fontSize: 15,
        }}>
        ° C
      </Text>
    </View>
  )
}
