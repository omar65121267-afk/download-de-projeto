import { NextRequest, NextResponse } from 'next/server'

const BLACKCAT_BASE = 'https://api.blackcatpay.com.br/api'
const BLACKCAT_API_KEY = process.env.BLACKCAT_SECRET_KEY || 'sk_live_0ba4c5d0979cf5eadf8fd414cabaf0097bc0715d900f8c736c7f9f040c8ff33f'

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

  // amount vem do frontend já com o desconto PIX de 5% aplicado
  const amountCents = body.amount
    ? parseInt(body.amount, 10)
    : Math.round((12790 + Math.round(freteVal * 100)) * 0.95)

  if (!body.name || !body.email || cpf.length !== 11) {
    return NextResponse.json(
      { error: 'Validação', message: 'Nome, e-mail e CPF são obrigatórios.' },
      { status: 400 }
    )
  }

  // Extrai endereço salvo pelo checkout
  const reference = `ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  // UTMs
  let utmFields: Record<string, string> = {}
  if (body.tracking) {
    try {
      const t = JSON.parse(body.tracking)
      if (t.utm_source)   utmFields.utm_source   = t.utm_source
      if (t.utm_medium)   utmFields.utm_medium   = t.utm_medium
      if (t.utm_campaign) utmFields.utm_campaign = t.utm_campaign
      if (t.utm_content)  utmFields.utm_content  = t.utm_content
      if (t.utm_term)     utmFields.utm_term      = t.utm_term
    } catch { /* ignora */ }
  }

  const shippingItems = freteVal > 0
    ? [{ title: 'Frete', unitPrice: Math.round(freteVal * 100), quantity: 1, tangible: false }]
    : []

  const payload: Record<string, unknown> = {
    amount: amountCents,
    currency: 'BRL',
    paymentMethod: 'pix',
    items: [
      {
        title: 'Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5',
        unitPrice: Math.round((12790 + Math.round(freteVal * 100)) * 0.95),
        quantity: 1,
        tangible: true,
      },
      ...shippingItems,
    ],
    customer: {
      name: body.name,
      email: body.email,
      phone: phone || '11999999999',
      document: { number: cpf, type: 'cpf' },
    },
    shipping: {
      name: body.name,
      street: body.street || 'Rua não informada',
      number: body.address_number || 'S/N',
      complement: body.complement || '',
      neighborhood: body.neighborhood || 'Centro',
      city: body.city || 'São Paulo',
      state: body.state || 'SP',
      zipCode: onlyDigits(body.cep || '01001000'),
    },
    pix: { expiresInDays: 1 },
    externalRef: reference,
    ...utmFields,
  }

  try {
    const res = await fetch(`${BLACKCAT_BASE}/sales/create-sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLACKCAT_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let data: Record<string, unknown>
    try { data = JSON.parse(text) } catch { data = { raw: text } }

    if (!res.ok || !data.success) {
      console.error('[BlackCat] Erro na criação:', data)
      return NextResponse.json(data, { status: res.ok ? 400 : res.status })
    }

    const d = data.data as Record<string, unknown>
    const pd = d.paymentData as Record<string, unknown>

    return NextResponse.json({
      transaction_id: d.transactionId,
      qr_code: pd?.copyPaste || pd?.qrCode || '',
      amount: d.amount,
      expires_at: pd?.expiresAt || '',
      reference,
    })
  } catch (err) {
    console.error('[BlackCat] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
