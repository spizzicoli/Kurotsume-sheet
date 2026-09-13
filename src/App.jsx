import React, { useState } from 'react'
import {
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Link
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import CloudSyncIcon from '@mui/icons-material/CloudSync'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import { useCharacterSync } from './context/CharacterContext'

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

function CenteredMessage({ children }) {
  return (
    <Box className="app-status-screen">
      <Box className="app-status-screen__inner">{children}</Box>
    </Box>
  )
}

function NoConfigScreen() {
  return (
    <CenteredMessage>
      <Typography variant="h5" className="app-status-screen__title">
        Configurazione Supabase mancante
      </Typography>
      <Typography className="app-status-screen__text">
        Per usare la scheda serve collegarla al tuo progetto Supabase. Crea un file{' '}
        <code>.env</code> nella cartella del progetto (puoi copiare{' '}
        <code>.env.example</code>) con:
      </Typography>
      <Box component="pre" className="app-status-screen__code">
{`VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-anon-pubblica`}
      </Box>
      <Typography className="app-status-screen__text">
        Trovi questi valori in Supabase → Project Settings → API. Dopo averli inseriti,
        riavvia <code>npm run dev</code> (o rifai la build per l'app iOS).
      </Typography>
    </CenteredMessage>
  )
}

function LoadingScreen() {
  return (
    <CenteredMessage>
      <CircularProgress color="secondary" size={32} />
      <Typography className="app-status-screen__text" sx={{ mt: 2 }}>
        Carico la scheda da Supabase…
      </Typography>
    </CenteredMessage>
  )
}

function ErrorScreen({ error }) {
  return (
    <CenteredMessage>
      <Typography variant="h5" className="app-status-screen__title">
        Impossibile contattare Supabase
      </Typography>
      <Typography className="app-status-screen__text">
        Verifica la connessione internet, l'URL/chiave nel file <code>.env</code> e che
        la query di creazione delle tabelle sia stata eseguita nel progetto Supabase.
      </Typography>
      {error && <Box component="pre" className="app-status-screen__code">{error}</Box>}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
      >
        Riprova
      </Button>
    </CenteredMessage>
  )
}

function SyncIndicator() {
  const { isSaving, error } = useCharacterSync()

  let icon = <CloudDoneIcon fontSize="small" />
  let label = 'Sincronizzato con Supabase'
  if (error) {
    icon = <CloudOffIcon fontSize="small" />
    label = 'Errore di sincronizzazione'
  } else if (isSaving) {
    icon = <CloudSyncIcon fontSize="small" className="sync-indicator__spin" />
    label = 'Salvataggio…'
  }

  return (
    <Box className={`sync-indicator ${error ? 'is-error' : ''}`}>
      {icon}
      <span>{label}</span>
    </Box>
  )
}

function CharacterSheet() {
  const { resetToDefaults } = useCharacterSync()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleReset = () => {
    resetToDefaults()
    setConfirmOpen(false)
  }

  return (
    <Box className="sheet-app">
      <Header />

      <Container maxWidth="xl" className="sheet-grid-container">
        <Box className="sheet-grid">
          <Box className="sheet-grid__col sheet-grid__col--left">
            <AbilityScores />
            <SavingThrows />
            <CombatStats />
            <Attacks />
          </Box>

          <Box className="sheet-grid__col sheet-grid__col--center">
            <SkillsPanel />
          </Box>

          <Box className="sheet-grid__col sheet-grid__col--right">
            <FeaturesPanel />
            <SpellsPanel />
          </Box>
        </Box>

        <Box className="sheet-grid sheet-grid--bottom">
          <Inventory />
          <Background />
          <Notes />
        </Box>

        <Box className="sheet-footer">
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={() => setConfirmOpen(true)}
          >
            Ripristina dati originali
          </Button>
          <SyncIndicator />
          <span className="sheet-footer__hint">
            Le modifiche vengono salvate automaticamente su Supabase.
          </span>
        </Box>
      </Container>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Ripristinare la scheda?</DialogTitle>
        <DialogContent>
          Tutti i dati salvati su Supabase verranno sovrascritti con i dati originali di
          Kurotsume.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Annulla</Button>
          <Button color="error" onClick={handleReset}>Ripristina</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default function App() {
  const { status, error } = useCharacterSync()

  if (status === 'no-config') return <NoConfigScreen />
  if (status === 'loading') return <LoadingScreen />
  if (status === 'error') return <ErrorScreen error={error} />
  return <CharacterSheet />
}
