import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import TargetCross from '../components/cyclechart/TargetCross'
import Label from '../components/cyclechart/Label'
import Grid from '../components/cyclechart/Grid'
import Svg, { Circle } from 'react-native-svg'

import CandleChart from '../components/cyclechart/CandleChart'
import PointChart from '../components/cyclechart/PointChart'
import { format, sub } from 'date-fns'
import React, { useState } from 'react'

const fillEmptyDataPoints = (days: Day[], numberOfDays: number) => {
  const newDays: Day[] = []
  const initialDate = new Date()

  const currentData = Object.fromEntries(days.map((day) => [day.date, day]))

  for (let i = 0; i < numberOfDays; i++) {
    const date = sub(initialDate, { days: i })
    const dateString = format(date, 'yyyy-MM-dd')
    const day = currentData[dateString]
    if (!day) {
      newDays.push({ date: dateString })
    } else {
      newDays.push(day)
    }
  }

  return newDays
}

export default () => {
  const days = fillEmptyDataPoints(
    useSelector<RootState, Day[]>((state) => state.days.days),
    60,
  )

  console.log(days)

  // const translateX = useSharedValue(0)
  // const translateY = useSharedValue(0)
  // const opacity = useSharedValue(0)
  // const onGestureEvent = useAnimatedGestureHandler({
  //   onActive: ({ x, y }) => {
  //     opacity.value = 1
  //     translateY.value = y
  //     translateX.value = x
  //   },
  //   onEnd: () => {
  //     opacity.value = 0
  //   },
  // })

  const viewHeight = 300
  const [viewWidth, setViewWidth] = useState<number>(1000)
  const [offset, setOffset] = useState<number>(0)
  return (
    <View>
      <ScrollView
        style={{ transform: [{ scaleX: -1 }] }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.x >=
            nativeEvent.contentSize.width - Dimensions.get('window').width
          ) {
            setViewWidth(viewWidth + 100)
            setOffset(offset + 100)
          }
        }}>
        <Svg
          style={{ transform: [{ scaleX: -1 }] }}
          width={viewWidth}
          viewBox={`${-offset} 0 ${viewWidth} ${viewHeight}`}
          height={viewHeight}>
          <Grid viewHeight={viewHeight} viewWidth={viewWidth} />
          <CandleChart viewHeight={viewHeight} days={days} />
          <PointChart viewHeight={viewHeight} days={days} />

          {/*<FlatList*/}
          {/*  data={days}*/}
          {/*  renderItem={({ item, index }) => (*/}
          {/*    <Circle cx={index} cy={5} r={10} fill={'red'} />*/}
          {/*  )}*/}
          {/*  keyExtractor={(item) => item.date}*/}
          {/*/>*/}

          {/*<TargetCross*/}
          {/*  opacity={opacity}*/}
          {/*  translateX={translateX}*/}
          {/*  translateY={translateY}*/}
          {/*/>*/}
        </Svg>
      </ScrollView>

      {/*<PanGestureHandler minDist={0} {...{ onGestureEvent }}>*/}
      {/*<Animated.View style={StyleSheet.absoluteFill}>*/}
      {/*  <Label*/}
      {/*    viewHeight={viewHeight}*/}
      {/*    opacity={opacity}*/}
      {/*    translateY={translateY}*/}
      {/*    translateX={translateX}*/}
      {/*  />*/}
      {/*</Animated.View>*/}
      {/*</PanGestureHandler>*/}
    </View>
  )
}
