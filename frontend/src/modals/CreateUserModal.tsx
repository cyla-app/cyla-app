import DecryptionService from '../decryption/DecryptionService'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import PasswordModal from '../components/PasswordModal'

export default () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [setupFinished, setSetupFinished] = useState<boolean>(false)
  const [setupError, setSetupError] = useState<string | null>(null)

  useEffect(() => {
    const retrieveUserKey = async () => {
      setLoading(true)
      try {
        const decryptionService = new DecryptionService()
        const isReady = await decryptionService.isUserKeyReady()

        if (isReady) {
          await decryptionService.setupUserKey()
          setSetupFinished(true)
        }
      } finally {
        setLoading(false)
      }
    }

    retrieveUserKey().catch((e: Error) => {
      setSetupError(e.message)
    })
  }, [])

  if (setupError) {
    return <Text>{setupError}</Text>
  }

  if (setupFinished) {
    return null
  }

  return (
    <PasswordModal
      loading={loading}
      onSave={(passphrase: string) => {
        setLoading(true)
        new DecryptionService()
          .setupUserKey(passphrase)
          .then(() => {
            setSetupFinished(true)
            setLoading(false)
          })
          .catch((e: Error) => {
            setSetupError(e.message)
            setLoading(false)
          })
      }}
    />
  )
}
