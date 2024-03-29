import React, { useState, useEffect } from 'react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Popup } from '../cmps/Popup/Popup';
import { medicineService } from '../services/medicine.service';
import { AddMedicine } from '../cmps/UserMedicine/AddMedicine'
import { useSelector, useDispatch } from 'react-redux';
import { CmpHeader } from '../cmps/Header/CmpHeader'
import { Loader } from '../cmps/Loader/Loader'
import { setLoadingOn, setLoadingOff } from '../store/system.actions'

export function MedicinesChecklist() {
    const [selected, setSeleceted] = useState(new Date().toLocaleDateString('he-IL', { weekday: 'long' }).split(' ')[1])
    const [selectedDayMedicines, setSelectedDayMedicines] = useState([])
    const [openPopup, setOpenPopup] = useState(false);
    const [userMedicines, setUserMedicines] = useState([])
    const [allmedicines, setAllMedicines] = useState([])
    const user = useSelector(state => state.userReducer.user)
    const isLoading = useSelector(state => state.systemReducer.isLoading)
    const dispatch = useDispatch()
    const days = ['שבת', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי']
    const weekDaysOrganized = ['שבת', 'שישי', 'חמישי', 'רביעי', 'שלישי', 'שני', 'ראשון']

    useEffect(() => {
        getMedicinesByDay()
    }, [selected, userMedicines])

    useEffect(() => {
        async function getMedicines() {
            dispatch(setLoadingOn())
            if (selected === 'ראשון') {
                Promise.all([await medicineService.resetUserMedicineForNewWeek(user.mail), await medicineService.queryMedicines(user.mail), await medicineService.query()]).then(values => {
                    setUserMedicines(values[1])
                    setAllMedicines(values[2])
                });
            } else {
                Promise.all([await medicineService.queryMedicines(user.mail), await medicineService.query()]).then(values => {
                    setUserMedicines(values[0])
                    setAllMedicines(values[1])
                });
            }
            dispatch(setLoadingOff())
        }
        getMedicines()
    }, [user])

    const onChangeDay = (event) => {
        const { value } = event.target
        setSeleceted(value)
    }

    const onAddMedicine = (values) => {
        const dayIdx = days.reverse().indexOf(selected)
        const medicine = userMedicines[dayIdx].find(med => med.medicineName === values.medicineName)
        const newMedicine = { ...medicine, ...values, isActive: false }
        if (!medicine) {
            const dayMedicines = userMedicines[dayIdx]
            const newDayMedicines = [...dayMedicines, newMedicine]
            userMedicines[dayIdx] = newDayMedicines
            setSelectedDayMedicines(userMedicines[dayIdx])

        } else {
            const updatedUserMedicines = userMedicines[dayIdx].map(med => med.medicineName === values.medicineName ? newMedicine : med)
            setSelectedDayMedicines(updatedUserMedicines)
        }
        medicineService.addUserMedicineChecklist(newMedicine, user.mail, selected)
        setUserMedicines(userMedicines)
        setOpenPopup(false)
    }

    const getMedicinesByDay = () => {
        const day = days.reverse().indexOf(selected)
        setSelectedDayMedicines(userMedicines[day])
    }

    const onClickMedicine = (medName) => {
        const todayMeds = [...selectedDayMedicines]
        const index = todayMeds.findIndex(med => med.medicineName === medName)
        todayMeds[index].isActive = !todayMeds[index].isActive
        setSelectedDayMedicines(todayMeds)
        medicineService.updateUserMedicineActive(medName, user.mail, selected)
    }

    const onDeleteMedicine = (medName) => {
        const dayIdx = days.reverse().indexOf(selected)
        const todayMeds = selectedDayMedicines.filter(med => med.medicineName !== medName)
        userMedicines[dayIdx] = todayMeds
        setUserMedicines(userMedicines)
        setSelectedDayMedicines(todayMeds)
        medicineService.removeUserMedicine(medName, user.mail, selected)
    }

    const getDateByDaySelected = () => {
        const today = new Date().toLocaleDateString('he-IL', { weekday: 'long' }).split(' ')[1]
        const dayIndex = (selected === today) ? 0 : days.indexOf(selected)
        // console.log('%c  dayIndex:', 'color: white;background: red;', dayIndex);
        const date = new Date(new Date().setDate(new Date().getDate() + dayIndex))
        // console.log('%c  date:', 'color: white;background: red;', date);
        const day = date.toLocaleDateString('he-IL').split('.')[0]
        const month = date.toLocaleDateString('he-IL', { month: 'long' });
        const year = date.getFullYear()
        return { day, month, year }
    }

    const dateBySelectedDay = getDateByDaySelected()

    return (isLoading) ?
        <Loader />
        :
        <>
            <CmpHeader title='התרופות שלי' />
            <div className="container flex column align-center justify-center">
                <div className="switches-container">
                    {weekDaysOrganized.map((day) => <input type="radio" onChange={onChangeDay} id={day} name="switchPlan" value={day} checked={selected === day} />)}
                    {weekDaysOrganized.map((day) => <label for={day}>{day}</label>)}
                    <div className="switch-wrapper">
                        <div className="switch">
                            {weekDaysOrganized.map((day) => <div>{day}</div>)}
                        </div>
                    </div>
                </div>
                <div className="todolist flex align-center justify-center">
                    <div className="todolist__main flex column">
                        <div className="todolist__header">
                            <div className="todolist__header--date flex align-center">
                                <span className="date--day">{`יום ${selected}`}</span>
                                <div className="warpper flex column">
                                    <span className="date--month">{dateBySelectedDay.month}</span>
                                    <span className="date--year">{dateBySelectedDay.year}</span>
                                </div>
                                <button onClick={() => setOpenPopup(true)} className="add__circle clean-btn"><AddCircleOutlineIcon /></button>
                            </div>
                        </div>
                        <div className="todolist__result">
                            <ul className="clean-list">
                                {selectedDayMedicines?.length > 0 ? selectedDayMedicines.map(med => <li onClick={() => onClickMedicine(med.medicineName)} className="list__task flex align-center space-between">
                                    <div className="flex">
                                        <button className={`list__task--check clean-btn ${med.isActive ? 'active' : ''}`}> {!med.isActive ? <RadioButtonUncheckedRoundedIcon /> : <CheckCircleOutlineRoundedIcon />}</button>
                                        <div className={`list__task--text ${med.isActive ? 'active' : ''}`}>{`${med.medicineName} ${med.count}`}</div>
                                    </div>
                                    <div className="wrapper--left">
                                        <button onClick={(e) => { e.stopPropagation(); onDeleteMedicine(med.medicineName); }} className={`list__task--del clean-btn ${med.isActive ? 'active' : ''}`}><DeleteForeverRoundedIcon /></button>
                                    </div>
                                </li>) :
                                    <h1>אין תרופות להיום</h1>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
            <Popup
                title={'הוספת תרופה'}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <AddMedicine day={selected} medicines={allmedicines} isRow={false} addMedicine={onAddMedicine} />
            </Popup>
        </>
}

export default MedicinesChecklist;
