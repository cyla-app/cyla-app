import { NativeModules } from 'react-native'

// This type is determined by app.cyla.decryption.DecryptionModule
type DecryptionModuleType = {
  postDay: (userId: string) => Promise<void>
  setupUserKey: (passphrase?: string) => Promise<void>
  isUserKeyReady: () => Promise<boolean>
  getUserId: () => Promise<string>
}

const DecryptionModule: DecryptionModuleType = NativeModules.DecryptionModule

export default class DecryptionService {
  async postDay(userId: string) {
    await DecryptionModule.postDay(userId)
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
