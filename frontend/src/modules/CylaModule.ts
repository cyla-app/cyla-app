import { NativeModules } from 'react-native'
import { Day, Period, PeriodStats } from '../types'
import { formatDay } from '../utils/date'
import minimal from 'protobufjs/minimal'
import { PeriodStatsDTO } from '../../generated/period-stats'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  setApiBaseUrl: (apiBaseUrl: string) => Promise<void>
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
  fetchPeriodStats: () => Promise<[string, string] | null>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
  shareData: (iso8601dateFrom: string, iso8601dateTo: string) => Promise<string>
  changePassword: (prevPwd: string, newPwd: string) => Promise<void>
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
  async setApiBaseUrl(apiBaseUrl: string): Promise<void> {
    await CylaNativeModule.setApiBaseUrl(apiBaseUrl)
  }

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
    // Use padding other than day date?
    const periodBuffer = PeriodStatsDTO.encode({
      periodStats: { periods },
      padding: day.date,
    }).finish()
    const dayBuffer = Day.encode(day).finish()
    await CylaNativeModule.saveDay(
      day.date,
      base64Encode(dayBuffer),
      base64Encode(periodBuffer),
      prevHashValue,
    )
  }

  async fetchPeriodStats(): Promise<{
    periodStats: PeriodStats
    prevHashValue: string | null
  }> {
    const fetchedPeriodStats = await CylaNativeModule.fetchPeriodStats()

    if (!fetchedPeriodStats) {
      return { periodStats: { periods: [] }, prevHashValue: null }
    }

    const [periodStatsBinary, prevHashValue] = fetchedPeriodStats
    const periodStats = PeriodStatsDTO.decode(base64Decode(periodStatsBinary))
      .periodStats
    if (!periodStats) {
      return { periodStats: { periods: [] }, prevHashValue }
    }
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

  async shareData(startDate: Date, endDate: Date) {
    return await CylaNativeModule.shareData(
      formatDay(startDate),
      formatDay(endDate),
    )
  }

  async changePwd(prevPwd: string, newPwd: string) {
    return await CylaNativeModule.changePassword(prevPwd, newPwd)
  }
}

export default new CylaModule()
