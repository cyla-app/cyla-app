import { NativeModules } from 'react-native'
import { Day, Period, PeriodStats } from '../types'
import { formatDay } from '../utils/date'
import minimal from 'protobufjs/minimal'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  setupUserNew: (username: string, passphrase: string) => Promise<void>
  setupUserAndSession: () => Promise<void>
  loadUser: () => Promise<void>
  /**
   * Stores the credentials and logs the user in.
   */
  login: (userName: string, passphrase: string) => Promise<boolean>
  logout: () => Promise<void>
  /**
   * Checks whether credentials are stored
   * */
  isUserSignedIn: () => Promise<boolean>
  getUserId: () => Promise<string>
  saveDay: (
    iso8601date: string,
    dayBase64: string,
    periods: string,
    prevHashValue: string | null,
  ) => Promise<void>
  fetchPeriodStats: () => Promise<{
    periodStats: string
    prevHashValue: string
  }>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

const bin2String = (array: Uint8Array) =>
  String.fromCharCode.apply(String, Array.from(array))

const string2Bin = (str: string) => {
  const result = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    result[i] = str.charCodeAt(i)
  }
  return result
}

class CylaModule {
  async fetchDaysByRange(from: Date, to: Date): Promise<Day[]> {
    const days = await CylaNativeModule.fetchDaysByRange(
      formatDay(from),
      formatDay(to),
    )

    return days.map((base64) => {
      //base64 = base64.replace('\n', '')
      console.log(base64)
      const number = Math.round(minimal.util.base64.length(base64))
      console.log(minimal.util.base64.length(base64))
      const buffer = new Uint8Array(number)
      minimal.util.base64.decode(base64, buffer, 0)
      return Day.decode(buffer)
    })
  }

  async saveDay(day: Day, periods: Period[], prevHashValue: string | null) {
    const periodBuffer = PeriodStats.encode({ periods }).finish()
    const dayBuffer = Day.encode(day).finish()
    await CylaNativeModule.saveDay(
      day.date,
      minimal.util.base64.encode(dayBuffer, 0, dayBuffer.length),
      bin2String(periodBuffer),
      prevHashValue,
    )
  }

  async fetchPeriodStats() {
    const {
      periodStats: periodStatsBinary,
      prevHashValue,
    } = await CylaNativeModule.fetchPeriodStats()
    const binary = string2Bin(periodStatsBinary)
    const periodStats = PeriodStats.decode(binary)
    return { periodStats, prevHashValue }
  }

  async setupUserAndSession() {
    await CylaNativeModule.setupUserAndSession()
  }

  async signUp(username: string, passphrase: string) {
    await CylaNativeModule.setupUserNew(username, passphrase)
  }

  async loadUser() {
    await CylaNativeModule.loadUser()
  }

  async logout() {
    await CylaNativeModule.logout()
  }

  async signIn(userName: string, passphrase: string) {
    return await CylaNativeModule.login(userName, passphrase)
  }

  async isSessionAvailable() {
    return await CylaNativeModule.isUserSignedIn()
  }

  async getUserId() {
    return await CylaNativeModule.getUserId()
  }
}

export default new CylaModule()
