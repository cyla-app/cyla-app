import React, { useMemo } from 'react'
import { CalendarList } from 'react-native-calendars'
import { useTheme } from 'react-native-paper'

type PropsType = {
  periodDays: string[]
  onDayPress: (date: string) => void
}

export default ({ periodDays, onDayPress }: PropsType) => {
  const { colors } = useTheme()
  const theme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      textSectionTitleColor: colors.text,
      textSectionTitleDisabledColor: colors.disabled,
      selectedDayBackgroundColor: colors.background,
      selectedDayTextColor: colors.primary,
      todayTextColor: colors.primary,
      dayTextColor: colors.text,
      textDisabledColor: colors.disabled,
      dotColor: colors.primary,
      selectedDotColor: colors.primary,
      arrowColor: colors.text,
      disabledArrowColor: colors.disabled,
      monthTextColor: colors.text,
      indicatorColor: colors.primary,
      textDayFontFamily: undefined,
      textMonthFontFamily: undefined,
      textDayHeaderFontFamily: undefined,
      textDayFontWeight: undefined,
      textMonthFontWeight: undefined,
      textDayHeaderFontWeight: undefined,
      textDayFontSize: 16,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 16,
    }),
    [colors],
  )

  const markedDates = periodDays.map((date) => {
    return [
      date,
      {
        customStyles: {
          container: {
            borderColor: colors.periodRed,
            borderWidth: 1.5,
          },
          text: {},
        },
      },
    ]
  })

  return (
    <CalendarList
      markingType={'custom'}
      markedDates={Object.fromEntries(markedDates)}
      theme={theme}
      // Initially visible month. Default = Date()
      current={new Date()}
      // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
      minDate={undefined}
      // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
      maxDate={undefined}
      // Handler which gets executed on day press. Default = undefined
      onDayPress={(calendarDay) => {
        console.log('selected day', calendarDay)
        onDayPress(calendarDay.dateString)
      }}
      // Handler which gets executed on day long press. Default = undefined
      onDayLongPress={(day) => {
        console.log('selected day', day)
      }}
      // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
      // monthFormat={'yyyy MM'}
      // Handler which gets executed when visible month changes in calendar. Default = undefined
      onMonthChange={(month) => {
        console.log('month changed', month)
      }}
      // Hide month navigation arrows. Default = false
      hideArrows={true}
      // Do not show days of other months in month page. Default = false
      hideExtraDays={false}
      // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
      // day from another month that is visible in calendar page. Default = false
      disableMonthChange={false}
      // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
      firstDay={1}
      // Hide day names. Default = false
      hideDayNames={false}
      // Show week numbers to the left. Default = false
      showWeekNumbers={false}
      // Handler which gets executed when press arrow icon left. It receive a callback can go back month
      onPressArrowLeft={(subtractMonth) => subtractMonth()}
      // Handler which gets executed when press arrow icon right. It receive a callback can go next month
      onPressArrowRight={(addMonth) => addMonth()}
      // Disable left arrow. Default = false
      disableArrowLeft={false}
      // Disable right arrow. Default = false
      disableArrowRight={false}
      // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
      // disableAllTouchEventsForDisabledDays={true}
      // Replace default month and year title with custom one. the function receive a date as parameter.
      // renderHeader={(date) => {
      //   /*Return JSX*/
      // }}
      // Enable the option to swipe between months. Default = false
      // enableSwipeMonths={false}
      pastScrollRange={3}
      // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={0}
      // Enable or disable scrolling of calendar list
      scrollEnabled={true}
      // Enable or disable vertical scroll indicator. Default = false
      showScrollIndicator={true}
    />
  )
}
