import React, { useState } from 'react'
import { TextField, Typography, Box } from '@mui/material'

/**
 * Campo modificabile: mostra il valore come testo, e al click diventa un
 * input. Il valore viene salvato nello stato globale (e quindi persistito)
 * appena l'utente esce dal campo o preme Invio.
 */
export default function EditableField({
  value,
  onChange,
  type = 'text',
  label,
  multiline = false,
  variant = 'plain', // 'plain' | 'stat' (numero grande centrato)
  suffix = '',
  minWidth = 60,
  fullWidth = false,
  placeholder = ''
}) {
  const [draft, setDraft] = useState(value ?? '')
  const [editing, setEditing] = useState(false)

  const commit = () => {
    setEditing(false)
    let v = draft
    if (type === 'number') {
      v = draft === '' ? 0 : Number(draft)
      if (Number.isNaN(v)) v = 0
    }
    onChange(v)
  }

  if (editing) {
    return (
      <TextField
        autoFocus
        label={label}
        type={type}
        multiline={multiline}
        minRows={multiline ? 3 : 1}
        value={draft}
        placeholder={placeholder}
        fullWidth={fullWidth}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !multiline) commit()
          if (e.key === 'Escape') {
            setDraft(value ?? '')
            setEditing(false)
          }
        }}
        sx={{ minWidth }}
      />
    )
  }

  const displayVal = value === '' || value === null || value === undefined ? placeholder || '—' : value

  if (variant === 'stat') {
    return (
      <Box
        className="editable-stat"
        onClick={() => {
          setDraft(value ?? '')
          setEditing(true)
        }}
        title="Clicca per modificare"
      >
        {displayVal}
        {suffix}
      </Box>
    )
  }

  return (
    <Typography
      component="span"
      className="editable-field"
      onClick={() => {
        setDraft(value ?? '')
        setEditing(true)
      }}
      title="Clicca per modificare"
      sx={{ whiteSpace: multiline ? 'pre-wrap' : 'nowrap' }}
    >
      {displayVal}
      {suffix}
    </Typography>
  )
}
