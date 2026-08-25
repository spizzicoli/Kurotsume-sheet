import React from 'react'
import { Box, Typography, Divider, IconButton, Button } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useField } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { newId } from '../utils/dnd'
import EditableField from './EditableField'
import UsageTracker from './UsageTracker'
import SectionCard from './SectionCard'

function FeatureItem({ item, onUpdate, onRemove }) {
  const hasTracker = Number(item.usiMax) > 0

  return (
    <Box className="feature-row">
      <Box className="feature-row__head">
        <Typography className="feature-row__name" component="div">
          <EditableField
            value={item.nome}
            onChange={(v) => onUpdate({ ...item, nome: v })}
            fullWidth
          />
        </Typography>
        <IconButton size="small" onClick={onRemove} aria-label="Rimuovi capacità" className="feature-row__remove">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className="feature-row__desc" component="div">
        <EditableField
          value={item.descrizione}
          onChange={(v) => onUpdate({ ...item, descrizione: v })}
          multiline
          fullWidth
          placeholder="Aggiungi una descrizione…"
        />
      </Box>

      <Box className="feature-row__usage">
        <span className="feature-row__usage-label">
          Utilizzi:{' '}
          <EditableField
            value={item.usiMax || 0}
            onChange={(v) => {
              const usiMax = Math.max(0, Number(v) || 0)
              onUpdate({ ...item, usiMax, usiSpesi: Math.min(item.usiSpesi || 0, usiMax) })
            }}
            type="number"
            minWidth={40}
          />
        </span>
        {hasTracker && (
          <UsageTracker
            usiMax={item.usiMax}
            usiSpesi={item.usiSpesi || 0}
            onChange={(usiSpesi) => onUpdate({ ...item, usiSpesi })}
          />
        )}
      </Box>
    </Box>
  )
}

function FeatureGroup({ title, path }) {
  const [items, setItems] = useField(path) || [[], () => {}]

  const safeItems = Array.isArray(items) ? items : []

  const updateItem = (index, next) => {
    const copy = safeItems.slice()
    copy[index] = next
    setItems(copy)
  }

  const removeItem = (index) => setItems(safeItems.filter((_, i) => i !== index))

  const addItem = () =>
    setItems([
      ...safeItems,
      { id: newId('feat'), nome: 'Nuova capacità', descrizione: '', usiMax: 0, usiSpesi: 0 }
    ])

  return (
    <Box className="features-col">
      <Typography className="features-col__title">{title}</Typography>

      {safeItems.map((item, i) => (
        <FeatureItem
          key={item.id}
          item={item}
          onUpdate={(next) => updateItem(i, next)}
          onRemove={() => removeItem(i)}
        />
      ))}

      <Button
        size="small"
        onClick={addItem}
        startIcon={<AddIcon />}
        className="features-col__add-btn"
      >
        Aggiungi
      </Button>
    </Box>
  )
}

export default function FeaturesPanel() {
  const { cdManovre } = useDerived()

  return (
    <SectionCard title="Talenti e Capacità" large className="features-panel">
      <Box className="features-panel__columns">
        <Box className="features-panel__half">
          <FeatureGroup title="Talenti" path={['featureGroups', 'talenti']} />
          <Divider className="features-divider" />
          <FeatureGroup
            title={`Guerriero 8 · Maestro di Battaglia — CD Manovre ${cdManovre}`}
            path={['featureGroups', 'guerriero']}
          />
        </Box>

        <Box className="features-panel__half">
          <FeatureGroup title="Stregone 3 · Ombra" path={['featureGroups', 'stregone']} />
          <Divider className="features-divider" />
          <FeatureGroup title="Razziali · Shadar-Kai" path={['featureGroups', 'razziali']} />
        </Box>
      </Box>
    </SectionCard>
  )
}
