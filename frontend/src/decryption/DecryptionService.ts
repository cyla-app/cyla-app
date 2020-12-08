import { NativeModules } from 'react-native'

// This type is determined by app.cyla.decryption.DecryptionModule
type DecryptionModuleType = {
  fetchUserBlob: (userId: string) => Promise<void>
  setupUserKey: (passphrase?: string) => Promise<void>
}

const DecryptionModule: DecryptionModuleType = NativeModules.DecryptionModule

export default class DecryptionService {
  async fetchUserBlob(userId: string) {
    await DecryptionModule.fetchUserBlob(userId)
  }

  async setupUserKey() {
    await DecryptionModule.setupUserKey('super_secert_password')
  }
}
