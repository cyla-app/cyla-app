import { Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

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
          height: 55,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          fontSize: 30,
          alignSelf: 'center',
        }}
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
