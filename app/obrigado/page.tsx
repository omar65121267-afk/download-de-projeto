import { redirect } from 'next/navigation'

// Redireciona direto para /frete onde fica o upsell de correção de frete
export default function ObrigadoPage() {
  redirect('/frete')
}
