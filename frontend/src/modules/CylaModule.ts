import { NativeModules } from 'react-native'
import { Day, Period } from '../types'
import {
  PeriodStats as PeriodStatsProto,
  Period as PeriodProto,
} from '../../generated/period-stats_pb'
import { formatDay } from '../utils/date'

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
    userId: string,
    periods: string,
    prevHashValue: string | null,
  ) => Promise<void>
  fetchPeriodStats: () => Promise<{
    periodStats: string
    prevHashValue: string
  }>
  fetchDaysByMonths: (months: number) => Promise<string[]>
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
    const jsons = await CylaNativeModule.fetchDaysByRange(
      formatDay(from),
      formatDay(to),
    )
    return jsons.map((json) => JSON.parse(json))
  }

  async saveDay(day: Day, periods: Period[], prevHashValue: string | null) {
    const stats = new PeriodStatsProto()
    stats.setPeriodsList(
      periods.map((period) => {
        const periodProto = new PeriodProto()
        periodProto.setFrom(period.from)
        periodProto.setTo(period.to)
        return periodProto
      }),
    )
    const binary = stats.serializeBinary()
    await CylaNativeModule.saveDay(
      day.date,
      JSON.stringify(day),
      bin2String(binary),
      prevHashValue,
    )
  }

  async fetchPeriodStats() {
    const {
      periodStats: periodStatsBinary,
      prevHashValue,
    } = await CylaNativeModule.fetchPeriodStats()
    const binary = string2Bin(periodStatsBinary)
    const periodStats = PeriodStatsProto.deserializeBinary(binary).toObject()
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
