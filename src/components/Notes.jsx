import React, { useState } from 'react'
import { Box, IconButton, Button } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'
import SectionCard from './SectionCard'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

function NoteRow({ note, index, onUpdate, onRemove }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const noteLabel = note?.trim() || 'Questa nota'

  return (
    <>
      <Box className="notes-list__row">
        <span className="notes-list__bullet">–</span>
        <EditableField value={note} onChange={(v) => onUpdate(index, v)} fullWidth />
        <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="Rimuovi nota">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <ConfirmDeleteDialog
        open={confirmOpen}
        title="Eliminare la nota?"
        itemName={noteLabel}
        description={`Stai per rimuovere "${noteLabel}" dalla scheda. Vuoi procedere?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          onRemove(index)
          setConfirmOpen(false)
        }}
      />
    </>
  )
}

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
          <NoteRow key={i} note={n} index={i} onUpdate={updateNote} onRemove={removeNote} />
        ))}
      </Box>
      <Button size="small" onClick={addNote} startIcon={<AddIcon />} className="notes-panel__add-btn">
        Aggiungi nota
      </Button>
    </SectionCard>
  )
}
