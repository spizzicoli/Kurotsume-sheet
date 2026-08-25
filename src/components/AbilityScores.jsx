import React from 'react'
import { Box } from '@mui/material'
import { useCharacter, useCharacterDispatch } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { abilityLabels, abilityShort, fmtMod } from '../utils/dnd'
import EditableField from './EditableField'
import SectionCard from './SectionCard'

export default function AbilityScores() {
  const c = useCharacter()
  const dispatch = useCharacterDispatch()
  const { mods } = useDerived()

  const setScore = (ab, v) => dispatch({ type: 'SET_PATH', path: ['abilities', ab], value: v })

  return (
    <SectionCard title="Caratteristiche" className="ability-scores">
      <Box className="ability-scores__grid">
        {Object.keys(abilityLabels).map((ab) => (
          <Box key={ab} className="ability-card">
            <Box className="ability-card__label">{abilityLabels[ab]}</Box>
            <Box className="ability-card__mod">{fmtMod(mods[ab])}</Box>
            <Box className="ability-card__score">
              <EditableField
                value={c.abilities[ab]}
                onChange={(v) => setScore(ab, v)}
                type="number"
                variant="stat"
              />
            </Box>
            <Box className="ability-card__short">{abilityShort[ab]}</Box>
          </Box>
        ))}
      </Box>
    </SectionCard>
  )
}
