'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const UPSELL_URL = '/frete'

type Status = 'pending' | 'approved' | 'failed' | 'refunded'

type Props = {
  transactionId: string
  qrCode: string
  amount: number   // centavos
  expiresAt: string
  size: string
}

export default function PixPage({ transactionId, qrCode, amount, expiresAt, size }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<Status>('pending')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Gera QR Code localmente a partir do texto PIX (nunca usa qr_code_base64)
  useEffect(() => {
    if (!qrCode) return
    QRCode.toDataURL(qrCode, { width: 300, margin: 2 })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('[v0] QR Code geração erro:', err))
  }, [qrCode])

  // Polling a cada 2s conforme documentação Paradise
  useEffect(() => {
    if (!transactionId) return

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${encodeURIComponent(transactionId)}`)
        if (!res.ok) return
        const data = await res.json()
        const s: Status = data.status

        if (s === 'approved') {
          clearInterval(pollRef.current!)
          setStatus('approved')
          setTimeout(() => { window.location.href = UPSELL_URL }, 1500)
        } else if (s === 'failed' || s === 'refunded') {
          clearInterval(pollRef.current!)
          setStatus(s)
        }
      } catch (e) {
        console.error('[v0] Polling erro:', e)
      }
    }, 2000)

    // Timeout de segurança: para após 15 minutos
    const timeout = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current)
    }, 15 * 60 * 1000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      clearTimeout(timeout)
    }
  }, [transactionId])

  function copyPix() {
    navigator.clipboard.writeText(qrCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const fmt = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`

  const isApproved = status === 'approved'
  const isFailed = status === 'failed' || status === 'refunded'

  return (
    <div className="wrap">
      {/* topbar */}
      <div className="topbar">
        <span className="heart">♡</span> Diversidade e Qualidade em um clique
      </div>

      {/* header */}
      <header className="zy-header">
        <div style={{ width: 28 }} />
        <div className="logo">ZYRON</div>
        <div style={{ width: 28 }} />
      </header>

      <div className="pix-card">
        <h2>PIX Copia e Cola</h2>
        <div className="sub">Após o pagamento, a confirmação é automática</div>

        {/* Resumo do produto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f3f4f6', borderRadius: 10, padding: '10px 14px', marginBottom: 18, textAlign: 'left' }}>
          <img
            src="/assets/fotoproduto1.webp"
            alt="Kit 5 Calças ZYRON"
            width={54}
            height={54}
            style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#111', lineHeight: 1.35 }}>Kit 5 Calças Masculinas em Sarja Retrô Premium</div>
            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 3 }}>Tamanho: <strong style={{ color: '#111' }}>{size}</strong> · Kit 5 Calças</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginTop: 4 }}>R$ 127,90</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="qr-wrap">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code PIX" width={240} height={240} />
          ) : (
            <div style={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <span style={{ color: '#9ca3af', fontSize: 13 }}>Gerando QR Code…</span>
            </div>
          )}
        </div>

        <div className="pix-amount">
          {fmt(amount)}
          <small>PIX · 5% DE DESCONTO APLICADO</small>
        </div>

        {/* Código copia e cola */}
        <div className="copy-box" aria-label="Código PIX copia e cola">
          {qrCode || '(código indisponível)'}
        </div>

        <button
          className={`copy-btn ${copied ? 'ok' : ''}`}
          onClick={copyPix}
          disabled={!qrCode}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2"/>
            <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>
          </svg>
          {copied ? '✓ Copiado!' : 'Copiar código PIX'}
        </button>

        {/* Status */}
        {!isFailed && (
          <div className={`status ${isApproved ? 'paid' : ''}`}>
            <span className="dot" />
            <span>
              {isApproved
                ? 'Pagamento confirmado! Redirecionando…'
                : 'Aguardando pagamento…'}
            </span>
          </div>
        )}

        {isFailed && (
          <div className="pix-err">
            Pagamento não concluído. Tente novamente.
          </div>
        )}

        {/* Instruções */}
        <div className="steps">
          <b>Como pagar:</b>
          1. Copie o código PIX acima<br />
          2. Abra o app do seu banco<br />
          3. Toque em PIX → Pagar com Copia e Cola<br />
          4. Cole o código e confirme <b>{fmt(amount)}</b>
        </div>

        {expiresAt && (
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 12 }}>
            Expira em: {expiresAt}
          </p>
        )}
      </div>

      <div style={{ height: 30 }} />
    </div>
  )
}
