import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editShift } from '../../features/shift/shiftSlice';
import { hours } from '../../constance/localData';
import { CreateShift, Shift } from '../';


const DayShift = ({ dateControl, startDate, employee}) => {
    const [endTimeOnResize, setEndTimeOnResize] = useState({});
    const dispatch = useDispatch();
    const { id } = useParams();
    const { shifts } = useSelector(state => state.shift);
    const todayShifts = shifts.filter(shift => 
        new Date(shift.date).setHours(0, 0, 0, 0) === 
        new Date(startDate).setHours(0, 0, 0, 0) &&
        ((employee && employee._id === shift.employee) || !employee && shift.employee === null)
    );

    const [{ isOver }, drop] = useDrop({
        accept: 'shift',
        drop: (item) => {
            const element = document.getElementsByClassName('day-shift-over')[0];
            console.log(element)
            moveShift(item, element)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const moveShift = (item, element) => {
        const employee = element.id.replace('employee-day-shift-', '');
        const data = {
            id: item.shift._id,
            employee: employee === 'null' ? null : employee,
        }

        if(item.shift.employee !== employee) {
            dispatch(editShift(data));
        }
    }

    const onMouseDownResize = (e, index, startTime, shiftId) => {
        e.preventDefault();
        const minStep = 70; // min box width

        const onMouseMove = (e) => {
            const shiftParent = document.getElementById(shiftId);
            let newWidth = e.pageX - 15 - shiftParent.getBoundingClientRect().left; // 25 is an offset to make the width of the div to be the same as the width of the mouse pointer
            let withPercent = +(Math.round(1000*(newWidth / minStep)) / 100).toFixed(0)

            if ( newWidth >= minStep && newWidth <= (24-index)*70 ) { // 25 is the number of boxes in a row, 70 is the width of a box, index is box index
                if (shiftParent.style.width !== ((withPercent * 10 -((+startTime.slice(3, 5) / 60) * 100) ) +"%")) {
                    let minutes = ((withPercent/10 % 1).toFixed(1) * 60);
                    let hour = hours[index+Math.trunc(withPercent/10)] ? hours[index+Math.trunc(withPercent/10)].slice(0, 2) : '24';
                    let newEndTime =  hour + ":" + (minutes < 10 ? "0"+minutes : minutes);

                    setEndTimeOnResize({...endTimeOnResize, [index]: newEndTime});
                    shiftParent.style.width = (withPercent * 10 -((+startTime.slice(3, 5) / 60) * 100) ) +"%";
                }
            }
        };

        const onMouseUp = () => {
            const endTime = document.getElementById(shiftId).getElementsByClassName('clock-time')[0].innerHTML.split('<hr>')[1];

            dispatch(editShift({id: shiftId, endTime: endTime}))
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        if (document.getElementById(shiftId)) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }
    };

    return (
        <div
            ref={drop}
            className="pos-relative"
            style={{
                opacity: isOver ? 0.5 : 1,
            }}
        >
        { todayShifts && todayShifts.map((shift, e) => {
            return (
                <div 
                    key={`shift-row-${e}`} 
                    id={`employee-day-shift-${employee ? employee._id : null}`}
                    className={`flex ${isOver ? 'day-shift-over' : ''}`}
                >
                    { hours.map((time, index) => { // loop for each hour
                        return (
                            <div 
                                key={`shift-day-${time}`}
                                id={ `${time}` }
                                className="col section-holder"
                            >
                                {time === (shift.startTime.slice(0,2) + ":00") ?
                                    <Shift
                                        shift={shift}
                                        employee={employee}
                                        index={index}
                                        onMouseDownResize={onMouseDownResize}
                                        endTimeOnResize={endTimeOnResize}
                                    />
                                    :
                                    <CreateShift 
                                        date={startDate}
                                        startTime={time}
                                        employee={employee}
                                    />
                                }
                            </div>
                        )
                    })}
                </div>
            )
        })}
        {todayShifts.length === 0 &&
            <div
                id={`employee-day-shift-${employee ? employee._id : null}`}
                className={`flex ${isOver ? 'day-shift-over' : ''}`}
            >
                {hours.map((time, index) => { // loop for each hour
                return (
                    <div 
                        key={`openshift-day-${time}`}
                        id={ `${time}` }
                        className="col section-holder"
                    >
                        <div className="flex flex-col">
                            <CreateShift 
                                businessId={id}
                                date={startDate}
                                employee={employee}
                            />
                        </div>
                    </div>
                )})}
            </div>
        }
    </div>
    )
}

export default DayShift