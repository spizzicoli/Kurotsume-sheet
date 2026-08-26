import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { useCharacter, useCharacterDispatch, useField } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { fmtMod } from '../utils/dnd'
import EditableField from './EditableField'
import UsageTracker from './UsageTracker'
import SectionCard from './SectionCard'

export default function CombatStats() {
  const character = useCharacter()
  const dispatch = useCharacterDispatch()
  const [acBase, setAcBase] = useField(['combat', 'acBase'])
  const [acAltriBonus, setAcAltriBonus] = useField(['combat', 'acAltriBonus'])
  const [hpMax, setHpMax] = useField(['combat', 'hpMax'])
  const [hpCurrent, setHpCurrent] = useField(['combat', 'hpCurrent'])
  const [hpTemp, setHpTemp] = useField(['combat', 'hpTemp'])
  const [hitDice, setHitDice] = useField(['combat', 'hitDice'])
  const [damageTaken, setDamageTaken] = useState('')
  const { ac, initiative } = useDerived()

  const handleDamageSubmit = (value) => {
    const dmg = Number(value) || 0
    if (dmg === 0) {
      setDamageTaken('')
      return
    }

    setHpCurrent(Number(hpCurrent || 0) - dmg)
    setDamageTaken('')
  }

  const handleShortRest = () => {
    const resetFeatureGroups = Object.fromEntries(
      Object.entries(character.featureGroups || {}).map(([groupName, entries]) => [
        groupName,
        (Array.isArray(entries) ? entries : []).map((entry) => {
          const description = entry.descrizione || ''
          const isShortRestRechargable = /riposo breve/i.test(description)
          const isLongRestOnly = /riposo lungo/i.test(description) && !/riposo breve/i.test(description)

          if (isLongRestOnly || !isShortRestRechargable) return entry
          return { ...entry, usiSpesi: 0 }
        })
      ])
    )

    dispatch({ type: 'SET_PATH', path: ['featureGroups'], value: resetFeatureGroups })
  }

  const handleLongRest = () => {
    const resetFeatureGroups = Object.fromEntries(
      Object.entries(character.featureGroups || {}).map(([groupName, entries]) => [
        groupName,
        (Array.isArray(entries) ? entries : []).map((entry) => ({ ...entry, usiSpesi: 0 }))
      ])
    )

    dispatch({ type: 'SET_PATH', path: ['combat', 'hpCurrent'], value: Number(hpMax) || 0 })
    dispatch({ type: 'SET_PATH', path: ['combat', 'hpTemp'], value: 0 })
    dispatch({ type: 'SET_PATH', path: ['combat', 'hitDice'], value: hitDice.map((hd) => ({ ...hd, usati: 0 })) })
    dispatch({ type: 'SET_PATH', path: ['spells', 'slots'], value: (character.spells?.slots || []).map((slot) => ({ ...slot, usiSpesi: 0 })) })
    dispatch({ type: 'SET_PATH', path: ['spells', 'spellPoints'], value: 3 })
    dispatch({ type: 'SET_PATH', path: ['featureGroups'], value: resetFeatureGroups })
  }

  return (
    <SectionCard title="Combattimento" className="combat-panel">
      <Box className="combat-top">
        <Box className="combat-stat combat-stat--ac">
          <Box className="combat-stat__value">
            {ac}
          </Box>
          <Box className="combat-stat__label">
            Classe Armatura
            <Box className="combat-stat__hint">
              base <EditableField value={acBase} onChange={setAcBase} type="number" /> · altri{' '}
              <EditableField value={acAltriBonus} onChange={setAcAltriBonus} type="number" />
            </Box>
          </Box>
        </Box>
        <Box className="combat-stat">
          <Box className="combat-stat__value">{fmtMod(initiative)}</Box>
          <Box className="combat-stat__label">Iniziativa</Box>
        </Box>
      </Box>

      <Box className="hp-block">
        <Box className="hp-block__row">
          <span>PF Attuali</span>
          <EditableField value={hpCurrent} onChange={setHpCurrent} type="number" variant="stat" />
        </Box>
        <Box className="hp-block__row">
          <span>Danni</span>
          <EditableField
            value={damageTaken}
            onChange={handleDamageSubmit}
            type="number"
            variant="stat"
            placeholder="0"
          />
        </Box>
        <Box className="hp-block__row">
          <span>PF Massimi</span>
          <EditableField value={hpMax} onChange={setHpMax} type="number" variant="stat" />
        </Box>
        <Box className="hp-block__row">
          <span>PF Temporanei</span>
          <EditableField value={hpTemp} onChange={setHpTemp} type="number" variant="stat" />
        </Box>
      </Box>

      <Box className="hit-dice">
        <Box className="hit-dice__title">Dadi Vita</Box>
        {hitDice.map((hd, i) => (
          <Box key={hd.id} className="hit-dice__row">
            <span className="hit-dice__label">
              {hd.totale}{hd.dado} ({hd.classe})
            </span>
            <UsageTracker
              usiMax={hd.totale}
              usiSpesi={hd.usati}
              size="small"
              onChange={(usati) => {
                const next = hitDice.map((h, idx) => (idx === i ? { ...h, usati } : h))
                setHitDice(next)
              }}
            />
          </Box>
        ))}
      </Box>

      <Box className="rest-buttons">
        <Button size="small" variant="outlined" color="secondary" className="rest-btn" onClick={handleShortRest}>
          Riposo breve
        </Button>
        <Button size="small" variant="outlined" color="secondary" className="rest-btn rest-btn--long" onClick={handleLongRest}>
          Riposo lungo
        </Button>
      </Box>
      <Box className="rest-help">
        Riposo breve ricarica abilità e usi collegati al riposo breve; riposo lungo rigenera PF, dadi vita e tutte le risorse di lunga durata.
      </Box>
    </SectionCard>
  )
}
