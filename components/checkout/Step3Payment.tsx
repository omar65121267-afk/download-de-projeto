type Props = {
  active: boolean
  loading: boolean
  onFinalize: () => void
}

export default function Step3Payment({ active, loading, onFinalize }: Props) {
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
                <svg width="28" height="28" viewBox="0 0 512 512" fill="none" aria-hidden="true">
                  <rect width="512" height="512" rx="80" fill="#32BCAD"/>
                  <path d="M256 96c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160S344.4 96 256 96zm0 280c-66.3 0-120-53.7-120-120s53.7-120 120-120 120 53.7 120 120-53.7 120-120 120zm-8-168v96l80 48-13.5 22.5L224 320v-112h24z" fill="white"/>
                  <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fontSize="180" fontWeight="800" fill="white" fontFamily="Arial">Pix</text>
                </svg>
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
            style={{ marginTop: 14 }}
            onClick={onFinalize}
            disabled={loading}
          >
            {loading ? (
              'Gerando PIX…'
            ) : (
              <>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="white" strokeWidth="1.8" aria-hidden="true">
                  <rect x="4" y="11" width="16" height="10" rx="2"/>
                  <path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                Finalizar Compra
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
