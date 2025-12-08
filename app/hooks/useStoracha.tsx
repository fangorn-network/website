'use client'

import * as Client from '@storacha/client'
import * as Delegation from '@storacha/client/delegation'
import { useState, useRef } from 'react'

export function useStoracha() {
  const [uploading, setUploading] = useState(false)
  const clientRef = useRef<Client.Client | null>(null)

  async function getClient() {
    if (clientRef.current) return clientRef.current

    const client = await Client.create()

    // Fetch delegation from your API
    const res = await fetch(`/api/storacha-delegation/${client.agent.did()}`)
    const data = await res.arrayBuffer()

    const delegation = await Delegation.extract(new Uint8Array(data))
    if (!delegation.ok) {
      throw new Error('Failed to extract delegation')
    }

    const space = await client.addSpace(delegation.ok)
    await client.setCurrentSpace(space.did())

    clientRef.current = client
    return client
  }

  async function upload(data: string, filename: string) {
    setUploading(true)
    try {
      const client = await getClient()
      const file = new File([data], filename)
      const cid = await client.uploadFile(file)
      return cid.toString()
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}