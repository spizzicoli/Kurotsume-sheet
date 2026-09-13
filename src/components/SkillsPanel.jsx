import React from 'react'
import { Box, Checkbox } from '@mui/material'
import { useCharacter, useCharacterDispatch } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { abilityShort, fmtMod } from '../utils/dnd'
import SectionCard from './SectionCard'

export default function SkillsPanel() {
  const c = useCharacter()
  const dispatch = useCharacterDispatch()
  const { skills } = useDerived()

  const toggleSkill = (index) =>
    dispatch({
      type: 'SET_PATH',
      path: ['skills', index, 'competenza'],
      value: !c.skills[index].competenza
    })

  return (
    <SectionCard title="Abilità" large className="skills-panel">
      <Box className="skills-panel__list">
        {skills.map((s, i) => (
          <Box key={s.id} className={`skills-panel__row ${s.competenza ? 'is-proficient' : ''}`}>
            <Checkbox
              size="small"
              checked={!!s.competenza}
              onChange={() => toggleSkill(i)}
              sx={{ color: 'secondary.main', '&.Mui-checked': { color: 'secondary.main' }, p: 0.5 }}
            />
            <span className="skills-panel__value">{fmtMod(s.bonus)}</span>
            <span className="skills-panel__name">{s.nome}</span>
            <span className="skills-panel__ability">{abilityShort[s.abilita]}</span>
          </Box>
        ))}
      </Box>
    </SectionCard>
  )
}
