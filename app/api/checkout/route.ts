import { NextRequest, NextResponse } from 'next/server'

const PARADISE_BASE = 'https://multi.paradisepags.com'
const PARADISE_API_KEY = process.env.PARADISE_SECRET_KEY || 'sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae'
const PRODUCT_HASH = 'prod_00aa98b7e5247d4f'

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

  const reference = `ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const payload: Record<string, unknown> = {
    amount: amountCents,
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

  // Inclui tracking UTM se enviado pelo frontend
  if (body.tracking) {
    try {
      payload.tracking = JSON.parse(body.tracking)
    } catch {
      // ignora se malformado
    }
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

    if (!res.ok || data.status === 'error') {
      console.error('[Paradise] Erro na criação:', data)
      return NextResponse.json(data, { status: res.ok ? 400 : res.status })
    }

    return NextResponse.json({
      transaction_id: data.transaction_id,
      qr_code: data.qr_code || '',
      amount: data.amount,
      expires_at: data.expires_at || '',
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
