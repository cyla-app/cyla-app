import { NativeModules } from 'react-native'
import { Day } from '../../generated'

// This type is determined by app.cyla.decryption.DecryptionModule
type DecryptionModuleType = {
  postDay: (userId: string) => Promise<void>
  setupUserKey: (passphrase?: string) => Promise<void>
  isUserKeyReady: () => Promise<boolean>
  getUserId: () => Promise<string>
  fetchDays: (months: number) => Promise<string[]>
}

const DecryptionModule: DecryptionModuleType = NativeModules.DecryptionModule

export default class DecryptionService {
  async fetchDays(months: number): Promise<Day[]> {
    return (await DecryptionModule.fetchDays(months)).map((json) =>
      JSON.parse(json),
    )
  }

  async postDay(day: Day) {
    await DecryptionModule.postDay(JSON.stringify(day))
  }

  async setupUserKey(passphrase?: string) {
    await DecryptionModule.setupUserKey(passphrase)
  }

  async isUserKeyReady() {
    return await DecryptionModule.isUserKeyReady()
  }

  async getUserId() {
    return await DecryptionModule.getUserId()
  }
}
