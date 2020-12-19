import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'
import { addWeeks } from 'date-fns'
import moment, { Moment } from 'moment'
import { Day } from '../../generated'

type PropTypes = {
  onDaySelected: (day: Day) => void
  periodDays: Day[]
}

export default ({ onDaySelected, periodDays }: PropTypes) => {
  const { colors } = useTheme()
  const now = new Date()

  const markedDates: any[] = periodDays.map((day) => ({
    date: moment(day.date),
    dots: [
      {
        color: colors.periodRed,
        selectedColor: colors.periodRed,
      },
    ],
  }))

  const selectDay = (date: Moment) => {
    const found = periodDays.find((day) => moment(day.date).isSame(date, 'day'))

    if (found) {
      onDaySelected(found)
    }
  }

  return (
    <CalendarStrip
      markedDates={markedDates} // FIXME use circle instead of dots for visualisation
      scrollable
      onDateSelected={selectDay}
      calendarHeaderStyle={{ color: colors.text }}
      dateNumberStyle={{ color: colors.text }}
      dateNameStyle={{ color: colors.text }}
      highlightDateNumberStyle={{ color: colors.primary }}
      highlightDateNameStyle={{ color: colors.primary }}
      calendarAnimation={{ type: 'sequence', duration: 30 }}
      maxDate={moment(addWeeks(now, 0))}
      startingDate={moment(addWeeks(now, 0))}
      selectedDate={moment(addWeeks(now, 0))}
      daySelectionAnimation={{
        type: 'border',
        duration: 300,
        borderWidth: 1.5,
        borderHighlightColor: colors.primary,
      }}
      iconContainer={{ flex: 0.1 }}
      useNativeDriver
      style={{ paddingBottom: 8, paddingTop: 8 }}
      innerStyle={[]}
    />
  )
}
