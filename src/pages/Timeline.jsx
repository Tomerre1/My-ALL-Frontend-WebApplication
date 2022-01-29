
import React, { useEffect, useState } from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import StarIcon from "@material-ui/icons/Star";
import MedicationIcon from '@mui/icons-material/Medication';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { timelineService } from '../services/timeline.service';
import Swal from 'sweetalert2'
import { TimelineFooter } from '../cmps/Footer/TimelineFooter'
import "react-vertical-timeline-component/style.min.css";
import { useSelector } from "react-redux";

export function Timeline(props) {
    const [path, setPath] = useState([])
    const [levelsOnlyPath, setLevelsOnlyPath] = useState([])
    const currUser = useSelector(state => state.userReducer.user)
    const [isLastStep, setIsLastStep] = useState(false)

    useEffect(() => {
        if (!currUser) { props.history.push('/auth'); return; } // not working yet - fix later

        async function queryUserTimeline() {
            const timeline = await timelineService.query(currUser);
            const currLevel = timeline.find(steps => steps.find(step => step.isCurrStep))
            const currLevelIndex = timeline.findIndex(level => level === currLevel)
            const userCurrStepIndex = currLevel.findIndex(step => step.isCurrStep)
            if (currLevelIndex >= path.length - 1 && userCurrStepIndex === currLevel.length - 1) {
                setIsLastStep(true)
            }
            setPath(timeline);
            if (userCurrStepIndex === 1 && currLevelIndex === 0) {
                await Swal.fire({
                    title: `ברוך הבא למסלול של  

                    ${currUser.fullname}`,
                    text: 'בהצלחה!',
                    icon: 'info',
                    timer: 2500
                })
            }
        }
        queryUserTimeline();
        return () => { }
    }, [])

    const onNextStep = async () => {
        const result = await Swal.fire({
            title: 'מעבר תחנה',
            text: 'האם תרצה לעבור לתחנה הבא?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'כן',
            cancelButtonText: 'לא'
        })

        if (result.value) {
            const currLevel = path.find(steps => steps.find(step => step.isCurrStep))
            const currLevelIndex = path.findIndex(level => level === currLevel)
            const userCurrStepIndex = currLevel.findIndex(step => step.isCurrStep)
            let userNextStep, isNextLevel = false, nextLevel = false;
            //same level diffrent step
            if (userCurrStepIndex + 1 <= currLevel.length - 1) {
                userNextStep = currLevel[userCurrStepIndex + 1]
            }
            // need to move next level and next step
            else {
                if (path.length - 1 >= currLevelIndex + 1) {
                    const nextLevelNumber = path[currLevelIndex + 1]
                    isNextLevel = true
                    nextLevel = nextLevelNumber[0].levelNumber
                    userNextStep = nextLevelNumber[1]
                }
                else {
                    userNextStep = currLevel[userCurrStepIndex + 1]
                    if (currLevelIndex >= path.length - 1 && userCurrStepIndex === currLevel.length - 1) {
                        setIsLastStep(true)
                        await Swal.fire({
                            title: `מזל טוב 
                            
                            ${currUser.fullname}`,
                            text: 'ברכותיי הגעת לסוף המסלול!',
                            icon: 'success',
                            timer: 2500
                        })

                    }
                    return
                }
            }
            const timeline = await timelineService.moveNext(currUser, userNextStep, isNextLevel, nextLevel);
            setPath(timeline)
        }
    }

    const onPrevStep = () => {
        Swal.fire({
            title: 'מעבר תחנה',
            text: 'האם תרצה לעבור לתחנה הקודמת?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'כן',
            cancelButtonText: 'לא'
        }).then(async (result) => {
            if (result.value) {
                const currLevel = path.find(steps => steps.find(step => step.isCurrStep))
                const currLevelIndex = path.findIndex(level => level === currLevel)
                const userCurrStepIndex = currLevel.findIndex(step => step.isCurrStep)
                let userBackStep, isBackLevel = false, backLevel = false;
                setIsLastStep(false)
                //same level diffrent step
                if (userCurrStepIndex - 1 >= 1) {
                    userBackStep = currLevel[userCurrStepIndex - 1]
                }
                // need to move back level and back step
                else {
                    if (0 <= currLevelIndex - 1) {
                        const backLevelNumber = path[currLevelIndex - 1]
                        isBackLevel = true
                        backLevel = backLevelNumber[0].levelNumber
                        userBackStep = backLevelNumber[backLevelNumber.length - 1]
                    }
                    // its first level
                    else {
                        return
                    }
                }
                const timeline = await timelineService.moveBack(currUser, userBackStep, isBackLevel, backLevel);
                setPath(timeline)
            }
        })
    }

    const onZoomOut = () => {
        const pathLevelsOnly = path.map(arr => arr.filter(level => !level.stepNumber))
        setLevelsOnlyPath(pathLevelsOnly)
    }

    const onZoomIn = () => {
        setLevelsOnlyPath([])
    }


    const userPath = !levelsOnlyPath.length ? path : levelsOnlyPath

    return (
        <>
            <div className="time-line-container">
                <h1>מסלול ההתקדמות </h1>
                <h1>{currUser.fullname}</h1>
                <VerticalTimeline>
                    {userPath.map((steps, stepIdx) => (
                        steps.map((step, idx) => {
                            if (idx === 0) {
                                //show level
                                return <VerticalTimelineElement
                                    key={step.description + idx}
                                    className={`${(step.isDone) ? 'done' : 'undone'} vertical-timeline ${stepIdx === userPath.length - 1 && idx === 0 && levelsOnlyPath.length > 0 ? '' : 'vertical-timeline-custom-line '}`
                                    }
                                    iconStyle={{ background: "rgb(114, 121, 137)", color: "#fff" }}
                                    contentStyle={{ background: "rgb(114, 121, 137)", color: "#fff" }}
                                    contentArrowStyle={{ borderRight: "7px solid  rgb(114, 121, 137)" }}
                                    icon={<LocalHospitalIcon />}
                                >
                                    <h3 className="vertical-timeline-element-title">שלב {step.levelNumber}</h3>
                                    <p style={{ color: 'white' }}>{step.description}</p>
                                </VerticalTimelineElement>
                            }
                            //show step iscurrentstep
                            return <VerticalTimelineElement
                                key={step.description + idx}
                                className={`
                                ${step.isDone || isLastStep ? 'done' : 'undone'} 
                                ${((stepIdx === path.length - 1) && (steps.length - 1 === idx)) ? '' : `vertical-timeline vertical-timeline-custom-line  `} 
                                ${isLastStep && ((stepIdx === path.length - 1) && (steps.length - 1 === idx)) ? 'laststep' : ''}`
                                }
                                date={new Date(step.date).toLocaleDateString('he-IL')}
                                contentStyle={{ background: "rgb(255, 117, 24)", color: "#fff" }}
                                iconStyle={{ background: "rgb(255, 117, 24)", color: "#fff" }}
                                contentArrowStyle={{ borderRight: "7px solid  rgb(255, 117, 24)" }}


                                icon={step.isCurrStep ? <InsertEmoticonIcon /> : (stepIdx === path.length - 1) && (steps.length - 1 === idx) ? <StarIcon /> : <MedicationIcon />}
                            >
                                <h4 className="vertical-timeline-element-subtitle">מספר תחנה {step.stepNumber}</h4>
                                <p>{step.description}</p>
                            </VerticalTimelineElement>
                        }
                        )
                    ))}
                </VerticalTimeline>
            </div >
            <TimelineFooter
                onNextStep={onNextStep}
                onPrevStep={onPrevStep}
                isZoomIn={levelsOnlyPath.length === 0}
                onZoomOut={onZoomOut}
                onZoomIn={onZoomIn}
            />
        </>
    );
}
