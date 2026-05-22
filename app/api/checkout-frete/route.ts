import { NextResponse } from 'next/server'

const PARADISE_BASE = 'https://multi.paradisepags.com'
const PARADISE_API_KEY = process.env.PARADISE_API_KEY || 'sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae'
const PRODUCT_HASH = process.env.PARADISE_PRODUCT_HASH || 'prod_a1bf7e58125dc426'
const ACCOUNT_ID = process.env.PARADISE_ACCOUNT_ID || '7621'

// R$ 21,35 em centavos
const FRETE_CORRECTION_CENTS = 2135

export async function POST() {
  const reference = `FRETE-${ACCOUNT_ID}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  const payload = {
    amount: FRETE_CORRECTION_CENTS,
    description: 'Correção de frete do pedido',
    reference,
    productHash: PRODUCT_HASH,
    customer: {
      name: 'Cliente ZYRON',
      email: 'cliente@zyron.com.br',
      phone: '11999999999',
      document: '00000000000',
    },
  }

  try {
    const res = await fetch(`${PARADISE_BASE}/api/v1/transaction.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PARADISE_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let data: Record<string, unknown>
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!res.ok) {
      console.error('[Paradise Frete] Erro:', data)
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json({
      transaction_id: data.transaction_id,
      qr_code: data.qr_code,
      amount: FRETE_CORRECTION_CENTS,
      reference,
    })
  } catch (err) {
    console.error('[Paradise Frete] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
