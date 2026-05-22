'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Step1Personal from './Step1Personal'
import Step2Delivery from './Step2Delivery'
import Step3Payment from './Step3Payment'
import OrderSummary from './OrderSummary'

export type PersonalData = {
  name: string
  email: string
  cpf: string
  phone: string
}

export type DeliveryData = {
  cep: string
  rua: string
  num: string
  comp: string
  bairro: string
  cidade: string
  uf: string
  dlv: string
  dlvPrice: string
  freteVal: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [personal, setPersonal] = useState<PersonalData | null>(null)
  const [delivery, setDelivery] = useState<DeliveryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState('36')

  // Lê o tamanho salvo pela landing page
  useEffect(() => {
    const sz = sessionStorage.getItem('selected_size')
    if (sz) setSelectedSize(sz)
  }, [])

  // countdown timer 19:29
  const [secs, setSecs] = useState(19 * 60 + 29)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  const SUBTOTAL = 127.9
  const freteVal = delivery?.freteVal ?? 0
  const total = SUBTOTAL + freteVal
  const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`

  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)

  function handlePersonalDone(data: PersonalData) {
    setPersonal(data)
    setStep(2)
    setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleDeliveryDone(data: DeliveryData) {
    setDelivery(data)
    setStep(3)
    setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  async function handleFinalize() {
    if (!personal || !delivery) return
    setLoading(true)

    // Captura UTMs da URL atual
    const params = new URLSearchParams(window.location.search)
    const trackingFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck']
    const tracking: Record<string, string> = {}
    trackingFields.forEach(f => { const v = params.get(f); if (v) tracking[f] = v })

    try {
      const payload: Record<string, string> = {
        name: personal.name,
        email: personal.email,
        cpf: personal.cpf,
        phone: personal.phone,
        cep: delivery.cep,
        rua: delivery.rua,
        num: delivery.num,
        comp: delivery.comp,
        bairro: delivery.bairro,
        cidade: delivery.cidade,
        uf: delivery.uf,
        frete: String(delivery.freteVal),
        frete_label: delivery.dlv,
      }
      if (Object.keys(tracking).length > 0) {
        payload.tracking = JSON.stringify(tracking)
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`)
      }

      // Armazena o qr_code no sessionStorage (pode ser muito longo para URL)
      sessionStorage.setItem('pix_txid', String(data.transaction_id))
      sessionStorage.setItem('pix_qr', data.qr_code || '')
      sessionStorage.setItem('pix_amount', String(data.amount ?? 12790))
      sessionStorage.setItem('pix_expires', data.expires_at || '')
      sessionStorage.setItem('pix_size', selectedSize)
      router.push('/pix')
    } catch (err) {
      alert('Erro ao gerar PIX: ' + (err as Error).message)
    } finally {
      setLoading(false)
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
        <button className="menu-btn" aria-label="Menu">☰</button>
        <div className="logo">ZYRON</div>
        <div style={{ width: 28 }} />
      </header>

      {/* banner */}
      <div className="banner">
        Parcelamento em até 12x no cartão de crédito.<br />
        <b>PIX com 5% de desconto e envio prioritário. Aproveite!</b>
      </div>

      {/* timer */}
      <div className="timer-bar">
        <span>🕐</span>
        <span>Oferta especial! Este preço expira em</span>
        <span className="clock">{mm}:{ss}</span>
      </div>

      {/* resumo */}
      <OrderSummary
        freteLabel={delivery?.dlvPrice || 'Grátis'}
        freteVal={freteVal}
        total={total}
        size={selectedSize}
        fmt={fmt}
      />

      {/* step 1 */}
      <Step1Personal
        done={step > 1}
        active={step >= 1}
        data={personal}
        onContinue={handlePersonalDone}
        onEdit={() => setStep(1)}
      />

      {/* step 2 */}
      <div ref={step2Ref}>
        <Step2Delivery
          done={step > 2}
          active={step >= 2}
          data={delivery}
          onContinue={handleDeliveryDone}
          onEdit={() => setStep(2)}
        />
      </div>

      {/* step 3 */}
      <div ref={step3Ref}>
        <Step3Payment
          active={step >= 3}
          loading={loading}
          onFinalize={handleFinalize}
        />
      </div>

      {/* reviews */}
      <div className="rev-sec">
        <h3>Avaliações de clientes</h3>
        <div className="rev-track">
          {[
            { name: 'Manuel', date: 'Fevereiro 25, 2026', stars: 4, text: 'Pedi 42 mas ficou apertada, tinha que ser 44. Mas as calças são muito boas' },
            { name: 'Eduardo', date: 'Fevereiro 22, 2026', stars: 5, text: 'Atendeu minhas expectativas. Qualidade muito boa pelo preço.' },
            { name: 'Carlos', date: 'Fevereiro 18, 2026', stars: 5, text: 'Chegou rápido, tecido firme. Vou comprar de novo pra dar de presente.' },
            { name: 'Roberto', date: 'Fevereiro 15, 2026', stars: 5, text: 'Excelente kit. Cinco cores combinando com tudo. Recomendo demais.' },
            { name: 'Fernando', date: 'Fevereiro 11, 2026', stars: 5, text: 'Custo-benefício impecável. Já indiquei pra colegas de trabalho.' },
          ].map((r, i) => (
            <div key={i} className="rev-card">
              <div className="rev-h">
                <div className="av" aria-hidden="true" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6b7280', fontSize: 16 }}>
                  {r.name[0]}
                </div>
                <div className="nm">
                  <b>{r.name}</b>
                  <small>{r.date}</small>
                </div>
                <span className="verif">Verificado</span>
              </div>
              <div className="rev-stars">
                {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* stats */}
      <div className="bigstat">
        <div className="num">100 Mil</div>
        <div className="lab">Pedidos Enviados</div>
        <div className="txt">Enviamos para você onde você estiver <b>com qualidade e agilidade comprovada!</b></div>
      </div>
      <div className="bigstat">
        <div className="num">5 anos</div>
        <div className="lab">De experiência</div>
        <div className="txt">Há cinco anos, a ZYRON seleciona a dedo os melhores produtos e <b>entrega excelência em cada compra.</b></div>
      </div>
      <div className="bigstat">
        <div className="num">80 Mil</div>
        <div className="lab">Clientes Satisfeitos</div>
        <div className="txt">20% dos clientes <b>voltam para novas compras</b>, comprovando a confiança e a satisfação em cada pedido.</div>
      </div>
      <div style={{ height: 30 }} />
    </div>
  )
}
