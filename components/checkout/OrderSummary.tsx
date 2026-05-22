type Props = {
  freteLabel: string
  freteVal: number
  total: number
  size: string
  fmt: (n: number) => string
}

export default function OrderSummary({ freteLabel, freteVal, total, size, fmt }: Props) {
  return (
    <div className="card">
      <h2>Resumo do pedido</h2>
      <div className="summary">
        <div className="row"><span>Subtotal</span><span>R$ 127,90</span></div>
        <div className="row div"><span>Frete</span><span>{freteVal === 0 ? 'Grátis' : fmt(freteVal)}</span></div>
        <div className="row total"><span>Total</span><span>{fmt(total)}</span></div>
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
