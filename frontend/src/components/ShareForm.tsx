import * as React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Button } from 'react-native-paper'
import CylaModule from '../modules/CylaModule'

export default () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isShow, setIsShow] = useState(false)

  // FIXME: There's got to be a better way than creating an object with the func as attribute
  const [changeDateFunc, setChangeFunc] = useState({ changeFunc: setStartDate })

  const curDate = new Date()

  const showStartDatePicker = () => {
    setChangeFunc({ changeFunc: setStartDate })
    setIsShow(true)
  }

  const showEndDatePicker = () => {
    setChangeFunc({ changeFunc: setEndDate })
    setIsShow(true)
  }

  return (
    <>
      <Button icon="login" onPress={showStartDatePicker} title="Start date!">
        Start date
      </Button>
      <Button icon="login" onPress={showEndDatePicker} title="End date!">
        EndDate
      </Button>
      {isShow && (
        <DateTimePicker
          value={curDate}
          mode="default"
          display="default"
          onChange={(event, date) => {
            const newDate: Date = date || new Date()
            setIsShow(false)
            changeDateFunc.changeFunc(newDate)
          }}
        />
      )}
      <Button
        mode="contained"
        icon="login"
        style={{
          margin: 20,
        }}
        onPress={() => {
          CylaModule.shareData(startDate, endDate).catch((err) =>
            console.log(err),
          )
        }}>
        Share!
      </Button>
    </>
  )
}
