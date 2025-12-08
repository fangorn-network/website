import * as Client from '@web3-storage/w3up-client'
import { parse } from '@web3-storage/w3up-client/proof'
import * as Signer from '@ucanto/principal/ed25519'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'

// These come from your CLI setup (store as env vars or constants)
const PRIVATE_KEY = process.env.STORAGE_PRIVATE_KEY || ''
const PROOF = process.env.STORAGE_PROOF || ''

async function uploadToStoracha(ciphertext: string, filename: string) {
    // const principal = Signer.parse(PRIVATE_KEY)
    // const client = await Client.create({ principal })

    const principal = Signer.parse(PRIVATE_KEY)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })


    // Load the delegation proof
    const proof = await parse(PROOF)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    // Upload
    const file = new File([ciphertext], filename)
    const cid = await client.uploadFile(file)
    console.log('Uploaded:', cid.toString())
    return cid
}

export default uploadToStoracha;