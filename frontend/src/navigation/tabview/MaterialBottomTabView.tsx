import * as React from 'react'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native'
import {
  BottomNavigation,
  DefaultTheme,
  DarkTheme,
  TouchableRipple,
} from 'react-native-paper'
import {
  NavigationHelpersContext,
  Route,
  TabNavigationState,
  TabActions,
  useTheme,
  ParamListBase,
} from '@react-navigation/native'
import {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from '@react-navigation/material-bottom-tabs/lib/typescript/src/types'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Svg } from 'react-native-svg'
import { Path } from 'react-native-svg'

type TouchableProps = TouchableWithoutFeedbackProps & {
  key: string
  route: any
  children: React.ReactNode
  borderless?: boolean
  centered?: boolean
  rippleColor?: string
}

const Touchable = ({
  style,
  children,
  borderless,
  centered,
  rippleColor,
  onPress,
  testID,
  accessibilityLabel,
  accessibilityTraits,
  accessibilityComponentType,
  accessibilityRole,
  accessibilityState,
}: TouchableProps) =>
  TouchableRipple.supported ? (
    <TouchableRipple
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={accessibilityTraits}
      accessibilityComponentType={accessibilityComponentType}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      borderless={borderless}
      centered={centered}
      rippleColor={rippleColor}
      style={style}>
      {children}
    </TouchableRipple>
  ) : (
    <TouchableWithoutFeedback
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={accessibilityTraits}
      accessibilityComponentType={accessibilityComponentType}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={style}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  )

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>
  navigation: MaterialBottomTabNavigationHelpers
  descriptors: MaterialBottomTabDescriptorMap
}

type Scene = { route: { key: string } }

function MaterialBottomTabViewInner({
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const { dark, colors } = useTheme()
  const theme = React.useMemo(() => {
    const t = dark ? DarkTheme : DefaultTheme

    return {
      ...t,
      colors: {
        ...t.colors,
        ...colors,
        surface: colors.card,
      },
    }
  }, [colors, dark])

  return (
    <BottomNavigation
      {...rest}
      theme={theme}
      navigationState={state}
      onIndexChange={(index: number) =>
        navigation.dispatch({
          ...TabActions.jumpTo(state.routes[index].name),
          target: state.key,
        })
      }
      renderScene={({ route }) => descriptors[route.key].render()}
      renderTouchable={(props) => {
        const { children, route } = props

        const WIDTH = 80
        // @ts-ignore
        return route.name === 'Add_Dummy' ? (
          <View
            key={route.key}
            style={{
              width: WIDTH,
              justifyContent: 'flex-start',
            }}>
            <Svg
              width={160 * (WIDTH / 160)}
              height={80 * (WIDTH / 160)}
              viewBox="0 0 160 80">
              <Path
                fill={colors.background}
                d="M 80,0 V 80 C 41.340068,80 10,48.65993 10,10 10,3.96875 6.6145833,0 0,0 m 80,0 v 80 c 38.65993,0 70,-31.34007 70,-70 0,-6.03125 3.38542,-10 10,-10"
              />
            </Svg>
          </View>
        ) : (
          <Touchable
            onPress={props.onPress}
            route={props.route}
            testID={props.testID}
            accessibilityLabel={props.accessibilityLabel}
            accessibilityTraits={props.accessibilityTraits}
            accessibilityComponentType={props.accessibilityComponentType}
            accessibilityRole={props.accessibilityRole}
            accessibilityState={props.accessibilityState}
            borderless={props.borderless}
            centered={props.centered}
            rippleColor={props.rippleColor}
            style={props.style}
            key={route.key}
            children={children}
          />
        )
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key]

        if (typeof options.tabBarIcon === 'string') {
          return (
            <MaterialCommunityIcons
              name={options.tabBarIcon}
              color={color}
              size={24}
              style={styles.icon}
            />
          )
        }

        if (typeof options.tabBarIcon === 'function') {
          return options.tabBarIcon({ focused, color })
        }

        return null
      }}
      getLabelText={({ route }: Scene) => {
        const { options } = descriptors[route.key]

        return options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : (route as Route<string>).name
      }}
      getColor={({ route }) => descriptors[route.key].options.tabBarColor}
      getBadge={({ route }) => descriptors[route.key].options.tabBarBadge}
      getAccessibilityLabel={({ route }) =>
        descriptors[route.key].options.tabBarAccessibilityLabel
      }
      getTestID={({ route }) => descriptors[route.key].options.tabBarTestID}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        })

        if (event.defaultPrevented) {
          preventDefault()
        }
      }}
    />
  )
}

export default function MaterialBottomTabView(props: Props) {
  return (
    <NavigationHelpersContext.Provider value={props.navigation}>
      <MaterialBottomTabViewInner {...props} />
    </NavigationHelpersContext.Provider>
  )
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  touchable: {
    display: 'flex',
    justifyContent: 'center',
  },
})
