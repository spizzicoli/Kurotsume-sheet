import React, { useState } from 'react'
import { Box, IconButton, Button, LinearProgress, Typography, TextField } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useCharacter, useCharacterDispatch } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { newId } from '../utils/dnd'
import EditableField from './EditableField'
import SectionCard from './SectionCard'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

function InventoryRow({ item, index, onUpdate, onRemove, onMove }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const itemLabel = item.nome?.trim() || 'Questo oggetto'

  return (
    <>
      <Box
        className="inventory-item"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', String(index))
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const fromIndex = Number(e.dataTransfer.getData('text/plain'))
          if (!Number.isNaN(fromIndex) && fromIndex !== index) onMove(fromIndex, index)
        }}
      >
        <Box className="inventory-list__row">
          <EditableField
            value={item.nome}
            onChange={(v) => onUpdate(item.id, 'nome', v)}
            fullWidth
          />
          <EditableField
            value={item.peso}
            onChange={(v) => onUpdate(item.id, 'peso', Number(v) || 0)}
            type="number"
          />
          <EditableField
            value={item.quantita}
            onChange={(v) => onUpdate(item.id, 'quantita', Number(v) || 0)}
            type="number"
          />
          <span className="inventory-list__total">
            {((Number(item.peso) || 0) * (Number(item.quantita) || 0)).toFixed(2)}
          </span>
          <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="Rimuovi oggetto">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box className="inventory-item__desc">
          <EditableField
            value={item.descrizione || ''}
            onChange={(v) => onUpdate(item.id, 'descrizione', v)}
            multiline
            fullWidth
            placeholder="Aggiungi una descrizione…"
          />
        </Box>
      </Box>

      <ConfirmDeleteDialog
        open={confirmOpen}
        title="Eliminare l'oggetto?"
        itemName={itemLabel}
        description={`Stai per rimuovere "${itemLabel}" dall'inventario. Vuoi procedere?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          onRemove(item.id)
          setConfirmOpen(false)
        }}
      />
    </>
  )
}

export default function Inventory() {
  const c = useCharacter()
  const dispatch = useCharacterDispatch()
  const { carryCurrent, carryMax, liftMax } = useDerived()
  const [nuovo, setNuovo] = useState({ nome: '', peso: '', quantita: 1 })
  const [customOrder, setCustomOrder] = useState(() => c.inventory.map((item) => item.id))
  const coinLabels = { MR: 'Rame', MA: 'Argento', MO: 'Oro', MP: 'Platino' }

  const percent = carryMax > 0 ? Math.min(100, (carryCurrent / carryMax) * 100) : 0
  const overweight = carryCurrent > carryMax

  const updateItem = (id, field, value) => {
    const next = c.inventory.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    dispatch({ type: 'SET_PATH', path: ['inventory'], value: next })
  }

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    const next = [...c.inventory]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    const nextOrder = next.map((item) => item.id)
    setCustomOrder(nextOrder)
    dispatch({ type: 'SET_PATH', path: ['inventory'], value: next })
  }

  const sortInventoryAlphabetically = () => {
    const next = [...c.inventory].sort((a, b) =>
      (a.nome || '').localeCompare(b.nome || '', undefined, { sensitivity: 'base' })
    )
    dispatch({ type: 'SET_PATH', path: ['inventory'], value: next })
  }

  const sortInventoryByWeight = () => {
    const next = [...c.inventory].sort((a, b) => {
      const weightA = Number(a.peso) || 0
      const weightB = Number(b.peso) || 0
      if (weightA === weightB) {
        return (a.nome || '').localeCompare(b.nome || '', undefined, { sensitivity: 'base' })
      }
      return weightB - weightA
    })
    dispatch({ type: 'SET_PATH', path: ['inventory'], value: next })
  }

  const sortInventoryCustom = () => {
    if (!customOrder.length) return
    const byId = new Map(c.inventory.map((item) => [item.id, item]))
    const next = customOrder
      .map((id) => byId.get(id))
      .filter(Boolean)
    const missing = c.inventory.filter((item) => !customOrder.includes(item.id))
    dispatch({ type: 'SET_PATH', path: ['inventory'], value: [...next, ...missing] })
  }

  const removeItem = (id) => {
    const nextOrder = customOrder.filter((itemId) => itemId !== id)
    setCustomOrder(nextOrder)
    dispatch({ type: 'REMOVE_INVENTORY_ITEM', id })
  }

  const addItem = () => {
    if (!nuovo.nome.trim()) return
    const item = {
      id: newId('item'),
      nome: nuovo.nome.trim(),
      descrizione: '',
      peso: Number(nuovo.peso) || 0,
      quantita: Number(nuovo.quantita) || 1
    }
    setCustomOrder((prev) => [...prev, item.id])
    dispatch({
      type: 'ADD_INVENTORY_ITEM',
      item
    })
    setNuovo({ nome: '', peso: '', quantita: 1 })
  }

  return (
    <SectionCard title="Inventario" className="inventory-panel">
      <Box className="inventory-panel__capacity">
        <Box className="inventory-panel__capacity-text">
          <span className={overweight ? 'is-over' : ''}>
            {carryCurrent.toFixed(2)} kg
          </span>{' '}
          / {carryMax} kg trasportabili · {liftMax} kg sollevabili
        </Box>
        <LinearProgress
          variant="determinate"
          value={percent}
          className={`inventory-panel__bar ${overweight ? 'is-over' : ''}`}
        />
        {overweight && (
          <Typography className="inventory-panel__warning">
            Sei ingombrato: superi il peso trasportabile massimo.
          </Typography>
        )}
      </Box>

      <Box className="inventory-panel__currency" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Monete</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 1 }}>
          {Object.entries(coinLabels).map(([key, label]) => (
            <Box key={key} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box component="span" sx={{ fontSize: '0.72rem', opacity: 0.8 }}>{label}</Box>
              <EditableField
                value={c.currency?.[key] ?? 0}
                onChange={(v) =>
                  dispatch({
                    type: 'SET_PATH',
                    path: ['currency', key],
                    value: Number(v) || 0
                  })
                }
                type="number"
                minWidth={40}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={sortInventoryAlphabetically}>
          Ordina A-Z
        </Button>
        <Button size="small" variant="outlined" onClick={sortInventoryByWeight}>
          Ordina per peso
        </Button>
        <Button size="small" variant="outlined" onClick={sortInventoryCustom}>
          Ordine personalizzato
        </Button>
      </Box>

      <Box className="inventory-list">
        <Box className="inventory-list__row inventory-list__row--head">
          <span>Oggetto</span>
          <span>Peso (kg)</span>
          <span>Qtà</span>
          <span>Tot.</span>
          <span />
        </Box>
        {c.inventory.map((item, index) => (
          <InventoryRow
            key={item.id}
            item={item}
            index={index}
            onUpdate={updateItem}
            onRemove={removeItem}
            onMove={moveItem}
          />
        ))}

        <Box className="inventory-list__row inventory-list__row--new">
          <TextField
            placeholder="Nuovo oggetto…"
            value={nuovo.nome}
            onChange={(e) => setNuovo({ ...nuovo, nome: e.target.value })}
          />
          <TextField
            placeholder="kg"
            type="number"
            value={nuovo.peso}
            onChange={(e) => setNuovo({ ...nuovo, peso: e.target.value })}
          />
          <TextField
            placeholder="Qtà"
            type="number"
            value={nuovo.quantita}
            onChange={(e) => setNuovo({ ...nuovo, quantita: e.target.value })}
          />
          <span />
          <IconButton size="small" onClick={addItem} aria-label="Aggiungi oggetto" color="secondary">
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Button size="small" onClick={addItem} startIcon={<AddIcon />} className="inventory-panel__add-btn">
        Aggiungi oggetto
      </Button>
    </SectionCard>
  )
}
