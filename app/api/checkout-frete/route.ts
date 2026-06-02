import { NextRequest, NextResponse } from 'next/server'

const BLACKCAT_BASE = 'https://api.blackcatpay.com.br/api'
const BLACKCAT_API_KEY = process.env.BLACKCAT_SECRET_KEY || 'sk_live_0ba4c5d0979cf5eadf8fd414cabaf0097bc0715d900f8c736c7f9f040c8ff33f'

// R$ 21,35 em centavos
const FRETE_CORRECTION_CENTS = 2135

const onlyDigits = (s: string) => String(s || '').replace(/\D/g, '')

export async function POST(request: NextRequest) {
  let customerName = ''
  let customerEmail = ''
  let customerCpf = ''
  let customerPhone = ''

  try {
    const body = await request.json()
    if (body.name)  customerName  = body.name
    if (body.email) customerEmail = body.email
    if (body.cpf)   customerCpf   = onlyDigits(body.cpf)
    if (body.phone) customerPhone = onlyDigits(body.phone)
  } catch { /* usa fallback */ }

  // Fallback se não recebeu dados
  if (!customerEmail) {
    const nomes = ['Ana','Carlos','Maria','Pedro','Julia','Lucas','Fernanda','Rafael','Camila','Bruno']
    const sobrenomes = ['Silva','Santos','Oliveira','Souza','Lima','Pereira','Costa','Ferreira','Almeida','Ribeiro']
    const nome = nomes[Math.floor(Math.random() * nomes.length)]
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
    customerName  = customerName  || `${nome} ${sobrenome}`
    const ts  = Date.now()
    const rnd = Math.random().toString(36).substring(2, 8)
    customerEmail = `cliente_${ts}_${rnd}@mail.com`
    customerCpf   = customerCpf   || Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')
    const ddds    = ['11','21','31','41','51','61','71','81','85','27']
    const ddd     = ddds[Math.floor(Math.random() * ddds.length)]
    customerPhone = customerPhone || ddd + '9' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')
  }

  const reference = `FRETE-ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const payload = {
    amount: FRETE_CORRECTION_CENTS,
    currency: 'BRL',
    paymentMethod: 'pix',
    items: [
      {
        title: 'Correção de frete do pedido ZYRON',
        unitPrice: FRETE_CORRECTION_CENTS,
        quantity: 1,
        tangible: false,
      },
    ],
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      document: { number: customerCpf, type: 'cpf' },
    },
    pix: { expiresInDays: 1 },
    externalRef: reference,
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
      console.error('[BlackCat Frete] Erro:', data)
      return NextResponse.json(data, { status: res.ok ? 400 : res.status })
    }

    const d  = data.data as Record<string, unknown>
    const pd = d.paymentData as Record<string, unknown>

    return NextResponse.json({
      transaction_id: d.transactionId,
      qr_code: pd?.copyPaste || pd?.qrCode || '',
      amount: FRETE_CORRECTION_CENTS,
      expires_at: pd?.expiresAt || '',
      reference,
    })
  } catch (err) {
    console.error('[BlackCat Frete] Erro interno:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
