import React from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export function Popup({ title, children, openPopup, setOpenPopup }) {
  return (
    <Dialog open={openPopup} maxWidth='md'>
      <DialogTitle>
        <div className='flex space-between'>
          <Typography variant='h6' component='div' style={{ order: 1 }}>
            {title}
          </Typography>
          <Button
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon onClick={() => {
              setOpenPopup(false);
            }} />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
