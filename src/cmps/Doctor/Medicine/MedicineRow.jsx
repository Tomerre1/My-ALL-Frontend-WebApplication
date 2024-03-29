import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const MedicineRow = ({ row, openInPopup, deleteMedicine }) => {
  const [open, setOpen] = useState(false);
  return (

    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align='right' component='th' scope='row' >
          {row.medicineName}
        </TableCell>
        <TableCell align='right'>{row?.levels?.join(', ') || ''}</TableCell>
        <TableCell align='right'>{row.count}</TableCell>
        <TableCell align='right'>{row.foodOrNot}</TableCell>
        <TableCell align='right'>{row?.days.join(', ') || ''}</TableCell>
        <TableCell align='right'>
          <EditIcon onClick={() => openInPopup(row)} />
          <DeleteIcon onClick={() => deleteMedicine(row)} />
        </TableCell>
      </TableRow>
      <TableRow align='right'>
        <TableCell align='right' colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}  >
          <Collapse in={open} timeout='auto' unmountOnExit align='right' >
            <Box
              sx={{
                margin: 1,
                textAlign: 'right',
              }}
            >
              <Typography variant='h6' gutterBottom component='div' style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                תיאור תרופה
              </Typography>
              <p>{row.description}</p>
              {row.badInfluence && <Typography variant='h6' gutterBottom component='div'>
                תופעות לוואי לתרופה
              </Typography>}

              {row.badInfluence.map((item) => (
                <p key={item.id}>{item}</p>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
