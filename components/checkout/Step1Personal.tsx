'use client'

import { useState } from 'react'
import type { PersonalData } from './CheckoutPage'

function validEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validCPF(v: string) {
  v = v.replace(/\D/g, '')
  if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false
  let s = 0
  for (let i = 0; i < 9; i++) s += parseInt(v[i]) * (10 - i)
  let d1 = (s * 10) % 11; if (d1 === 10) d1 = 0
  if (d1 !== parseInt(v[9])) return false
  s = 0
  for (let i = 0; i < 10; i++) s += parseInt(v[i]) * (11 - i)
  let d2 = (s * 10) % 11; if (d2 === 10) d2 = 0
  return d2 === parseInt(v[10])
}
function validPhone(v: string) { const n = v.replace(/\D/g, ''); return n.length === 10 || n.length === 11 }

function maskCPF(v: string) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  return v
}
function maskPhone(v: string) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3')
  if (v.length > 6) return v.replace(/(\d{2})(\d{4,5})(\d{1,4})/, '($1) $2-$3')
  if (v.length > 2) return v.replace(/(\d{2})(\d{1,5})/, '($1) $2')
  if (v.length > 0) return v.replace(/(\d{1,2})/, '($1')
  return v
}

type Props = {
  done: boolean
  active: boolean
  data: PersonalData | null
  onContinue: (d: PersonalData) => void
  onEdit: () => void
}

type Errors = { name?: string; email?: string; cpf?: string; phone?: string }

export default function Step1Personal({ done, active, data, onContinue, onEdit }: Props) {
  const [name, setName] = useState(data?.name || '')
  const [email, setEmail] = useState(data?.email || '')
  const [cpf, setCpf] = useState(data?.cpf || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [errors, setErrors] = useState<Errors>({})

  function submit() {
    const errs: Errors = {}
    if (name.trim().split(/\s+/).filter(Boolean).length < 2) errs.name = 'Informe nome e sobrenome.'
    if (!validEmail(email.trim())) errs.email = 'E-mail inválido.'
    if (!validCPF(cpf)) errs.cpf = 'CPF inválido.'
    if (!validPhone(phone)) errs.phone = 'Telefone inválido. Use (XX) XXXXX-XXXX.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onContinue({ name: name.trim(), email: email.trim(), cpf, phone })
  }

  if (done && data) {
    return (
      <div className="card">
        <h2>
          Dados pessoais
          <span className="edit-link" onClick={onEdit}>Editar</span>
        </h2>
        <div className="sum-info">
          <b>{data.name}</b>
          <span>{data.email} · {data.phone}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${!active ? 'card-dis' : ''}`}>
      <h2>Dados pessoais</h2>
      {!active ? (
        <p className="card-dis-text">Preencha suas informações pessoais para continuar</p>
      ) : (
        <>
          <p className="help">Pedimos apenas as informações essenciais para concluir sua compra com segurança.</p>

          <div className={`field ${errors.name ? 'error' : ''}`}>
            <label htmlFor="f_name">Nome completo</label>
            <input id="f_name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Mariana Cardoso Silva" />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>

          <div className={`field ${errors.email ? 'error' : ''}`}>
            <label htmlFor="f_email">E-mail</label>
            <input id="f_email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ex: marianacardoso@gmail.com" />
            {errors.email && <div className="err">{errors.email}</div>}
          </div>

          <div className={`field ${errors.cpf ? 'error' : ''}`}>
            <label htmlFor="f_cpf">CPF</label>
            <input id="f_cpf" value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" />
            {errors.cpf && <div className="err">{errors.cpf}</div>}
          </div>

          <div className={`field ${errors.phone ? 'error' : ''}`}>
            <label htmlFor="f_phone">Celular/Whatsapp</label>
            <input id="f_phone" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" inputMode="numeric" />
            {errors.phone && <div className="err">{errors.phone}</div>}
          </div>

          <button className="btn" onClick={submit}>Continuar →</button>
        </>
      )}
    </div>
  )
}
