import { NextRequest, NextResponse } from 'next/server'

const ASSET_BASE = 'https://api.assetpay.com.br/api/v1'
const ASSET_SECRET = process.env.ASSET_SECRET_KEY || 'sk_live_v2CAmnON0LM6dskyK3FGTNrU1x4qBrP6vR'
const ASSET_PUBLIC = process.env.ASSET_PUBLIC_KEY || 'pk_live_v2WDE8HrFOG67vd4809cEJcVUzLvx0jZk5'
const ASSET_AUTH = `Basic ${Buffer.from(`${ASSET_SECRET}:${ASSET_PUBLIC}`).toString('base64')}`

const onlyDigits = (s: string) => String(s || '').replace(/\D/g, '')

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const cpf = onlyDigits(body.cpf)
  const phone = onlyDigits(body.phone)
  const freteVal = Number(body.frete || 0)

  const SUBTOTAL_CENTS = 12790 // R$ 127,90
  const freteCents = Math.round(freteVal * 100)
  const totalCents = SUBTOTAL_CENTS + freteCents

  if (!body.name || !body.email || cpf.length !== 11) {
    return NextResponse.json(
      { error: 'Validação', message: 'Nome, e-mail e CPF são obrigatórios.' },
      { status: 400 }
    )
  }

  const externalRef = `ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const payload = {
    amount: totalCents,
    paymentMethod: 'PIX',
    externalRef,
    postbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://v0-loja-zyron.vercel.app'}/api/webhook`,
    customer: {
      name: body.name,
      email: body.email,
      phone: phone || '11999999999',
      document: {
        type: 'CPF',
        number: cpf,
      },
    },
    address: body.cep ? {
      zipCode: body.cep,
      street: body.street || '',
      number: body.addressNumber || 'S/N',
      complement: body.complement || '',
      neighborhood: body.neighborhood || '',
      city: body.city || '',
      state: body.state || '',
      country: 'Brasil',
    } : undefined,
    items: [
      {
        title: 'Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5',
        description: `Tamanho: ${body.size || ''}`,
        unitPrice: totalCents,
        quantity: 1,
        type: 'physical',
      },
    ],
    pix: {
      expiresInDays: 1,
    },
    metadata: {
      size: body.size || '',
      origem: 'checkout',
    },
  }

  try {
    const res = await fetch(`${ASSET_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ASSET_AUTH,
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
      console.error('[AssetPay] Erro na criação:', data)
      return NextResponse.json(data, { status: res.status })
    }

    const pix = data.pix as Record<string, string> | undefined

    return NextResponse.json({
      transaction_id: data.id,
      qr_code: pix?.qrcode || '',
      qr_code_url: pix?.qrcodeUrl || '',
      amount: data.amount,
      expires_at: pix?.expirationDate || '',
      external_ref: externalRef,
    })
  } catch (err) {
    console.error('[AssetPay] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
