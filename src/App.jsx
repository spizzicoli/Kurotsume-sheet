import React, { useState } from 'react'
import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
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
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    setConfirmOpen(false)
  }

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
