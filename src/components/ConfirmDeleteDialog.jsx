import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

export default function ConfirmDeleteDialog({
  open,
  title,
  itemName,
  description,
  onClose,
  onConfirm,
  confirmLabel = 'Elimina',
  cancelLabel = 'Annulla'
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title || 'Conferma eliminazione'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description || (
            <>
              Sei sicuro di voler eliminare <strong>{itemName || 'questo elemento'}</strong>?
              <br />
              Questa azione non può essere annullata.
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
