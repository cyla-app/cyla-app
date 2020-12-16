import { NativeModules } from 'react-native'
import { Day } from '../../generated'
import { format } from 'date-fns'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  postDay: (iso8601date: string, userId: string) => Promise<void>
  setupUserKey: (passphrase?: string) => Promise<void>
  isUserSignedIn: () => Promise<boolean>
  getUserId: () => Promise<string>
  fetchDaysByMonths: (months: number) => Promise<string[]>
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

  async setupUserKey(passphrase?: string) {
    await CylaNativeModule.setupUserKey(passphrase)
  }

  async isUserSignedIn() {
    return await CylaNativeModule.isUserSignedIn()
  }

  async getUserId() {
    return await CylaNativeModule.getUserId()
  }
}

export default new CylaModule()
