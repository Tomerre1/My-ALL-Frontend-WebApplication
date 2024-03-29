import React from 'react'
import { utilService } from '../../services/util.service'
import { Avatar } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function SuccessStoryPreview({ story, onRemove, onEdit, user }) {
    const isAdminOrUserWrote = (user && ((user.mail === story.user.mail) || user.userType === 'אדמין'))
    return (
        <section className="success-story">
            <div className="success-story-header" style={{ justifyContent: (isAdminOrUserWrote) ? 'space-between' : 'flex-end' }}>
                {isAdminOrUserWrote &&
                    <div className="actions">
                        <button onClick={() => { onEdit(story) }} ><EditIcon /></button>
                        <button onClick={() => { onRemove(story.id) }} ><DeleteIcon /></button>
                    </div>
                }
                <Avatar style={{ backgroundColor: '#ff7518' }}>{story.user.fullname[0]}</Avatar>
            </div >

            <div className="success-story-comment">
                <p className="title">{story.title}</p>
                <p className="content"> {story.content}</p>
            </div>

            {story?.label && <span className="date">{` מספרי התחנות אשר מקושרים לטיפ: ${story?.label}`}</span>}
            <span className="date">{utilService.makeDateWithHour(story.date)}</span>
        </section >
    )
}
