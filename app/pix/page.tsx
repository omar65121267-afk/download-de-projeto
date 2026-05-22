import { Suspense } from 'react'
import PixContent from './PixContent'

export default function PixPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Carregando…</p>
      </div>
    }>
      <PixContent />
    </Suspense>
  )
}
