'use client'

import { useState } from 'react'
import type { DeliveryData } from './CheckoutPage'

const DELIVERY_OPTIONS = [
  { dlv: 'PAC', label: 'Correios - PAC', desc: '3 a 9 dias', price: 'Grátis', val: 0 },
  { dlv: 'SEDEX', label: 'Correios - SEDEX', desc: '2 a 5 dias', price: 'R$ 27,44', val: 27.44 },
]

function maskCEP(v: string) {
  v = v.replace(/\D/g, '').slice(0, 8)
  if (v.length > 5) return v.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  return v
}

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

type Props = {
  done: boolean
  active: boolean
  data: DeliveryData | null
  onContinue: (d: DeliveryData) => void
  onEdit: () => void
}

type Errors = Partial<Record<'cep' | 'rua' | 'num' | 'bairro' | 'cidade' | 'uf', string>>

export default function Step2Delivery({ done, active, data, onContinue, onEdit }: Props) {
  const [cep, setCep] = useState(data?.cep || '')
  const [rua, setRua] = useState(data?.rua || '')
  const [num, setNum] = useState(data?.num || '')
  const [comp, setComp] = useState(data?.comp || '')
  const [bairro, setBairro] = useState(data?.bairro || '')
  const [cidade, setCidade] = useState(data?.cidade || '')
  const [uf, setUf] = useState(data?.uf || '')
  const [cepStatus, setCepStatus] = useState('')
  const [cepStatusColor, setCepStatusColor] = useState('#6b7280')
  const [showExtra, setShowExtra] = useState(false)
  const [selDlv, setSelDlv] = useState(0)
  const [errors, setErrors] = useState<Errors>({})

  async function handleCep(v: string) {
    const masked = maskCEP(v)
    setCep(masked)
    const digits = masked.replace(/\D/g, '')
    if (digits.length === 8) {
      setShowExtra(true)
      setCepStatusColor('#6b7280')
      setCepStatus('Buscando endereço…')
      try {
        const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const d = await r.json()
        if (d.erro) {
          setCepStatusColor('#dc2626')
          setCepStatus('CEP não encontrado. Preencha manualmente.')
        } else {
          setRua(d.logradouro || '')
          setBairro(d.bairro || '')
          setCidade(d.localidade || '')
          setUf(d.uf || '')
          setCepStatusColor('#16a34a')
          setCepStatus('✓ Endereço encontrado')
        }
      } catch {
        setCepStatusColor('#dc2626')
        setCepStatus('Erro ao buscar CEP. Preencha manualmente.')
      }
    } else {
      setCepStatus('')
    }
  }

  function submit() {
    const errs: Errors = {}
    if (cep.replace(/\D/g, '').length !== 8) errs.cep = 'CEP inválido.'
    if (rua.trim().length < 2) errs.rua = 'Preencha a rua.'
    if (num.trim().length < 1) errs.num = 'Preencha o número.'
    if (bairro.trim().length < 2) errs.bairro = 'Preencha o bairro.'
    if (cidade.trim().length < 2) errs.cidade = 'Preencha a cidade.'
    if (!uf) errs.uf = 'Selecione o estado.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const opt = DELIVERY_OPTIONS[selDlv]
    onContinue({
      cep, rua: rua.trim(), num: num.trim(), comp: comp.trim(),
      bairro: bairro.trim(), cidade: cidade.trim(), uf,
      dlv: opt.dlv, dlvPrice: opt.price, freteVal: opt.val,
    })
  }

  if (done && data) {
    return (
      <div className="card">
        <h2>
          Entrega
          <span className="edit-link" onClick={onEdit}>Editar</span>
        </h2>
        <div className="sum-info">
          <span>{data.rua}, {data.num} - {data.bairro}</span><br />
          <span>{data.cidade}/{data.uf} · CEP {data.cep}</span><br />
          <span>Correios - {data.dlv} · <b>{data.dlvPrice}</b></span>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${!active ? 'card-dis' : ''}`}>
      <h2>Entrega</h2>
      {!active ? (
        <p className="card-dis-text">Preencha suas informações pessoais para continuar</p>
      ) : (
        <>
          <div className={`field ${errors.cep ? 'error' : ''}`}>
            <label htmlFor="f_cep">CEP</label>
            <input id="f_cep" value={cep} onChange={e => handleCep(e.target.value)} placeholder="00000-000" inputMode="numeric" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 12 }}>
              <span style={{ color: cepStatusColor }}>{cepStatus}</span>
              <button
                style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 0, cursor: 'pointer', fontSize: 12 }}
                onClick={() => { setShowExtra(true); setCepStatus('Preencha o endereço manualmente.'); setCepStatusColor('#7c3aed') }}
              >
                Não sei meu CEP
              </button>
            </div>
            {errors.cep && <div className="err">{errors.cep}</div>}
          </div>

          {showExtra && (
            <>
              <div className={`field ${errors.rua ? 'error' : ''}`}>
                <label htmlFor="f_rua">Rua</label>
                <input id="f_rua" value={rua} onChange={e => setRua(e.target.value)} />
                {errors.rua && <div className="err">{errors.rua}</div>}
              </div>

              <div className={`field ${errors.num ? 'error' : ''}`}>
                <label htmlFor="f_num">Número</label>
                <input id="f_num" value={num} onChange={e => setNum(e.target.value)} inputMode="numeric" />
                {errors.num && <div className="err">{errors.num}</div>}
              </div>

              <div className="field">
                <label htmlFor="f_comp">Complemento</label>
                <input id="f_comp" value={comp} onChange={e => setComp(e.target.value)} />
              </div>

              <div className={`field ${errors.bairro ? 'error' : ''}`}>
                <label htmlFor="f_bairro">Bairro</label>
                <input id="f_bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
                {errors.bairro && <div className="err">{errors.bairro}</div>}
              </div>

              <div className={`field ${errors.cidade ? 'error' : ''}`}>
                <label htmlFor="f_cidade">Cidade</label>
                <input id="f_cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
                {errors.cidade && <div className="err">{errors.cidade}</div>}
              </div>

              <div className={`field ${errors.uf ? 'error' : ''}`}>
                <label htmlFor="f_estado">Estado</label>
                <select id="f_estado" value={uf} onChange={e => setUf(e.target.value)}>
                  <option value="">UF</option>
                  {UFS.map(u => <option key={u}>{u}</option>)}
                </select>
                {errors.uf && <div className="err">{errors.uf}</div>}
              </div>

              <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />

              <div className="dlv-h">Escolha uma forma de entrega:</div>
              <div className="dlv-list">
                {DELIVERY_OPTIONS.map((opt, i) => (
                  <div
                    key={opt.dlv}
                    className={`dlv-opt ${selDlv === i ? 'active' : ''}`}
                    onClick={() => setSelDlv(i)}
                  >
                    <div className="radio" />
                    <div className="info">
                      <b>{opt.label}</b>
                      <small>{opt.desc}</small>
                    </div>
                    <div className={`price ${opt.val === 0 ? 'free' : ''}`}>{opt.price}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="btn" style={{ marginTop: 18 }} onClick={submit}>Continuar →</button>
        </>
      )}
    </div>
  )
}
