import { NextResponse } from 'next/server'
import { getMoneyDevKit } from 'mdk-checkout/server/runtime'
import { createCheckout, getCheckout } from 'mdk-checkout/server'

const DEFAULT_NODE_OPTIONS = {
  network: 'signet' as const,
  vssUrl: 'https://vss.staging.moneydevkit.com/vss',
  esploraUrl: 'https://mutinynet.com/api',
  rgsUrl: 'https://rgs.mutinynet.com/snapshot',
  lspNodeId: '03fd9a377576df94cc7e458471c43c400630655083dee89df66c6ad38d1b7acffd',
  lspAddress: '3.21.138.98:9735',
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode')

  try {
    if (mode === 'create-checkout') {
      const checkout = await createCheckout({
        prompt: 'debug checkout',
        amount: 200,
        currency: 'USD',
        metadata: { triggeredAt: new Date().toISOString() },
        baseUrl: process.env.MDK_API_BASE_URL,
        network: DEFAULT_NODE_OPTIONS.network,
        vssUrl: DEFAULT_NODE_OPTIONS.vssUrl,
        esploraUrl: DEFAULT_NODE_OPTIONS.esploraUrl,
        rgsUrl: DEFAULT_NODE_OPTIONS.rgsUrl,
        lspNodeId: DEFAULT_NODE_OPTIONS.lspNodeId,
        lspAddress: DEFAULT_NODE_OPTIONS.lspAddress,
      })

      return NextResponse.json({ ok: true, checkout })
    }

    if (mode === 'get-checkout') {
      const checkoutId = url.searchParams.get('id') ?? 'non-existent'
      const checkout = await getCheckout(checkoutId)
      return NextResponse.json({ ok: true, checkout })
    }

    const mdk = getMoneyDevKit({
      baseUrl: process.env.MDK_API_BASE_URL,
      nodeOptions: DEFAULT_NODE_OPTIONS,
    })

    const nodeId = mdk.getNodeId()

    return NextResponse.json({ ok: true, nodeId })
  } catch (error) {
    console.error('debug-vss GET error', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    const stack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        ok: false,
        message,
        stack,
      },
      { status: 500 },
    )
  }
}
