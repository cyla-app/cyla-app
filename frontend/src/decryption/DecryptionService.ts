import { NativeModules } from 'react-native'

// This type is determined by app.cyla.decryption.DecryptionModule
type DecryptionModuleType = {
  fetchUserBlob: (userId: string) => Promise<void>
  setupUserKey: (passphrase?: string) => Promise<void>
  isUserKeyReady: () => Promise<boolean>
}

const DecryptionModule: DecryptionModuleType = NativeModules.DecryptionModule

export default class DecryptionService {
  async fetchUserBlob(userId: string) {
    await DecryptionModule.fetchUserBlob(userId)
  }

  async setupUserKey(passphrase?: string) {
    await DecryptionModule.setupUserKey(passphrase)
  }

  async isUserKeyReady() {
    return await DecryptionModule.isUserKeyReady()
  }
}
