import * as Client from '@storacha/client'
import { StoreMemory } from '@storacha/client/stores/memory'
import * as Proof from '@storacha/client/proof'
import { Signer } from '@storacha/client/principal/ed25519'
import * as DID from '@ipld/dag-ucan/did'
import { ServiceAbility } from '@storacha/client/types'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ did: string }> }
) {
    const { did } = await params

    const principal = Signer.parse(process.env.NEXT_PUBLIC_STORAGE_PRIVATE_KEY || '')
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    const proof = await Proof.parse(process.env.NEXT_PUBLIC_STORAGE_PROOF || '')
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    // Delegate to the user's agent
    const audience = DID.parse(did)
    const abilities: ServiceAbility[] = [
        'space/blob/add',
        'space/index/add',
        'filecoin/offer',
        'upload/add'
    ]

    const expiration = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour

    const delegation = await client.createDelegation(audience, abilities, { expiration })
    const archive = await delegation.archive()

    if (!archive.ok) {
        return new Response('Failed to create delegation', { status: 500 })
    }

    return new Response(Buffer.from(archive.ok), {
        headers: { 'Content-Type': 'application/octet-stream' }
    })
}