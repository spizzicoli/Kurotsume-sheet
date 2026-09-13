import React from 'react'
import { Paper, Box, Typography } from '@mui/material'

export default function SectionCard({ title, icon, className = '', large = false, children, action }) {
  return (
    <Paper
      component="section"
      elevation={0}
      className={`section-card ${large ? 'section-card--large' : ''} ${className}`}
    >
      <Box className="section-card__header">
        <Typography variant="h6" component="h2" className="section-card__title">
          {icon && <span className="section-card__icon">{icon}</span>}
          {title}
        </Typography>
        {action}
      </Box>
      <Box className="section-card__body">{children}</Box>
    </Paper>
  )
}
