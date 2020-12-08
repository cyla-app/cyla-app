import { Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper'

export default ({
  initialString,
  onTemperatureChange,
}: {
  initialString: string
  onTemperatureChange: (temperature: number) => void
}) => {
  const [temperatureString, setTemperatureString] = useState<string>(
    initialString,
  )

  const setTemperature = (
    newTemperature: number,
    newTemperatureString: string,
  ) => {
    onTemperatureChange(newTemperature)
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
        }}
        selectionColor={theme.colors.primary}
        value={temperatureString}
        onChangeText={(text) => {
          setTemperature(parseFloat(text), text)
        }}
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
