import { NextRequest, NextResponse } from 'next/server'

const ASSET_BASE = 'https://api.assetpay.com.br/api/v1'
const ASSET_SECRET = process.env.ASSET_SECRET_KEY || 'sk_live_v2CAmnON0LM6dskyK3FGTNrU1x4qBrP6vR'
const ASSET_PUBLIC = process.env.ASSET_PUBLIC_KEY || 'pk_live_v2WDE8HrFOG67vd4809cEJcVUzLvx0jZk5'
const ASSET_AUTH = `Basic ${Buffer.from(`${ASSET_SECRET}:${ASSET_PUBLIC}`).toString('base64')}`

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(`${ASSET_BASE}/transactions/${encodeURIComponent(id)}`, {
      headers: {
        'Authorization': ASSET_AUTH,
      },
      cache: 'no-store',
    })

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

    // AssetPay usa "paid" como status de aprovado
    // Normaliza para "approved" para manter compatibilidade com o frontend
    const rawStatus = data.status as string
    const normalizedStatus = rawStatus === 'paid' ? 'approved' : rawStatus

    return NextResponse.json({
      transaction_id: data.id || id,
      status: normalizedStatus,
    })
  } catch (err) {
    console.error('[AssetPay] Erro ao consultar status:', err)
    return NextResponse.json(
      { error: 'Erro interno', message: (err as Error).message },
      { status: 500 }
    )
  }
}
