import { NextRequest, NextResponse } from 'next/server'

const ASSET_BASE = 'https://api.assetpay.com.br'
const ASSET_SECRET = process.env.ASSET_SECRET_KEY || 'sk_live_v2CAmnON0LM6dskyK3FGTNrU1x4qBrP6vR'

// R$ 21,35 em centavos
const FRETE_CORRECTION_CENTS = 2135

export async function POST(request: NextRequest) {
  let customerName = 'Cliente ZYRON'
  let customerEmail = 'cliente@zyron.com.br'
  let customerCpf = '00000000000'
  let customerPhone = '11999999999'

  // Tenta ler dados do cliente passados pelo frontend (sessão do pedido original)
  try {
    const body = await request.json()
    if (body.name) customerName = body.name
    if (body.email) customerEmail = body.email
    if (body.cpf) customerCpf = String(body.cpf).replace(/\D/g, '')
    if (body.phone) customerPhone = String(body.phone).replace(/\D/g, '')
  } catch {
    // usa fallback acima
  }

  const externalRef = `FRETE-ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const payload = {
    amount: FRETE_CORRECTION_CENTS,
    paymentMethod: 'PIX',
    externalRef,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      document: {
        type: 'CPF',
        number: customerCpf,
      },
    },
    items: [
      {
        title: 'Correção de frete do pedido ZYRON',
        unitPrice: FRETE_CORRECTION_CENTS,
        quantity: 1,
        type: 'physical',
      },
    ],
    pix: {
      expiresInDays: 1,
    },
    metadata: {
      origem: 'upsell-frete',
    },
  }

  try {
    const res = await fetch(`${ASSET_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ASSET_SECRET}`,
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
      console.error('[AssetPay Frete] Erro:', data)
      return NextResponse.json(data, { status: res.status })
    }

    const pix = data.pix as Record<string, string> | undefined

    return NextResponse.json({
      transaction_id: data.id,
      qr_code: pix?.qrcode || '',
      qr_code_url: pix?.qrcodeUrl || '',
      amount: FRETE_CORRECTION_CENTS,
      expires_at: pix?.expirationDate || '',
      external_ref: externalRef,
    })
  } catch (err) {
    console.error('[AssetPay Frete] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
