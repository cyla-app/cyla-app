import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'
import { addWeeks } from 'date-fns'
import moment from 'moment'

type PropTypes = {
  onDaySelected: () => void
  periodDays: string[]
}

export default ({ onDaySelected, periodDays }: PropTypes) => {
  const { colors } = useTheme()
  const now = new Date()

  const markedDates: any[] = periodDays.map((date) => ({
    date: moment(date),
    dots: [
      {
        color: colors.periodRed,
        selectedColor: colors.periodRed,
      },
    ],
  }))

  return (
    <CalendarStrip
      markedDates={markedDates} // FIXME use circle instead of dots for visualisation
      scrollable
      onDateSelected={onDaySelected}
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
