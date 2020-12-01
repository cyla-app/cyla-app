import React from 'react'
import { useTheme } from 'react-native-paper'
import CalendarStrip from 'react-native-calendar-strip'

export default ({ onDaySelected }: { onDaySelected: () => void }) => {
  const { colors } = useTheme()
  return (
    <CalendarStrip
      scrollable
      onDateSelected={onDaySelected}
      calendarHeaderStyle={{ color: colors.text }}
      dateNumberStyle={{ color: colors.text }}
      dateNameStyle={{ color: colors.text }}
      highlightDateNumberStyle={{ color: colors.primary }}
      highlightDateNameStyle={{ color: colors.primary }}
      calendarAnimation={{ type: 'sequence', duration: 30 }}
      daySelectionAnimation={{
        type: 'border',
        duration: 300,
        borderWidth: 1.5,
        borderHighlightColor: colors.primary,
      }}
      iconContainer={{ flex: 0.1 }}
      useNativeDriver
      style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
    />
  )
}
