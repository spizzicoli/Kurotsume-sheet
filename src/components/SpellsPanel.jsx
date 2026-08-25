import React, { useMemo } from 'react'
import { Box, Typography, IconButton, Button, Chip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useField } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { newId } from '../utils/dnd'
import EditableField from './EditableField'
import UsageTracker from './UsageTracker'
import SectionCard from './SectionCard'

function levelLabel(lv) {
  return Number(lv) === 0 ? 'Trucchetto' : `Livello ${lv}`
}

function SpellCard({ spell, onUpdate, onRemove }) {
  return (
    <Box className="spell-card">
      <Box className="spell-card__head">
        <Box className="spell-card__name">
          <EditableField value={spell.nome} onChange={(v) => onUpdate({ ...spell, nome: v })} fullWidth />
          {spell.daTalento && <Chip label="Talento" size="small" className="spell-card__talent-chip" />}
        </Box>
        <Box className="spell-card__level">
          <span>Liv.</span>
          <EditableField
            value={spell.livello}
            onChange={(v) => onUpdate({ ...spell, livello: Math.max(0, Number(v) || 0) })}
            type="number"
            minWidth={40}
          />
        </Box>
        <IconButton size="small" onClick={onRemove} aria-label="Rimuovi incantesimo">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className="spell-card__grid">
        <Box className="spell-card__field">
          <span className="spell-card__field-label">Tempo di Lancio</span>
          <EditableField
            value={spell.tempoLancio}
            onChange={(v) => onUpdate({ ...spell, tempoLancio: v })}
            fullWidth
          />
        </Box>
        <Box className="spell-card__field">
          <span className="spell-card__field-label">Tipo di Azione</span>
          <EditableField
            value={spell.tipoAzione}
            onChange={(v) => onUpdate({ ...spell, tipoAzione: v })}
            fullWidth
          />
        </Box>
        <Box className="spell-card__field">
          <span className="spell-card__field-label">Gittata</span>
          <EditableField value={spell.gittata} onChange={(v) => onUpdate({ ...spell, gittata: v })} fullWidth />
        </Box>
        <Box className="spell-card__field">
          <span className="spell-card__field-label">Componenti</span>
          <EditableField
            value={spell.componenti}
            onChange={(v) => onUpdate({ ...spell, componenti: v })}
            fullWidth
          />
        </Box>
      </Box>

      <Box className="spell-card__effect">
        <span className="spell-card__field-label">Effetti</span>
        <EditableField
          value={spell.effetti}
          onChange={(v) => onUpdate({ ...spell, effetti: v })}
          multiline
          fullWidth
          placeholder="Descrivi l'effetto dell'incantesimo…"
        />
      </Box>
    </Box>
  )
}

export default function SpellsPanel() {
  const [incantesimi, setIncantesimi] = useField(['spells', 'incantesimi'])
  const [slots, setSlots] = useField(['spells', 'slots'])
  const [spellPoints, setSpellPoints] = useField(['spells', 'spellPoints'])
  const { spellSaveDC, spellAttackBonus } = useDerived()

  const groups = useMemo(() => {
    const byLevel = new Map()
    incantesimi.forEach((s) => {
      const lv = Number(s.livello) || 0
      if (!byLevel.has(lv)) byLevel.set(lv, [])
      byLevel.get(lv).push(s)
    })
    return Array.from(byLevel.entries()).sort((a, b) => a[0] - b[0])
  }, [incantesimi])

  const updateSpell = (id, next) =>
    setIncantesimi(incantesimi.map((s) => (s.id === id ? next : s)))
  const removeSpell = (id) => setIncantesimi(incantesimi.filter((s) => s.id !== id))
  const addSpell = (livello = 1) =>
    setIncantesimi([
      ...incantesimi,
      {
        id: newId('spell'),
        nome: 'Nuovo incantesimo',
        livello,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: '9 m',
        componenti: 'V, S',
        effetti: '',
        daTalento: false
      }
    ])

  const slotForLevel = (lv) => slots.find((s) => s.livello === lv)

  return (
    <SectionCard title="Incantesimi" className="spells-panel">
      <Box className="spells-panel__header">
        <Box className="spells-panel__stat">
          <span className="spells-panel__stat-value">{spellSaveDC}</span>
          <span className="spells-panel__stat-label">CD Incantesimi</span>
        </Box>
        <Box className="spells-panel__stat">
          <span className="spells-panel__stat-value">
            {spellAttackBonus >= 0 ? `+${spellAttackBonus}` : spellAttackBonus}
          </span>
          <span className="spells-panel__stat-label">Bonus Attacco</span>
        </Box>
        <Box className="spells-panel__stat">
          <span className="spells-panel__stat-value">{spellPoints}</span>
          <span className="spells-panel__stat-label">PS</span>
        </Box>
      </Box>

      <Box className="spell-card spells-panel__conversion">
        <Box className="spell-card__effect">
          <span className="spell-card__field-label">Azione bonus</span>
          <EditableField value="Converte PS in slot incantesimo" onChange={() => {}} fullWidth />
        </Box>

        <Box component="div" sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, fontSize: '0.72rem', color: '#e8dcc4' }}>
          <Box>2 PS → slot 1°</Box>
          <Box>3 PS → slot 2°</Box>
          <Box>5 PS → slot 3°</Box>
        </Box>

        <Box className="spells-panel__ps-editor" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>Punti Stregoneria</span>
          <EditableField value={spellPoints} onChange={(v) => setSpellPoints(Math.max(0, Number(v) || 0))} type="number" minWidth={40} />
        </Box>
      </Box>

      {groups.map(([lv, spellsAtLevel]) => {
        const slot = slotForLevel(lv)
        return (
          <Box className="spells-group" key={lv}>
            <Box className="spells-group__head">
              <Typography className="spells-group__title">{levelLabel(lv)}</Typography>
              {slot && (
                <Box className="spells-group__slot">
                  <UsageTracker
                    usiMax={slot.usiMax}
                    usiSpesi={slot.usiSpesi}
                    size="small"
                    onChange={(v) => {
                      const next = slots.map((s) => (s.livello === lv ? { ...s, usiSpesi: v } : s))
                      setSlots(next)
                    }}
                  />
                  <span className="spells-group__slot-count">
                    slot:{' '}
                    <EditableField
                      value={slot.usiMax}
                      onChange={(v) => {
                        const usiMax = Math.max(0, Number(v) || 0)
                        const next = slots.map((s) =>
                          s.livello === lv
                            ? { ...s, usiMax, usiSpesi: Math.min(s.usiSpesi, usiMax) }
                            : s
                        )
                        setSlots(next)
                      }}
                      type="number"
                      minWidth={30}
                    />
                  </span>
                </Box>
              )}
            </Box>

            {spellsAtLevel.map((s, i) => (
              <SpellCard
                key={s.id || i}
                spell={s}
                onUpdate={(next) => updateSpell(s.id, next)}
                onRemove={() => removeSpell(s.id)}
              />
            ))}
          </Box>
        )
      })}

      <Button size="small" onClick={() => addSpell(1)} startIcon={<AddIcon />} className="spells-panel__add-btn">
        Aggiungi incantesimo
      </Button>
    </SectionCard>
  )
}
