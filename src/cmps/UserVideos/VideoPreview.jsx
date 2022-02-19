import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function VideoPreview({ user, video, onVideoClick }) {
    console.log('%c  video:', 'color: white;background: red;', video);
    return (
        <div class="video-preview"
            style={{ backgroundImage: `url(${video.img})`, }}
            onClick={() => onVideoClick(video)}
        >
            {user && user.userType === 'אדמין' &&
                <div className="actions">
                    <button className="clean-btn"><EditIcon /></button>
                    <button className="clean-btn"><DeleteIcon /></button>
                </div>
            }
            <p className="video-title">{video.videoName}</p>
            <p className="video-description">{video.videoDescription}</p>
            <div className="video-time">{video.duration} דקות</div>
        </div >
    )
}

