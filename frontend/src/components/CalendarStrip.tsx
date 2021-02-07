import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'
import { addWeeks } from 'date-fns'
import moment, { Moment } from 'moment'
import { Day, Period, PeriodStats } from '../types'
import { formatDay } from '../utils/date'

type PropTypes = {
  onDaySelected: (day: Day) => void
  onDateSelected: (date: string) => void
  days: Day[]
  periodStats: Period[]
}

export default ({
  onDaySelected,
  onDateSelected,
  periodStats,
  days,
}: PropTypes) => {
  const { colors } = useTheme()
  const now = new Date()

  const markedDates = PeriodStats.mapToDates({ periods: periodStats }).map(
    ({ date }) => ({
      date: moment(date),
      lines: [
        {
          color: colors.periodRed,
          selectedColor: colors.periodRed,
        },
      ],
    }),
  )

  const selectDay = (date: Moment) => {
    onDateSelected(formatDay(date.toDate()))
    const found = days.find((day) => moment(day.date).isSame(date, 'day'))

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
      dateNumberStyle={{ fontWeight: 'normal', color: colors.text }}
      dateNameStyle={{ fontWeight: 'normal', color: colors.text }}
      calendarAnimation={{ type: 'sequence', duration: 30 }}
      maxDate={moment(addWeeks(now, 0))}
      startingDate={moment(addWeeks(now, 0))}
      selectedDate={moment(addWeeks(now, 0))}
      iconContainer={{ flex: 0.1 }}
      highlightDateNameStyle={{ fontWeight: 'bold', color: colors.primary }}
      highlightDateNumberStyle={{ fontWeight: 'bold', color: colors.primary }}
      style={{ paddingBottom: 15, paddingTop: 5 }}
      innerStyle={{}}
      calendarHeaderContainerStyle={{ paddingBottom: 15 }}
    />
  )
}
