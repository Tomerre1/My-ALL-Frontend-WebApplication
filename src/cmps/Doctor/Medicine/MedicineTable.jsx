import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Popup } from '../../Popup/Popup';
import { MedicineAddEdit } from './MedicineAddEdit';
import Button from '../../controls/Button';
import { MedicineRow } from './MedicineRow';
import { medicineService } from './../../../services/medicine.service';
import { CmpHeader } from '../../Header/CmpHeader'
export function MedicineTable() {
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [medicines, setMedicines] = useState([]);

  const openInPopup = (row) => {
    setRecordForEdit(row);
    setOpenPopup(true);
  };

  useEffect(() => {
    async function queryMedicines() {
      const medicines = await medicineService.query();
      setMedicines(medicines);
    }
    queryMedicines();
  }, []);

  const addOrEdit = async (record) => {
    if (recordForEdit) {
      const updatedMedicine = await medicineService.updateMedicine(record);
      const newMedicines = medicines.map((medicine) =>
        medicine.medicineName === record.medicineName
          ? updatedMedicine
          : medicine
      );
      setMedicines(newMedicines);
    } else {
      const newMedicine = await medicineService.addMedicine(record);
      setMedicines([...medicines, newMedicine]);
    }
    setOpenPopup(false);
  };

  const deleteMedicine = async (deleteMedicine) => {
    await medicineService.removeMedicine(deleteMedicine);
    const newMedicines = medicines.filter(
      (medicine) => medicine.medicineName !== deleteMedicine.medicineName
    );
    setMedicines(newMedicines);
  };

  return (
    <>
      <CmpHeader title="ניהול תרופות" />
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table' >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='right'>שם תרופה</TableCell>
              <TableCell align='right'>שלב תרופה</TableCell>
              <TableCell align='right'>מינון תרופה</TableCell>
              <TableCell align='right'>צורך בצום</TableCell>
              <TableCell align='right'>ימים</TableCell>
              <TableCell align='right'>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((row) => (
              <MedicineRow
                key={row.medicineName}
                row={row}
                openInPopup={openInPopup}
                deleteMedicine={deleteMedicine}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popup
        title={recordForEdit ? 'עריכת תרופה' : 'הוספת תרופה'}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MedicineAddEdit
          recordForEdit={recordForEdit}
          addOrEdit={addOrEdit}
          setRecordForEdit={setRecordForEdit}
          isRow={true}
        />
      </Popup>
      <div style={{ direction: 'rtl', paddingTop: '20px' }}>
        <Button onClick={() => {
          setOpenPopup(true); setRecordForEdit(null);
        }} text='הוספת תרופה' />
      </div>
    </>
  );
}
