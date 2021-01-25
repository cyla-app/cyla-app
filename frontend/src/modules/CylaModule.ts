import { NativeModules } from 'react-native'
import { Day } from '../../generated'
import { formatDay } from '../utils/date'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  postDay: (iso8601date: string, userId: string) => Promise<void>
  setupUser: (username?: string, passphrase?: string) => Promise<void>
  isUserSignedIn: () => Promise<boolean>
  getUserId: () => Promise<string>
  fetchDaysByMonths: (months: number) => Promise<string[]>
  fetchDaysByRange: (
    iso8601dateFrom: string,
    iso8601dateTo: string,
  ) => Promise<string[]>
  login: (userName: string, passphrase: string) => Promise<boolean>
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

  async setupUser(username?: string, passphrase?: string) {
    await CylaNativeModule.setupUser(username, passphrase)
  }

  async isUserSignedIn() {
    return await CylaNativeModule.isUserSignedIn()
  }

  async getUserId() {
    return await CylaNativeModule.getUserId()
  }

  async login(userName: string, passphrase: string) {
    return await CylaNativeModule.login(userName, passphrase)
  }
}

export default new CylaModule()
