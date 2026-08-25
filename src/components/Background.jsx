import React from 'react'
import { Box } from '@mui/material'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'
import SectionCard from './SectionCard'

export default function Background() {
  const [nomeBg, setNomeBg] = useField(['background', 'nome'])
  const [testo, setTesto] = useField(['background', 'testo'])
  const [personalita, setPersonalita] = useField(['background', 'personalita'])
  const [ideali, setIdeali] = useField(['background', 'ideali'])
  const [legami, setLegami] = useField(['background', 'legami'])
  const [difetti, setDifetti] = useField(['background', 'difetti'])
  const [lingue, setLingue] = useField(['background', 'lingue'])
  const [tratti, setTratti] = useField(['background', 'tratti'])

  return (
    <SectionCard title="Background" className="background-panel">
      <Box className="background-panel__name">
        <EditableField value={nomeBg} onChange={setNomeBg} minWidth={160} />
      </Box>
      <Box className="background-panel__text">
        <EditableField value={testo} onChange={setTesto} multiline fullWidth />
      </Box>

      <Box className="traits-grid">
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Personalità</span>
          <EditableField value={personalita} onChange={setPersonalita} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Ideali</span>
          <EditableField value={ideali} onChange={setIdeali} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Legami</span>
          <EditableField value={legami} onChange={setLegami} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Difetti</span>
          <EditableField value={difetti} onChange={setDifetti} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Lingue parlate</span>
          <EditableField value={lingue} onChange={setLingue} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Tratti / poteri</span>
          <EditableField value={tratti} onChange={setTratti} multiline fullWidth />
        </Box>
      </Box>
    </SectionCard>
  )
}
