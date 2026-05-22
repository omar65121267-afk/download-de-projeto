'use client'

import { useSearchParams } from 'next/navigation'
import PixPage from '@/components/pix/PixPage'

export default function PixContent() {
  const params = useSearchParams()

  const txid = params.get('txid') || ''
  const qr = params.get('qr') || ''
  const amount = parseInt(params.get('amount') || '12790', 10)
  const expires = params.get('expires') || ''

  if (!txid || !qr) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
        <p style={{ color: '#dc2626', fontSize: 14 }}>Dados do PIX não encontrados. Volte ao checkout.</p>
      </div>
    )
  }

  return (
    <PixPage
      transactionId={txid}
      qrCode={qr}
      amount={amount}
      expiresAt={expires}
    />
  )
}
