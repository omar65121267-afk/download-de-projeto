export default function ObrigadoPage() {
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

      <div className="pix-card" style={{ marginTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 14 }}>✅</div>
        <h2 style={{ color: '#16a34a', fontSize: 22 }}>Pagamento Confirmado!</h2>
        <p style={{ color: '#374151', fontSize: 14, marginTop: 10, lineHeight: 1.6, marginBottom: 24 }}>
          Obrigado pela sua compra! Seu pedido foi recebido e está sendo preparado.
          Em breve você receberá um e-mail com os detalhes de rastreamento.
        </p>
        <div className="steps">
          <b>Próximos passos:</b>
          1. Você receberá um e-mail de confirmação<br />
          2. Seu pedido será despachado em até 2 dias úteis<br />
          3. Acompanhe pelo código de rastreamento enviado por e-mail
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  )
}
