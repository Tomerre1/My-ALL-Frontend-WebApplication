import React, { useState } from 'react';
import Controls from '../controls/Controls'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux'
import { cloudinaryService } from '../../services/cloudinary-service'
import { utilService } from '../../services/util.service'
import { RotatingLines } from 'react-loader-spinner';
import { setLoadingOn, setLoadingOff } from '../../store/system.actions';
//need to add circle loading for image upload and dont able to handlesubmit until its done upload
export function AddContact({ editContact, onAddContact, saveEditContact }) {
    const [profileImage, setProfileImage] = useState(editContact && editContact.img ? editContact.img : null);
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.systemReducer.isLoading)
    const validationSchemaAddContact = Yup.object().shape({
        name: Yup.string()
            .required('נדרש למלא שם איש קשר'),
        job: Yup.string()
            .required('נדרש למלא תפקיד איש קשר'),
        mail: Yup.string()
            .email('נדרש להזין אימייל תקין')
            .required('נדרש למלא אימייל איש קשר'),
        phone: Yup.string().required(' נדרש להזין את פלאפון איש קשר ')
            .matches(
                /^\d{9,10}$/,
                "נדרש למלא מספר פלאפון תקין"
            ),
    });

    const handleSubmit = (values) => {
        if (isLoading) return
        if (editContact) {
            saveEditContact({ ...editContact, ...values, img: profileImage })
        } else {
            onAddContact({
                ...values,
                img: profileImage ? profileImage : 'https://www.pngitem.com/pimgs/m/11-113101_people-clipart-svg-person-image-for-powerpoint-hd.png',
                id: utilService.makeId()
            })
        }
    };

    const uploadFile = async (ev) => {
        ev.preventDefault()
        const res = await cloudinaryService.uploadFile(ev)
        setProfileImage(res.secure_url)
    }

    return <Formik
        onSubmit={handleSubmit}
        initialValues={{
            name: editContact?.name || '',
            mail: editContact?.mail || '',
            phone: editContact?.phone || '',
            job: editContact?.job || ''
        }}
        validationSchema={validationSchemaAddContact}
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
    >
        {props => {
            return (
                <form className="flex column add-contact" onSubmit={props.handleSubmit}>
                    <Controls.Input
                        name='name'
                        label='שם איש קשר'
                        value={props.values.name}
                        onChange={props.handleChange}
                        error={props.touched.name && props.errors.name ? props.errors.name : ''}
                    />

                    <Controls.Input
                        name='phone'
                        label='פלאפון איש קשר'
                        value={props.values.phone}
                        onChange={props.handleChange}
                        error={props.touched.phone && props.errors.phone ? props.errors.phone : ''}
                    />

                    <Controls.Input
                        name='mail'
                        label='אימייל איש קשר'
                        value={props.values.mail}
                        onChange={props.handleChange}
                        error={props.touched.mail && props.errors.mail ? props.errors.mail : ''}
                    />

                    <Controls.Input
                        name='job'
                        label='תפקיד איש קשר'
                        value={props.values.job}
                        onChange={props.handleChange}
                        error={props.touched.job && props.errors.job ? props.errors.job : ''}
                    />

                    {isLoading ? <div className="flex justify-center"><RotatingLines width="100" strokeColor="#FF5733" /></div> :
                        !profileImage ?
                            <div class="fileUpload blue-btn btn width100">
                                <span> העלאת תמונת איש קשר</span>
                                <input type="file" class="uploadlogo" onChange={uploadFile} />
                            </div>
                            :
                            <div className='flex justify-center'>
                                <div className='profile-picture-container flex justify-center'>
                                    <img src={profileImage} alt="profile" className="profile-image" />
                                    <input type="file" class="uploadlogo" onChange={uploadFile} />
                                </div>
                            </div>

                    }

                    <div className='flex justify-center'>
                        <Controls.Button
                            type='submit'
                            text={'הכנס איש קשר'}
                        />
                        <Controls.Button
                            text='אפס שדות'
                            color='default'
                            onClick={props.resetForm}
                        />
                    </div>
                </form>
            )
        }}
    </Formik >
}

export default AddContact;
