import React, { useRef, useState } from 'react'
import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useCharacter, useCharacterDispatch } from './context/CharacterContext'

import Header from './components/Header'
import AbilityScores from './components/AbilityScores'
import SavingThrows from './components/SavingThrows'
import SkillsPanel from './components/SkillsPanel'
import CombatStats from './components/CombatStats'
import Attacks from './components/Attacks'
import FeaturesPanel from './components/FeaturesPanel'
import SpellsPanel from './components/SpellsPanel'
import Inventory from './components/Inventory'
import Background from './components/Background'
import Notes from './components/Notes'

export default function App() {
  const character = useCharacter()
  const dispatch = useCharacterDispatch()
  const fileInputRef = useRef(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Reimposta la scheda ai dati iniziali di Kurotsume.
  const handleReset = () => {
    dispatch({ type: 'RESET' })
    setConfirmOpen(false)
  }

  // Esporta lo stato attuale della scheda come file JSON per fare un backup locale.
  const handleSave = () => {
    const payload = JSON.stringify(character, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'kurotsume-sheet-backup.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Carica un backup JSON precedentemente salvato e sostituisce lo stato attuale.
  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('File non valido')
      }
      dispatch({ type: 'IMPORT', payload: parsed })
    } catch (error) {
      console.error('Import backup fallito:', error)
      window.alert('File non valido: seleziona un backup JSON della scheda.')
    } finally {
      event.target.value = ''
    }
  }

  // Apre il repository GitHub del progetto in una nuova scheda del browser.
  const handleOpenGithub = () => {
    window.open('https://github.com/spizzicoli/Kurotsume-sheet', '_blank', 'noopener,noreferrer')
  }

  return (
    <Box className="sheet-app">
      <Header />

      <Container maxWidth="xl" className="sheet-grid-container">
        <Box className="sheet-grid">
          <Box className="sheet-row sheet-row--three">
            <AbilityScores />
            <SavingThrows />
            <SkillsPanel />
          </Box>

          <Box className="sheet-row sheet-row--two">
            <CombatStats />
            <Attacks />
          </Box>

          <Box className="sheet-row sheet-row--two">
            <FeaturesPanel />
            <SpellsPanel />
          </Box>

          <Box className="sheet-row sheet-row--two">
            <Inventory />
            <Background />
          </Box>

          <Box className="sheet-row sheet-row--single">
            <Notes />
          </Box>
        </Box>

        <Box className="sheet-footer">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<SaveAltIcon />}
              onClick={handleSave}
            >
              Salva modifiche
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Carica file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImport}
            />
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<GitHubIcon />}
              onClick={handleOpenGithub}
            >
              Repo GitHub
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<RestartAltIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              Ripristina dati originali
            </Button>
          </Box>
          <span className="sheet-footer__hint">
            Le modifiche vengono salvate automaticamente in questo browser. Per il push diretto su GitHub serve un ambiente con Git autenticato.
          </span>
        </Box>
      </Container>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Ripristinare la scheda?</DialogTitle>
        <DialogContent>
          Tutte le modifiche salvate verranno perse e la scheda tornerà ai dati originali di Kurotsume.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Annulla</Button>
          <Button color="error" onClick={handleReset}>Ripristina</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
