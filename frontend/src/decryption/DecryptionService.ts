import { NativeModules } from 'react-native'

// This type is determined by app.cyla.decryption.DecryptionModule
type DecryptionModuleType = {
  fetchUserBlob: (userId: string) => Promise<void>
}

const DecryptionModule: DecryptionModuleType = NativeModules.DecryptionModule

export default class DecryptionService {
  async fetchUserBlob(userId: string) {
    await DecryptionModule.fetchUserBlob(userId)
  }
}
