'use client'

import { useEffect, useState } from 'react'
import PixPage from '@/components/pix/PixPage'

export default function PixContent() {
  const [txid, setTxid] = useState('')
  const [qr, setQr] = useState('')
  const [amount, setAmount] = useState(12790)
  const [expires, setExpires] = useState('')
  const [size, setSize] = useState('36')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = sessionStorage.getItem('pix_txid') || ''
    const q = sessionStorage.getItem('pix_qr') || ''
    const a = parseInt(sessionStorage.getItem('pix_amount') || '12790', 10)
    const e = sessionStorage.getItem('pix_expires') || ''
    const s = sessionStorage.getItem('pix_size') || sessionStorage.getItem('selected_size') || '36'
    setTxid(t)
    setQr(q)
    setAmount(a)
    setExpires(e)
    setSize(s)
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Carregando…</p>
      </div>
    )
  }

  if (!txid || !qr) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
        <p style={{ color: '#dc2626', fontSize: 14 }}>Dados do PIX não encontrados. <a href="/" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Volte ao checkout.</a></p>
      </div>
    )
  }

  return (
    <PixPage
      transactionId={txid}
      qrCode={qr}
      amount={amount}
      expiresAt={expires}
      size={size}
    />
  )
}
