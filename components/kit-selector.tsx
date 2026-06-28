'use client'

import { useState } from 'react'

const SIZES = ['36','38','40','42','44','46','48','50','52','54']
const DEFAULT_SIZE = '42'

interface KitSelectorProps {
  onBuy: (size: string) => void
}

export function KitSelector({ onBuy }: KitSelectorProps) {
  const [size, setSize] = useState(DEFAULT_SIZE)

  return (
    <div className="ks-wrap">
      <div className="ks-header">
        <span className="ks-label">Escolha o tamanho do kit</span>
        <span className="ks-sub">Um tamanho único para todas as 5 calças</span>
      </div>

      <div className="ks-card">
        <div className="ks-row-label">TAMANHO</div>
        <div className="ks-sizes">
          {SIZES.map(sz => (
            <button
              key={sz}
              className={`ks-sz${size === sz ? ' ks-sz-active' : ''}`}
              onClick={() => setSize(sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div className="ks-summary">
        <div className="ks-summary-title">Kit selecionado</div>
        <div className="ks-summary-row">
          <span>5 calças · 5 cores</span>
          <span>Tamanho {size}</span>
        </div>
        <div className="ks-summary-row">
          <span>Valor total</span>
          <span>R$ 139,00</span>
        </div>
      </div>

      <button className="ks-buy-btn" onClick={() => onBuy(size)}>
        Comprar agora — R$ 139,00
      </button>
    </div>
  )
}
