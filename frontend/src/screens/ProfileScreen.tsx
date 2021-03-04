import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import CylaModule from '../modules/CylaModule'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { List, Headline } from 'react-native-paper'
import { logout } from '../sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import Svg, { Path, ClipPath, Circle, Defs, G } from 'react-native-svg'

type ProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignIn'
>

type PropType = {
  navigation: ProfileScreenNavigationProp
}

export default ({ navigation }: PropType) => {
  const [userId, setUserId] = useState<string>('Unknown')
  const [userName, setUserName] = useState<string>('Unknown')
  const daysLoaded = useSelector<RootState, number>(
    (state) => Object.keys(state.days.byDay).length,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(await CylaModule.getUserId())
    }
    const fetchUsername = async () => {
      setUserName(await CylaModule.getUserName())
    }

    fetchUserId()
    fetchUsername()
  }, [])

  return (
    <ScrollView scrollEnabled={true} contentContainerStyle={{}}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Svg width="256" height="256" viewBox="0 0 480 480">
          <Defs>
            <ClipPath id="clip">
              <Circle cx="50%" cy="50%" r="40%" />
            </ClipPath>
          </Defs>

          <G clipPath="url(#clip)">
            <Path
              fill="#ffdfba"
              d="M394.001 424.74V464c0 4.42-3.58 8-8 8h-292c-4.42 0-8-3.58-8-8v-39.26c0-30.19 17.95-56.2 43.76-67.93-10.531-8.379-26.582-19.641-38.26-43.87-16.265-33.698-13.481-73.452 7.24-104.57a102.852 102.852 0 0017.26-57.04V108c0-55.23 44.77-100 100-100h48c55.23 0 100 44.77 100 100 0 45.887-1.121 54.873 4.41 73.12 7.805 25.801 18.114 28.993 26.06 55.25 12.491 41.274-1.325 86.287-35.37 113.39l-8.86 7.05c25.81 11.73 43.76 37.74 43.76 67.93z"
            />
            <Path
              fill="#ffaa64"
              d="M394.001 424.74V464a8 8 0 01-8 8h-292a8 8 0 01-8-8v-39.26c0-41.162 33.369-74.57 74.57-74.57 6.13 0 11.95-1.33 17.18-3.71l.25.54 57.103 44.208a8.001 8.001 0 009.795 0L302.001 347l.25-.54a41.383 41.383 0 0017.18 3.71c41.042 0 74.57 33.249 74.57 74.57z"
            />
            <Path
              fill="#ffebd2"
              d="M331.43 154.258c4.247.242 7.571 3.732 7.571 7.986v47.886c0 41.27-25.25 76.64-61.15 91.5-64.917 26.947-136.85-20.924-136.85-91.5v-47.19c0-4.689 4.016-8.394 8.686-7.971 47.987 4.351 95.242-7.767 134.923-34.499 4.513-3.04 10.727-.788 12.152 4.464 4.937 18.194 18.4 28.397 34.668 29.324z"
            />
            <Path
              fill="#42434d"
              d="M359.102 349.76l-8.86 7.05c-9.39-4.26-19.82-6.64-30.81-6.64-22.829 0-41.43-18.435-41.43-41.34V302l-.15-.37c35.9-14.86 61.15-50.23 61.15-91.5v-47.886c0-4.254-3.325-7.744-7.571-7.986-16.168-.921-29.699-11.013-34.667-29.323-1.425-5.252-7.639-7.504-12.152-4.464-39.655 26.714-86.907 38.852-134.923 34.499-4.67-.423-8.686 3.282-8.686 7.971v47.19c0 41.27 25.25 76.64 61.15 91.5l-.15.37v6.83c0 22.901-18.596 41.34-41.43 41.34-10.99 0-21.42 2.38-30.81 6.64l-8.86-7.05c-43.011-34.272-52.588-95.695-22.16-141.39a102.852 102.852 0 0017.26-57.04V108c0-55.228 44.772-100 100-100h48c55.228 0 100 44.772 100 100v43.33c0 20.276 6 40.14 17.26 57.04 30.538 45.862 20.687 107.278-22.161 141.39z"
            />
            <Path
              fill="#ffd6a6"
              d="M279.132 318.42c-24.637 10.313-51.712 11.113-78.26 0 1.356-5.626 1.13-9.27 1.13-16.42l.15-.37c24.082 9.996 51.571 10.016 75.7 0l.15.37c-.001 7.153-.226 10.796 1.13 16.42z"
            />
            <Path
              fill="#4d4e59"
              d="M309.177 18.762c10.212 5.18 5.774 20.767-5.626 19.688-3.143-.298-6.329-.45-9.55-.45h-48c-55.228 0-100 44.772-100 100v12.168c0 7.184-5 6.952-5 12.772 0 52.822.214 49.478-.561 51.757-7.845 23.078-17.266 26.418-24.909 51.673a105.707 105.707 0 00-3.951 41.669c1.177 11.22-14.446 16.587-20.079 4.901-16.149-33.457-13.62-73.243 7.24-104.57a102.852 102.852 0 0017.26-57.04V108c0-55.228 44.772-100 100-100h48c16.257 0 31.607 3.879 45.176 10.762z"
            />
            <Path
              fill="#fff3e4"
              d="M221.023 276.449c14.939 10 3.553 33.13-13.41 27.177-37.286-13.084-66.611-47.883-66.611-93.497v-47.19c0-4.69 4.02-8.39 8.69-7.97 3.832.348 8.039.622 12.581.761 8.219.25 14.729 7.037 14.729 15.26v23.14c0 34.826 17.756 64.738 44.021 82.319z"
            />
            <Path
              fill="#ffbd7b"
              d="M194.495 359.769c4.746 3.674 2.238 11.378-3.764 11.401-42.333.158-74.729 34.149-74.729 74.57V472h-22a8 8 0 01-8-8v-39.26c0-41.163 33.37-74.57 74.57-74.57 6.13 0 11.95-1.33 17.18-3.71l.25.54z"
            />
            <Path
              fill="#faa157"
              d="M285.508 359.769c-4.746 3.674-2.238 11.378 3.764 11.401 42.333.158 74.729 34.149 74.729 74.57V472h22a8 8 0 008-8v-39.26c0-41.163-33.37-74.57-74.57-74.57-6.13 0-11.95-1.33-17.18-3.71l-.25.54z"
            />
            <Path d="M402.001 424.743V472a8 8 0 01-16 0v-47.257c0-36.794-29.775-66.572-66.573-66.571-17.411 0-33.208-8.87-42.258-23.728a8 8 0 012.67-10.994 8 8 0 0110.994 2.67c6.123 10.051 16.812 16.051 28.594 16.051 45.637 0 82.573 36.93 82.573 82.572zm-133.47-61.948l-28.53 22.087-48.508-37.555c10.471-8.411 17.242-20.645 18.339-34.54a106.681 106.681 0 0030.17 4.337c59 0 107-48 107-107 0-.622.014-56.012-.026-56.632-.272-4.328-3.881-7.493-7.974-7.493-1.37 0-11.227 1.95-20.876-3.855-15.048-9.053-15.125-28.897-15.124-29.096.039-6.5-7.311-10.336-12.622-6.579-32.952 23.327-71.536 39.145-113.433 45.01a8 8 0 001.1 15.924c1.26 0 27.2-3.175 56.687-13.885a274.296 274.296 0 0054.268-26.833c5.897 22.126 22.434 34.435 42.001 35.546v47.893c0 50.178-40.822 91-91 91s-91-40.822-91-91V154a8 8 0 00-16 0v56.125c0 42.542 24.958 79.362 61 96.595v2.11c0 18.441-14.944 33.341-33.427 33.341a82.533 82.533 0 00-29.526 5.437l-5.165-4.111c-40.531-32.259-48.122-89.207-20.481-130.698 11.78-17.683 18.599-38.833 18.599-61.462v-43.333c0-50.731 41.271-92.004 92-92.004h48c50.729 0 92 41.271 92 92v43.333c0 22.011 6.401 43.221 18.511 61.336 22.148 33.131 22.104 76.614-.781 109.822a8 8 0 0013.173 9.079c26.641-38.655 26.672-89.254.909-127.793-10.345-15.475-15.813-33.609-15.813-52.444V108c0-59.551-48.449-108-108-108h-48c-59.551 0-108 48.451-108 108.004v43.329a94.565 94.565 0 01-15.916 52.597c-32.255 48.422-23.114 114.278 23.327 151.671-22.814 14.966-37.411 40.382-37.411 69.142V472a8 8 0 0016 0v-47.257c0-36.795 29.775-66.572 66.573-66.571 5.302 0 10.54-.841 15.563-2.498l58.966 45.651a8.001 8.001 0 009.795 0l33.427-25.879a8 8 0 00-9.795-12.651z" />
          </G>
          <Circle cx="50%" cy="50%" r="40%" stroke={'black'} strokeWidth={2} />
        </Svg>
        <Headline>{userName}</Headline>
      </View>
      <List.Item
        title="Share Medical Data"
        description="Creates a private link with the data you want to share"
        left={(props) => <List.Icon {...props} icon="share-outline" />}
        onPress={() => {
          navigation.navigate('Share')
        }}
      />
      <List.Item
        title="Change Password"
        description="Changes your password"
        left={(props) => <List.Icon {...props} icon="lock-outline" />}
        onPress={() => {
          navigation.navigate('ChangePassphrase')
        }}
      />
      <List.Item
        title="Logout"
        description="Deletes all data from your device and logs you out"
        left={(props) => <List.Icon {...props} icon="logout" />}
        onPress={() => {
          dispatch(logout())
        }}
      />
      {__DEV__ ? (
        <>
          <List.Item
            title="User Id"
            description={userId}
            left={(props) => <List.Icon {...props} icon="developer-board" />}
          />
          <List.Item
            title="Days Loaded"
            description={String(daysLoaded)}
            left={(props) => <List.Icon {...props} icon="developer-board" />}
          />
        </>
      ) : null}
    </ScrollView>
  )
}
