import * as React from 'react'
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
  TabActionHelpers,
  ParamListBase,
} from '@react-navigation/native'

import MaterialBottomTabView from './MaterialBottomTabView'
import { MaterialBottomTabNavigationOptions } from '@react-navigation/material-bottom-tabs'
import {
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationEventMap,
} from '@react-navigation/material-bottom-tabs/lib/typescript/src/types'

type Props = DefaultNavigatorOptions<MaterialBottomTabNavigationOptions> &
  TabRouterOptions &
  MaterialBottomTabNavigationConfig

function MaterialBottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
    MaterialBottomTabNavigationOptions,
    MaterialBottomTabNavigationEventMap
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  })

  return (
    <MaterialBottomTabView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  )
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  typeof MaterialBottomTabNavigator
>(MaterialBottomTabNavigator)
