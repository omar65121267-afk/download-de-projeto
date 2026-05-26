type Props = {
  active: boolean
  loading: boolean
  totalPix: number
  fmt: (n: number) => string
  onFinalize: () => void
}

export default function Step3Payment({ active, loading, totalPix, fmt, onFinalize }: Props) {
  return (
    <div className={`card ${!active ? 'card-dis' : ''}`}>
      <h2>Opção de pagamento</h2>
      {!active ? (
        <p className="card-dis-text">Preencha suas informações de entrega para continuar</p>
      ) : (
        <>
          <div className="pay-opt active">
            <div className="radio" />
            <div className="body">
              <div className="head">
                <img src="/assets/pix.png" alt="PIX" width={28} height={28} style={{ objectFit: 'contain' }} />
                <b>PIX</b>
              </div>
              <div className="badges">
                <span className="ap">APROVAÇÃO IMEDIATA</span>
                <span className="dc">5% DE DESCONTO</span>
              </div>
            </div>
          </div>

          <button
            className="btn"
            style={{ marginTop: 14, justifyContent: 'space-between' }}
            onClick={onFinalize}
            disabled={loading}
          >
            {loading ? (
              <span style={{ width: '100%', textAlign: 'center' }}>Gerando PIX…</span>
            ) : (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="white" strokeWidth="1.8" aria-hidden="true">
                    <rect x="4" y="11" width="16" height="10" rx="2"/>
                    <path d="M8 11V7a4 4 0 018 0v4"/>
                  </svg>
                  Finalizar com PIX
                </span>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{fmt(totalPix)}</span>
              </>
            )}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 8 }}>
            5% de desconto aplicado automaticamente no PIX
          </p>
        </>
      )}
    </div>
  )
}
