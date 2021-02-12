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
  fetchPeriodStats: () => Promise<[string, string]>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

const base64Decode = (base64: string): Uint8Array => {
  const length = minimal.util.base64.length(base64)
  const buffer = new Uint8Array(length)
  minimal.util.base64.decode(base64, buffer, 0)
  return buffer
}

const base64Encode = (buffer: Uint8Array) => {
  return minimal.util.base64.encode(buffer, 0, buffer.length)
}

class CylaModule {
  async fetchDaysByRange(from: Date, to: Date): Promise<Day[]> {
    const days = await CylaNativeModule.fetchDaysByRange(
      formatDay(from),
      formatDay(to),
    )

    return days.map((base64) => {
      return Day.decode(base64Decode(base64))
    })
  }

  async saveDay(day: Day, periods: Period[], prevHashValue: string | null) {
    const periodBuffer = PeriodStats.encode({ periods }).finish()
    const dayBuffer = Day.encode(day).finish()
    await CylaNativeModule.saveDay(
      day.date,
      base64Encode(dayBuffer),
      base64Encode(periodBuffer),
      prevHashValue,
    )
  }

  async fetchPeriodStats() {
    const [
      periodStatsBinary,
      prevHashValue,
    ] = await CylaNativeModule.fetchPeriodStats()
    const periodStats = PeriodStats.decode(base64Decode(periodStatsBinary))
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
