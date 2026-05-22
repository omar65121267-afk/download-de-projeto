import { NextRequest, NextResponse } from 'next/server'

const PARADISE_BASE = 'https://multi.paradisepags.com'
const PARADISE_API_KEY = process.env.PARADISE_API_KEY || 'sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae'
const PRODUCT_HASH = process.env.PARADISE_PRODUCT_HASH || 'prod_a1bf7e58125dc426'
const ACCOUNT_ID = process.env.PARADISE_ACCOUNT_ID || '7621'

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

  const SUBTOTAL_CENTS = 12790 // R$ 127,90 em centavos
  const freteCents = Math.round(freteVal * 100)
  const totalCents = SUBTOTAL_CENTS + freteCents

  if (!body.name || !body.email || cpf.length !== 11) {
    return NextResponse.json(
      { error: 'Validação', message: 'Nome, e-mail e CPF são obrigatórios.' },
      { status: 400 }
    )
  }

  const reference = `REF-${ACCOUNT_ID}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  // Captura tracking se enviado pelo frontend
  const tracking = body.tracking ? JSON.parse(body.tracking) : null

  const payload: Record<string, unknown> = {
    amount: totalCents,
    description: 'Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5',
    reference,
    productHash: PRODUCT_HASH,
    customer: {
      name: body.name,
      email: body.email,
      phone: phone || '11999999999',
      document: cpf,
    },
  }

  if (tracking) {
    payload.tracking = tracking
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

    if (!res.ok || (data.status && data.status !== 'success')) {
      console.error('[Paradise] Erro na criação:', data)
      return NextResponse.json(data, { status: res.ok ? 400 : res.status })
    }

    return NextResponse.json({
      transaction_id: data.transaction_id,
      id: data.id,
      qr_code: data.qr_code,
      amount: data.amount,
      expires_at: data.expires_at,
      reference,
    })
  } catch (err) {
    console.error('[Paradise] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
