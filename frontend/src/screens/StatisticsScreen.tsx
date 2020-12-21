import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dimensions } from 'react-native'
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import Svg, { Line, Rect, Text } from 'react-native-svg'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import { useTheme } from 'react-native-paper'
import { format } from 'date-fns'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { ReText } from 'react-native-redash'

export const { width: SIZE } = Dimensions.get('window')
export const DOMAIN = [36, 40]
const MARGIN = 2

export const scaleY = (value: number) => {
  'worklet'
  return interpolate(value, DOMAIN, [SIZE, 0], Extrapolate.CLAMP)
}

export const scaleBody = (value: number) => {
  'worklet'
  return interpolate(
    value,
    [0, Math.max(...DOMAIN) - Math.min(...DOMAIN)],
    [0, SIZE],
    Extrapolate.CLAMP,
  )
}

interface CandleProps {
  name: string
  dayStart: number
  dayEnd: number
  index: number
  width: number
}

const Candle = ({ name, dayStart, dayEnd, index, width }: CandleProps) => {
  const { colors } = useTheme()
  const fill =
    dayEnd > dayStart ? colors.statisticsPositive : colors.statisticsNegative
  const x = index * width
  const max = Math.max(dayStart, dayEnd)
  const min = Math.min(dayStart, dayEnd)
  return (
    <>
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        fill={fill}
      />
      <Text fill="black" x={x + MARGIN} y={scaleY(0)}>
        {name}
      </Text>
    </>
  )
}

const Grid = () => {
  return (
    <>
      {[...Array(10).keys()].map((i) => {
        const y = i + 36
        return (
          <Line
            key={i}
            x1={0}
            x2={500}
            y1={scaleY(y)}
            y2={scaleY(y)}
            strokeWidth={1}
            stroke={'grey'}
          />
        )
      })}
    </>
  )
}

const Chart = ({ days }: { days: Day[] }) => {
  if (days.length === 0) {
    return null
  }

  const temperatures: [
    number | undefined,
    Day,
    number | undefined,
  ][] = days.map((day, index) => {
    let DEFAULT_TEMPERATURE = 36
    if (index === days.length - 1) {
      return [day.temperature?.value, day, DEFAULT_TEMPERATURE]
    }

    if (index === 0) {
      return [DEFAULT_TEMPERATURE, day, days[index + 1].temperature?.value]
    }

    return [day.temperature?.value, day, days[index + 1].temperature?.value]
  })

  console.log(temperatures)

  return (
    <Svg width={SIZE} height={SIZE}>
      <Grid />
      {temperatures.map(([dayStart, day, dayEnd], index) =>
        dayStart && dayEnd ? (
          <Candle
            name={format(new Date(day.date), 'dd')}
            key={day.date}
            width={SIZE / temperatures.length}
            dayStart={dayStart}
            dayEnd={dayEnd}
            index={index}
          />
        ) : null,
      )}
    </Svg>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignSelf: 'flex-end',
    backgroundColor: '#FEFFFF',
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

interface LabelProps {
  translateY: Animated.SharedValue<number>
  opacity: Animated.SharedValue<number>
}

const Label = ({ translateY, opacity }: LabelProps) => {
  const text = useDerivedValue(() => {
    return String(Math.round(translateY.value))
  })

  const horizontal = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
  return (
    <Animated.View style={[styles.container, horizontal]}>
      <ReText {...{ text }} />
    </Animated.View>
  )
}

export default () => {
  const days = useSelector<RootState, Day[]>((state) => state.days.days)

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ x, y }) => {
      opacity.value = 1
      translateY.value = y
      translateX.value = x
    },
    onEnd: () => {
      opacity.value = 0
    },
  })

  const horizontal = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
  const vertical = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View>
      <Chart days={days.slice(-14)} />
      <PanGestureHandler minDist={0} {...{ onGestureEvent }}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View style={[StyleSheet.absoluteFill, horizontal]}>
            <Line x={SIZE} y={0} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, vertical]}>
            <Line x={0} y={SIZE} />
          </Animated.View>
          <Label {...{ translateY, opacity }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}
