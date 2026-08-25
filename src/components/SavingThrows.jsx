import React from 'react'
import { Box, Checkbox } from '@mui/material'
import { useCharacter, useCharacterDispatch } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { abilityLabels, fmtMod } from '../utils/dnd'
import SectionCard from './SectionCard'

export default function SavingThrows() {
  const c = useCharacter()
  const dispatch = useCharacterDispatch()
  const { savingThrows, passivePercezione, passiveIndagare, passiveIntuizione, prof } = useDerived()

  const toggle = (ab) =>
    dispatch({ type: 'SET_PATH', path: ['savingThrows', ab], value: !c.savingThrows[ab] })

  return (
    <SectionCard title="Tiri Salvezza" className="saves-panel">
      <Box className="saves-panel__prof">
        Bonus di Competenza <strong>{fmtMod(prof)}</strong>
      </Box>
      <Box className="saves-list">
        {Object.keys(abilityLabels).map((ab) => (
          <Box key={ab} className="saves-list__row">
            <Checkbox
              size="small"
              checked={!!c.savingThrows[ab]}
              onChange={() => toggle(ab)}
              sx={{ color: 'secondary.main', '&.Mui-checked': { color: 'secondary.main' }, p: 0.5 }}
            />
            <span className="saves-list__value">{fmtMod(savingThrows[ab])}</span>
            <span className="saves-list__label">{abilityLabels[ab]}</span>
          </Box>
        ))}
      </Box>

      <Box className="passives">
        <Box className="passives__row">
          <span className="passives__value">{passivePercezione}</span>
          <span className="passives__label">Percezione Passiva</span>
        </Box>
        <Box className="passives__row">
          <span className="passives__value">{passiveIndagare}</span>
          <span className="passives__label">Indagare Passiva</span>
        </Box>
        <Box className="passives__row">
          <span className="passives__value">{passiveIntuizione}</span>
          <span className="passives__label">Intuizione Passiva</span>
        </Box>
      </Box>
    </SectionCard>
  )
}
