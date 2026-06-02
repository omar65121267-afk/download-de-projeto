import { NextRequest, NextResponse } from 'next/server'

const BLACKCAT_BASE = 'https://api.blackcatpay.com.br/api'
const BLACKCAT_API_KEY = process.env.BLACKCAT_SECRET_KEY || 'sk_live_0ba4c5d0979cf5eadf8fd414cabaf0097bc0715d900f8c736c7f9f040c8ff33f'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(`${BLACKCAT_BASE}/sales/${encodeURIComponent(id)}`, {
      headers: { 'X-API-Key': BLACKCAT_API_KEY },
      cache: 'no-store',
    })

    const text = await res.text()
    let data: Record<string, unknown>
    try { data = JSON.parse(text) } catch { data = { raw: text } }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    const d = data.data as Record<string, unknown> | undefined
    const rawStatus = String((d?.status ?? data.status) || '').toUpperCase()

    // Normaliza: PAID → approved, PENDING → pending, resto → failed
    const status = rawStatus === 'PAID' ? 'approved'
      : rawStatus === 'PENDING' ? 'pending'
      : 'failed'

    return NextResponse.json({ transaction_id: id, status })
  } catch (err) {
    console.error('[BlackCat] Erro ao consultar status:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
