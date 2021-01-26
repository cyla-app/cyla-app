import { NativeModules } from 'react-native'
import { Day } from '../../generated'
import { formatDay } from '../utils/date'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  /**
   * If username or passphrase are null then we try to login using the stored credentials.
   * If both are not null then we create a new user and register it.
   */
  setupUser: (username?: string, passphrase?: string) => Promise<void>
  /**
   * Stores the credentials and logs the user in.
   */
  login: (userName: string, passphrase: string) => Promise<boolean>
  /**
   * Checks whether credentials are stored
   * */
  isUserSignedIn: () => Promise<boolean>
  getUserId: () => Promise<string>
  postDay: (iso8601date: string, userId: string) => Promise<void>
  fetchDaysByMonths: (months: number) => Promise<string[]>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

class CylaModule {
  async fetchDaysByRange(from: Date, to: Date): Promise<Day[]> {
    const jsons = await CylaNativeModule.fetchDaysByRange(
      formatDay(from),
      formatDay(to),
    )
    return jsons.map((json) => JSON.parse(json))
  }

  async saveDay(date: Date, day: Day) {
    await CylaNativeModule.postDay(formatDay(date), JSON.stringify(day))
  }

  async reuseLastSession() {
    await CylaNativeModule.setupUser(undefined, undefined)
  }

  async signUp(username: string, passphrase: string) {
    await CylaNativeModule.setupUser(username, passphrase)
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
