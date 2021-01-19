import { NativeModules } from 'react-native'
import { Day } from '../../generated'
import { format } from 'date-fns'

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
  setupUserKeyBackup: (userName: string, passphrase: string) => Promise<void>
  login: (userName: string, passphrase: string) => Promise<boolean>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

class CylaModule {
  async fetchDaysByRange(from: Date, to: Date): Promise<Day[]> {
    const jsons = await CylaNativeModule.fetchDaysByRange(
      format(from, 'yyyy-MM-dd'),
      format(to, 'yyyy-MM-dd'),
    )
    return jsons.map((json) => JSON.parse(json))
  }

  async postDay(date: Date, day: Day) {
    await CylaNativeModule.postDay(
      format(date, 'yyyy-MM-dd'),
      JSON.stringify(day),
    )
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

  async setupUserKeyBackup(userName: string, passphrase: string) {
    return await CylaNativeModule.setupUserKeyBackup(userName, passphrase)
  }

  async login(userName: string, passphrase: string) {
    return await CylaNativeModule.login(userName, passphrase)
  }
}

export default new CylaModule()
