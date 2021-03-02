import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'
import { addDays } from 'date-fns'
import moment, { Moment } from 'moment'
import { Day, Period, PeriodStats } from '../types'
import { formatDay } from '../utils/date'
import { DayIndex } from '../daysSlice'

type PropTypes = {
  onDaySelected: (day: Day) => void
  onDateSelected: (date: string) => void
  days: DayIndex
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
    const formatted = formatDay(date.toDate())
    onDateSelected(formatted)
    const found = days[formatted]

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
