import { createTheme } from '@mui/material/styles'

// Palette ispirata a Kurotsume: piano d'ombra (indaco-inchiostro),
// acciaio della katana, oro dell'armatura, rosso "spietato" del sangue rituale.
export const palette = {
  ink: '#0e1017',
  inkPanel: '#171a26',
  inkPanelAlt: '#1d2233',
  steel: '#5c85ab',
  steelDim: '#3a5170',
  gold: '#c9a227',
  goldBright: '#e3bd52',
  blood: '#8c2a3a',
  bloodBright: '#c1465a',
  parchment: '#ece7da',
  parchmentDim: '#a9a898',
  line: 'rgba(201,162,39,0.18)'
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: palette.ink,
      paper: palette.inkPanel
    },
    primary: { main: palette.steel, contrastText: palette.parchment },
    secondary: { main: palette.gold, contrastText: palette.ink },
    error: { main: palette.bloodBright },
    text: {
      primary: palette.parchment,
      secondary: palette.parchmentDim
    },
    divider: palette.line
  },
  typography: {
    fontFamily: '"EB Garamond", "Georgia", serif',
    h1: { fontFamily: '"Cinzel", serif' },
    h2: { fontFamily: '"Cinzel", serif' },
    h3: { fontFamily: '"Cinzel", serif' },
    h4: { fontFamily: '"Cinzel", serif' },
    h5: { fontFamily: '"Cinzel", serif' },
    h6: { fontFamily: '"Cinzel", serif', letterSpacing: '0.04em' }
  },
  shape: { borderRadius: 6 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTextField: {
      defaultProps: { size: 'small' }
    }
  }
})

export default theme
