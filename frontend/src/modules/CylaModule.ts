import { NativeModules } from 'react-native'
import { Day } from '../../generated'
import { formatDay } from '../utils/date'
import { IPeriod, PeriodStats } from '../../generated/protobuf'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  setupUserNew: (username: string, passphrase: string) => Promise<void>
  setupUserAndSession: () => Promise<void>
  loadUser: () => Promise<void>
  /**
   * Stores the credentials and logs the user in.
   */
  login: (userName: string, passphrase: string) => Promise<boolean>
  /**
   * Checks whether credentials are stored
   * */
  isUserSignedIn: () => Promise<boolean>
  getUserId: () => Promise<string>
  saveDay: (
    iso8601date: string,
    userId: string,
    periods: string,
  ) => Promise<void>
  fetchDaysByMonths: (months: number) => Promise<string[]>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

const bin2String = (array: Uint8Array) =>
  String.fromCharCode.apply(String, Array.from(array))

class CylaModule {
  async fetchDaysByRange(from: Date, to: Date): Promise<Day[]> {
    const jsons = await CylaNativeModule.fetchDaysByRange(
      formatDay(from),
      formatDay(to),
    )
    return jsons.map((json) => JSON.parse(json))
  }

  async saveDay(day: Day, periods: IPeriod[]) {
    const byteArray = PeriodStats.encode(
      new PeriodStats({ test: 0xffffff, periods }),
    ).finish()
    await CylaNativeModule.saveDay(
      day.date,
      JSON.stringify(day),
      bin2String(byteArray),
    )
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
