import React from 'react'
import { Box, Grid, Typography, Checkbox, FormControlLabel } from '@mui/material'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'

export default function Header() {
  const [nome, setNome] = useField(['info', 'nome'])
  const [razza, setRazza] = useField(['info', 'razza'])
  const [classi] = useField(['info', 'classi'])
  const [livelloTotale, setLivelloTotale] = useField(['info', 'livelloTotale'])
  const [allineamento, setAllineamento] = useField(['info', 'allineamento'])
  const [eta, setEta] = useField(['info', 'eta'])
  const [taglia, setTaglia] = useField(['info', 'taglia'])
  const [velocita, setVelocita] = useField(['info', 'velocita'])
  const [esperienza, setEsperienza] = useField(['info', 'esperienza'])
  const [ispirazione, setIspirazione] = useField(['info', 'ispirazioneEroica'])
  const [immagine] = useField(['info', 'immagine'])

  const classiTesto = classi.map((c) => `${c.nome} ${c.livello} (${c.sottoclasse})`).join(' / ')

  return (
    <Box className="char-header" component="header">
      <Box className="char-header__ornament" aria-hidden="true" />
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center" className="char-header__inner">
        <Grid item xs="auto">
          <Box className="char-header__portrait-frame">
            <img src={immagine} alt={`Ritratto di ${nome}`} className="char-header__portrait" />
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="h1" className="char-header__name">
            <EditableField value={nome} onChange={setNome} minWidth={200} />
          </Typography>
          <Typography className="char-header__subline">
            <EditableField value={razza} onChange={setRazza} minWidth={160} /> · {classiTesto}
          </Typography>

          <Box className="char-header__meta">
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Livello</span>
              <EditableField value={livelloTotale} onChange={setLivelloTotale} type="number" />
            </Box>
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Allineamento</span>
              <EditableField value={allineamento} onChange={setAllineamento} minWidth={100} />
            </Box>
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Età</span>
              <EditableField value={eta} onChange={setEta} type="number" />
            </Box>
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Taglia</span>
              <EditableField value={taglia} onChange={setTaglia} minWidth={70} />
            </Box>
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Velocità</span>
              <EditableField value={velocita} onChange={setVelocita} type="number" suffix=" m" />
            </Box>
            <Box className="char-header__meta-item">
              <span className="char-header__meta-label">Esperienza</span>
              <EditableField value={esperienza} onChange={setEsperienza} minWidth={70} />
            </Box>
          </Box>

          <FormControlLabel
            className="char-header__inspiration"
            control={
              <Checkbox
                checked={!!ispirazione}
                onChange={(e) => setIspirazione(e.target.checked)}
                sx={{ color: 'secondary.main', '&.Mui-checked': { color: 'secondary.main' } }}
              />
            }
            label="Ispirazione Eroica"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
