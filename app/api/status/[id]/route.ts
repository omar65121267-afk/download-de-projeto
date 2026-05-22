import { NextRequest, NextResponse } from 'next/server'

const PARADISE_BASE = 'https://multi.paradisepags.com'
const PARADISE_API_KEY = process.env.PARADISE_API_KEY || 'sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${PARADISE_BASE}/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(id)}`,
      {
        headers: { 'X-API-Key': PARADISE_API_KEY },
        cache: 'no-store',
      }
    )

    const text = await res.text()
    let data: Record<string, unknown>
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json({
      transaction_id: data.transaction_id || id,
      status: data.status,
    })
  } catch (err) {
    console.error('[Paradise] Erro ao consultar status:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
