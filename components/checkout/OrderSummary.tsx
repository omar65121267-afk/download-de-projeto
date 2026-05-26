type Props = {
  freteLabel: string
  freteVal: number
  total: number
  pixDiscount: number
  totalPix: number
  size: string
  fmt: (n: number) => string
}

export default function OrderSummary({ freteLabel, freteVal, total, pixDiscount, totalPix, size, fmt }: Props) {
  return (
    <div className="card">
      <h2>Resumo do pedido</h2>
      <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
        <span style={{ flexShrink: 0, fontSize: 16, color: '#16a34a' }}>✓</span>
        Pagando via PIX voce economiza <b style={{ marginLeft: 4 }}>{fmt(pixDiscount)}</b> nesta compra!
      </div>
      <div className="summary">
        <div className="row"><span>Subtotal</span><span>R$ 127,90</span></div>
        <div className="row div"><span>Frete</span><span>{freteVal === 0 ? 'Grátis' : fmt(freteVal)}</span></div>
        <div className="row" style={{ color: '#16a34a', fontWeight: 600 }}>
          <span>Desconto PIX (5%)</span><span>- {fmt(pixDiscount)}</span>
        </div>
        <div className="row total">
          <span>Total PIX</span>
          <span style={{ color: '#16a34a' }}>{fmt(totalPix)}</span>
        </div>
      </div>
      <div className="prod">
        <img
          src="/assets/fotoproduto1.webp"
          alt="Kit 5 Calças ZYRON"
          width={54}
          height={54}
          style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        />
        <div className="info">
          <b>Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5</b>
          <div className="var">Tamanho: {size} · Kit 5 Calças</div>
          <div className="pr">R$ 127,90</div>
        </div>
      </div>
    </div>
  )
}
