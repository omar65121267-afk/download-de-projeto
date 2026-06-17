'use client'

import { useState } from 'react'

const COLORS = [
  { label: 'Preto',   hex: '#1A1A1A', border: false },
  { label: 'Marinho', hex: '#1C2F57', border: false },
  { label: 'Cáqui',  hex: '#8B7A5A', border: false },
  { label: 'Cinza',  hex: '#8A8A8A', border: false },
  { label: 'Branco', hex: '#F0EDE8', border: true  },
]

const SIZES = ['38', '40', '42', '44', '46']

const DEFAULT_COLORS = ['Preto', 'Marinho', 'Cáqui']
const DEFAULT_SIZE   = '42'

type PantState = { color: string; size: string }

interface KitSelectorProps {
  onBuy: (kit: PantState[]) => void
}

export function KitSelector({ onBuy }: KitSelectorProps) {
  const [pants, setPants] = useState<PantState[]>([
    { color: DEFAULT_COLORS[0], size: DEFAULT_SIZE },
    { color: DEFAULT_COLORS[1], size: DEFAULT_SIZE },
    { color: DEFAULT_COLORS[2], size: DEFAULT_SIZE },
  ])

  function setColor(idx: number, color: string) {
    setPants(prev => prev.map((p, i) => i === idx ? { ...p, color } : p))
  }

  function setSize(idx: number, size: string) {
    setPants(prev => prev.map((p, i) => i === idx ? { ...p, size } : p))
  }

  return (
    <div className="ks-wrap">
      <div className="ks-header">
        <span className="ks-label">Monte seu kit</span>
        <span className="ks-sub">Escolha cor e tamanho para cada calça</span>
      </div>

      {pants.map((pant, idx) => {
        const colorObj = COLORS.find(c => c.label === pant.color)!
        return (
          <div key={idx} className="ks-card">
            <div className="ks-card-title">
              <span className="ks-num">{idx + 1}</span>
              <span>Calça {idx + 1}</span>
              <span className="ks-selected-color" style={{ color: colorObj.hex === '#F0EDE8' ? '#888' : colorObj.hex }}>
                {pant.color}
              </span>
            </div>

            {/* Color picker */}
            <div className="ks-row-label">Cor</div>
            <div className="ks-colors">
              {COLORS.map(c => (
                <button
                  key={c.label}
                  className={`ks-dot-btn${pant.color === c.label ? ' ks-dot-active' : ''}`}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => setColor(idx, c.label)}
                >
                  <span
                    className="ks-dot"
                    style={{
                      background: c.hex,
                      border: c.border ? '1.5px solid #d1d0cb' : 'none',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Size picker */}
            <div className="ks-row-label">Tamanho</div>
            <div className="ks-sizes">
              {SIZES.map(sz => (
                <button
                  key={sz}
                  className={`ks-sz${pant.size === sz ? ' ks-sz-active' : ''}`}
                  onClick={() => setSize(idx, sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Summary */}
      <div className="ks-summary">
        <div className="ks-summary-title">Resumo do kit</div>
        {pants.map((p, i) => (
          <div key={i} className="ks-summary-row">
            <span>Calça {i + 1}</span>
            <span>{p.color} · Tam. {p.size}</span>
          </div>
        ))}
      </div>

      <button className="ks-buy-btn" onClick={() => onBuy(pants)}>
        Adicionar ao carrinho &nbsp;·&nbsp; R$ 127,90
      </button>
    </div>
  )
}
