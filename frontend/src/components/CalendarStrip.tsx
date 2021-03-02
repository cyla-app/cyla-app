import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'
import { addDays, isSameDay } from 'date-fns'
import moment, { Moment } from 'moment'
import { Period, PeriodStats } from '../types'
import { formatDay } from '../utils/date'

type PropTypes = {
  onDateSelected: (date: string) => void
  periodStats: Period[]
}

export default ({ onDateSelected, periodStats }: PropTypes) => {
  const { colors } = useTheme()
  const now = new Date()

  const markedDates = PeriodStats.mapToDates({ periods: periodStats })

  const selectDay = (date: Moment) => {
    const formatted = formatDay(date.toDate())
    onDateSelected(formatted)
  }

  const customDatesStylesFunc = (date: Moment) => {
    const day = markedDates.find((marked) =>
      isSameDay(date.toDate(), marked.date),
    )
    if (day) {
      return {
        dateContainerStyle: {
          backgroundColor: colors.periodRed,
        },
      }
    }
  }

  return (
    <CalendarStrip
      customDatesStyles={customDatesStylesFunc}
      scrollable
      onDateSelected={selectDay}
      calendarHeaderStyle={{ color: colors.text }}
      dateNumberStyle={{ fontWeight: 'normal', color: colors.text }}
      dateNameStyle={{ fontWeight: 'normal', color: colors.text }}
      calendarAnimation={{ type: 'sequence', duration: 30 }}
      daySelectionAnimation={{
        type: 'border',
        duration: 200,
        borderWidth: 1,
        borderHighlightColor: colors.primary,
      }}
      maxDate={moment(addDays(now, 3))}
      startingDate={moment(now)}
      selectedDate={moment(now)}
      iconContainer={{ flex: 0.1 }}
      highlightDateNameStyle={{ fontWeight: 'bold', color: colors.primary }}
      highlightDateNumberStyle={{ fontWeight: 'bold', color: colors.primary }}
      style={{ paddingBottom: 15, paddingTop: 5 }}
      innerStyle={{}}
      calendarHeaderContainerStyle={{ paddingBottom: 15 }}
    />
  )
}
