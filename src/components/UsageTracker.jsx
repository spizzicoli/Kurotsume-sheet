import React from 'react'
import { Box, Tooltip } from '@mui/material'

/**
 * Mostra `usiMax` pallini/checkbox. I primi (usiMax - usiSpesi) sono "pieni"
 * (utilizzo disponibile); cliccando un pallino pieno lo si consuma, cliccando
 * un pallino già speso lo si recupera (utile dopo un riposo).
 */
export default function UsageTracker({ usiMax, usiSpesi, onChange, size = 'normal' }) {
  if (!usiMax) return null
  const disponibili = Math.max(0, usiMax - usiSpesi)

  const handleClick = (index) => {
    // index è la posizione del pallino cliccato (0-based, da sinistra)
    const clickedIsFilled = index < disponibili
    if (clickedIsFilled) {
      // consuma tutti i pallini fino a quello cliccato incluso
      onChange(usiMax - index)
    } else {
      // libera tutti i pallini da quello cliccato in poi
      onChange(usiMax - index - 1)
    }
  }

  return (
    <Box className={`usage-tracker usage-tracker--${size}`}>
      {Array.from({ length: usiMax }).map((_, i) => {
        const filled = i < disponibili
        return (
          <Tooltip key={i} title={filled ? 'Usa' : 'Recupera'} disableInteractive>
            <span
              className={`usage-tracker__dot ${filled ? 'is-filled' : ''}`}
              onClick={() => handleClick(i)}
              role="checkbox"
              aria-checked={filled}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleClick(i)
              }}
            />
          </Tooltip>
        )
      })}
    </Box>
  )
}
