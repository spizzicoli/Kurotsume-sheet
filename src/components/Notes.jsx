import React from 'react'
import { Box, IconButton, Button } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'
import SectionCard from './SectionCard'

export default function Notes() {
  const [note, setNote] = useField(['note'])

  const updateNote = (i, v) => {
    const next = note.map((n, idx) => (idx === i ? v : n))
    setNote(next)
  }
  const removeNote = (i) => setNote(note.filter((_, idx) => idx !== i))
  const addNote = () => setNote([...note, 'Nuova nota…'])

  return (
    <SectionCard title="Note del Giocatore" className="notes-panel">
      <Box className="notes-list">
        {note.map((n, i) => (
          <Box key={i} className="notes-list__row">
            <span className="notes-list__bullet">–</span>
            <EditableField value={n} onChange={(v) => updateNote(i, v)} fullWidth />
            <IconButton size="small" onClick={() => removeNote(i)} aria-label="Rimuovi nota">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button size="small" onClick={addNote} startIcon={<AddIcon />} className="notes-panel__add-btn">
        Aggiungi nota
      </Button>
    </SectionCard>
  )
}
