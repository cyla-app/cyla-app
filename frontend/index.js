/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { enableScreens } from 'react-native-screens'

// https://github.com/software-mansion/react-native-screens/blob/515abcc1b92057eb09a3effd9b27b5e017becda5/README.md#usage-with-react-navigation
enableScreens()

AppRegistry.registerComponent(appName, () => App)
