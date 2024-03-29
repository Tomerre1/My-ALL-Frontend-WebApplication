import React, { useState, useEffect } from 'react';
import Controls from '../../controls/Controls';

export function MedicineAddEdit({ addOrEdit, recordForEdit, isRow }) {
  const initialFValues = {
    medicineName: '',
    description: '',
    foodOrNot: 'ללא צום',
    count: '',
    levels: [],
    badInfluence: [],
    days: []
  };
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const levels = [{ id: 1, title: 'שלב א' }, { id: 2, title: 'שלב ב' }, { id: 3, title: 'שלב ג' }, { id: 4, title: 'שלב ד' }, { id: 5, title: 'שלב ה' }];
  const badInfluenceOptions = [{ id: 'הקאות', title: 'הקאות' }, { id: 'כאב בטן', title: 'כאב בטן' }, { id: 'כאב ראש', title: 'כאב ראש' }, { id: 'חום', title: 'חום' }]
  const genderItems = [
    { id: 'ללא צום', title: 'ללא צום' },
    { id: 'צום', title: 'צום' },
  ];
  const dayOptions = [{ id: 'ראשון', title: 'ראשון' }, { id: 'שני', title: 'שני' }, { id: 'שלישי', title: 'שלישי' }, { id: 'רביעי', title: 'רביעי' }, { id: 'חמישי', title: 'חמישי' }, { id: 'שישי', title: 'שישי' }, { id: 'שבת', title: 'שבת' }];

  const handleChangeMultiSelect = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: typeof value === 'string' ? value.split(',') : value
    });
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('medicineName' in fieldValues)
      temp.medicineName = fieldValues.medicineName.length > 0
        ? ''
        : 'נדרש למלא שם תרופה';
    if ('description' in fieldValues)
      temp.description = fieldValues.description.length > 0
        ? ''
        : 'נדרש למלא תיאור תרופה';
    if ('count' in fieldValues)
      temp.count =
        fieldValues.count.length > 0
          ? ''
          : 'נדרש למלא מינון תרופה.'
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values);

    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}
    >
      <Controls.Input
        name='medicineName'
        label='שם תרופה'
        value={values.medicineName}
        onChange={handleInputChange}
        disabled={recordForEdit ? true : false}
        error={errors.medicineName}
      />
      <Controls.Input
        label='תיאור תרופה'
        rows={5}
        name='description'
        value={values.description}
        onChange={handleInputChange}
        error={errors.description}
      />
      <Controls.Select
        name='levels'
        label='שלב תרופה'
        isMultiple={true}
        value={values.levels}
        onChange={handleChangeMultiSelect}
        options={levels}
        error={errors.levels}
      />
      <Controls.Select
        name='badInfluence'
        label='תופעות לוואי'
        isMultiple={true}
        value={values.badInfluence}
        onChange={handleChangeMultiSelect}
        options={badInfluenceOptions}
        error={errors.badInfluence}
      />
      <Controls.Input
        name='count'
        label='מינון'
        value={values.count}
        onChange={handleInputChange}
        error={errors.count}
      />
      <Controls.Select
        name='days'
        label='ימי נטילת תרופה'
        value={values.days}
        isMultiple={true}
        onChange={handleChangeMultiSelect}
        options={dayOptions}
        error={errors.days}
      />
      <Controls.RadioGroup
        name='foodOrNot'
        value={values.foodOrNot}
        onChange={handleInputChange}
        items={genderItems}
        isRow={isRow}
      />

      <div className='flex justify-center'>
        <Controls.Button
          type='submit'
          text={!recordForEdit ? 'הכנס תרופה' : 'עדכן תרופה'}
        />
        {!recordForEdit && (
          <Controls.Button
            text='אפס שדות'
            color='default'
            onClick={resetForm}
          />
        )}
      </div>
    </form>
  );
}
