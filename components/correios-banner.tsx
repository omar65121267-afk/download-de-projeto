'use client'

import { useEffect, useState } from 'react'

interface GeoData {
  city: string
  regionName: string
}

export function CorreiosBanner() {
  const [location, setLocation] = useState<GeoData | null>(null)

  useEffect(() => {
    fetch('https://ip-api.com/json/?fields=city,regionName')
      .then(r => r.json())
      .then((data: GeoData) => {
        if (data.city && data.regionName) setLocation(data)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="correios-banner">
      <img src="/assets/correios-logo.png" alt="Correios" className="correios-logo" />
      <div className="correios-info">
        <span className="correios-title">Correios - Envio de 2 a 5 dias</span>
        <span className="correios-sub">
          Envio <b>GRÁTIS</b> para{' '}
          {location ? `${location.city}, ${location.regionName} e Região` : 'todo o Brasil'}
        </span>
      </div>
    </div>
  )
}
