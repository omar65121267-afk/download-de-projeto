type Props = {
  freteLabel: string
  freteVal: number
  total: number
  fmt: (n: number) => string
}

export default function OrderSummary({ freteLabel, freteVal, total, fmt }: Props) {
  return (
    <div className="card">
      <h2>Resumo do pedido</h2>
      <div className="summary">
        <div className="row"><span>Subtotal</span><span>R$ 127,90</span></div>
        <div className="row div"><span>Frete</span><span>{freteVal === 0 ? 'Grátis' : fmt(freteVal)}</span></div>
        <div className="row total"><span>Total</span><span>{fmt(total)}</span></div>
      </div>
      <div className="prod">
        <div className="ph" style={{ width: 54, height: 54, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <div className="info">
          <b>Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5</b>
          <div className="var">Kit 5 Calças – R$ 127,90</div>
          <div className="pr">R$ 127,90</div>
        </div>
      </div>
    </div>
  )
}
