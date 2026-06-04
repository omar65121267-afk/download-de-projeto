'use client'

import { useEffect, useState } from 'react'

export default function ObrigadoPage() {
  const [orderNum, setOrderNum] = useState('')

  useEffect(() => {
    // Gera um número de pedido fictício para exibição
    const stored = sessionStorage.getItem('order_num')
    if (stored) {
      setOrderNum(stored)
    } else {
      const num = `ZYR${Math.floor(100000 + Math.random() * 900000)}`
      sessionStorage.setItem('order_num', num)
      setOrderNum(num)
    }
  }, [])

  return (
    <div className="ty-wrap">
      {/* Header */}
      <header className="ty-header">
        <span className="logo">ZYRON</span>
      </header>

      {/* Checkmark animado */}
      <div className="ty-check-wrap">
        <svg className="ty-check" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="38" stroke="#16a34a" strokeWidth="3" className="ty-circle" />
          <path d="M22 41l12 12 24-24" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="ty-tick" />
        </svg>
      </div>

      {/* Titulo */}
      <div className="ty-hero">
        <h1>Pedido confirmado!</h1>
        <p className="ty-sub">Obrigado por comprar na <strong>ZYRON</strong>. Seu kit de calças foi registrado com sucesso e já está sendo preparado para envio.</p>
      </div>

      {/* Card numero do pedido */}
      {orderNum && (
        <div className="ty-card">
          <div className="ty-card-label">Numero do pedido</div>
          <div className="ty-card-num">{orderNum}</div>
        </div>
      )}

      {/* Steps */}
      <div className="ty-steps">
        <div className="ty-step">
          <div className="ty-step-icon confirmed">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="ty-step-info">
            <div className="ty-step-title">Pedido confirmado</div>
            <div className="ty-step-desc">Pagamento recebido com sucesso</div>
          </div>
        </div>
        <div className="ty-step-line" />
        <div className="ty-step">
          <div className="ty-step-icon pending">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><path d="M3 8h14" stroke="currentColor" strokeWidth="1.8"/></svg>
          </div>
          <div className="ty-step-info">
            <div className="ty-step-title">Em preparacao</div>
            <div className="ty-step-desc">Estamos separando seu kit</div>
          </div>
        </div>
        <div className="ty-step-line" />
        <div className="ty-step">
          <div className="ty-step-icon pending">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10h11M13 7l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
          </div>
          <div className="ty-step-info">
            <div className="ty-step-title">Enviado</div>
            <div className="ty-step-desc">A caminho da sua casa</div>
          </div>
        </div>
      </div>

      {/* Botao rastrear */}
      <div className="ty-cta">
        <a
          href="https://pacseguro.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ty-btn-track"
        >
          <svg viewBox="0 0 24 24" fill="none" width={18} height={18} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Rastrear meu pedido
        </a>
        <p className="ty-track-hint">Assim que o pedido for enviado, voce recebera o codigo de rastreio por e-mail</p>
      </div>

      {/* Footer */}
      <footer className="ty-footer">
        <span className="logo" style={{ fontSize: 20, letterSpacing: 3 }}>ZYRON</span>
        <p>Duvidas? Fale conosco no&nbsp;
          <a href="https://wa.me/5514981712107" target="_blank" rel="noopener noreferrer" className="ty-wpp-link">WhatsApp</a>
        </p>
        <p className="ty-footer-copy">&copy; {new Date().getFullYear()} ZYRON. Todos os direitos reservados.</p>
      </footer>

      <style>{`
        .ty-wrap{max-width:430px;margin:0 auto;background:#fff;min-height:100vh;display:flex;flex-direction:column}

        .ty-header{background:#000;display:flex;align-items:center;justify-content:center;padding:16px 18px}

        .ty-check-wrap{display:flex;justify-content:center;padding:36px 0 12px}
        .ty-check{width:80px;height:80px}
        .ty-circle{stroke-dasharray:239;stroke-dashoffset:239;animation:draw-circle .6s ease forwards}
        .ty-tick{stroke-dasharray:55;stroke-dashoffset:55;animation:draw-tick .4s ease .5s forwards}
        @keyframes draw-circle{to{stroke-dashoffset:0}}
        @keyframes draw-tick{to{stroke-dashoffset:0}}

        .ty-hero{padding:0 24px 24px;text-align:center}
        .ty-hero h1{font-size:24px;font-weight:800;margin-bottom:10px;color:#111}
        .ty-sub{font-size:14px;color:#6b7280;line-height:1.6}
        .ty-sub strong{color:#111}

        .ty-card{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin:0 18px 24px;padding:16px;text-align:center}
        .ty-card-label{font-size:11px;font-weight:700;letter-spacing:.12em;color:#16a34a;text-transform:uppercase;margin-bottom:6px}
        .ty-card-num{font-size:20px;font-weight:800;color:#111;letter-spacing:.06em}

        .ty-steps{padding:0 24px 28px;display:flex;flex-direction:column;gap:0}
        .ty-step{display:flex;align-items:flex-start;gap:14px}
        .ty-step-line{width:2px;height:22px;background:#e5e7eb;margin-left:17px}
        .ty-step-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ty-step-icon svg{width:18px;height:18px}
        .ty-step-icon.confirmed{background:#dcfce7;color:#16a34a}
        .ty-step-icon.pending{background:#f3f4f6;color:#9ca3af}
        .ty-step-title{font-size:14px;font-weight:700;color:#111;margin-bottom:2px}
        .ty-step-desc{font-size:12px;color:#6b7280}

        .ty-cta{padding:0 18px 32px;display:flex;flex-direction:column;gap:12px}
        .ty-btn-track{background:#111;color:#fff;border-radius:10px;padding:16px;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:15px;text-decoration:none;letter-spacing:.04em}
        .ty-btn-track:active{opacity:.88}
        .ty-track-hint{font-size:12px;color:#9ca3af;text-align:center;line-height:1.5}

        .ty-footer{margin-top:auto;background:#000;color:#fff;padding:28px 18px;text-align:center;display:flex;flex-direction:column;gap:8px}
        .ty-footer p{font-size:13px;color:#9ca3af}
        .ty-wpp-link{color:#4ade80;font-weight:600;text-decoration:none}
        .ty-footer-copy{font-size:11px;color:#4b5563;margin-top:4px}
      `}</style>
    </div>
  )
}
