import { NextRequest, NextResponse } from 'next/server'

const PARADISE_BASE = 'https://multi.paradisepags.com'
const PARADISE_API_KEY = process.env.PARADISE_SECRET_KEY || 'sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae'
const PRODUCT_HASH = 'prod_00aa98b7e5247d4f'

// R$ 21,35 em centavos
const FRETE_CORRECTION_CENTS = 2135

export async function POST(request: NextRequest) {
  let customerName = ''
  let customerEmail = ''
  let customerCpf = ''
  let customerPhone = ''

  // Tenta ler dados do cliente passados pelo frontend (sessão do pedido original)
  try {
    const body = await request.json()
    if (body.name) customerName = body.name
    if (body.email) customerEmail = body.email
    if (body.cpf) customerCpf = String(body.cpf).replace(/\D/g, '')
    if (body.phone) customerPhone = String(body.phone).replace(/\D/g, '')
  } catch {
    // usa fallback abaixo
  }

  // Gera dados aleatórios se não recebeu dados do cliente
  if (!customerEmail) {
    const nomes = ['Ana', 'Carlos', 'Maria', 'Pedro', 'Julia', 'Lucas', 'Fernanda', 'Rafael', 'Camila', 'Bruno']
    const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira', 'Almeida', 'Ribeiro']
    const nome = nomes[Math.floor(Math.random() * nomes.length)]
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
    customerName = customerName || `${nome} ${sobrenome}`
    const ts = Date.now()
    const rnd = Math.random().toString(36).substring(2, 8)
    customerEmail = `cliente_${ts}_${rnd}@mail.com`
    customerCpf = customerCpf || Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')
    const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '27']
    const ddd = ddds[Math.floor(Math.random() * ddds.length)]
    customerPhone = customerPhone || ddd + '9' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')
  }

  const reference = `FRETE-ZYRON-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const payload = {
    amount: FRETE_CORRECTION_CENTS,
    description: 'Correção de frete do pedido ZYRON',
    reference,
    productHash: PRODUCT_HASH,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      document: customerCpf,
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

    if (!res.ok || data.status === 'error') {
      console.error('[Paradise Frete] Erro:', data)
      return NextResponse.json(data, { status: res.ok ? 400 : res.status })
    }

    return NextResponse.json({
      transaction_id: data.transaction_id,
      qr_code: data.qr_code || '',
      amount: FRETE_CORRECTION_CENTS,
      expires_at: data.expires_at || '',
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
