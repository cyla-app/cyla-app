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
  setupUserKeyBackup: (userName: string, passphrase: string) => Promise<void>
  login: () => Promise<boolean>
}

const CylaNativeModule: CylaModuleType = NativeModules.CylaModule

class CylaModule {
  async fetchDaysByMonths(months: number): Promise<Day[]> {
    const jsons = await CylaNativeModule.fetchDaysByMonths(months)
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

  async login() {
    return await CylaNativeModule.login()
  }
}

export default new CylaModule()
