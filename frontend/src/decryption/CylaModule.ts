import { NativeModules } from 'react-native'
import { Day } from '../../generated'

// This type is determined by app.cyla.decryption.CylaModule
type CylaModuleType = {
  postDay: (userId: string) => Promise<void>
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

  async postDay(day: Day) {
    await CylaNativeModule.postDay(JSON.stringify(day))
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
