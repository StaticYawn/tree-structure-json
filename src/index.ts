import './style.css'
import { ticketsJson } from './fetchRequests';
import { BookingData, DateData, TicketData } from './types';
import { activityList, h, projectList } from './structureBuilder';
import { ICONS, SYS, ticketList } from './constantGlobals';
 
function returnDateElement(dateData: DateData) {
    const booking = dateData.bookings.map(renderBookingData);
    return renderDateData(dateData, booking);
}

function returnTicketElement(userData: TicketData) {
    const dateList = userData.dates.map(returnDateElement);
    return renderTicketData(userData, dateList)
}

// RSA test from cmd

function renderBookingData(bookingData: BookingData) {
    const row =
        h('div', { className: 'booking flex d-row' }, h('select', {
            className: 'projectSelect', onchange: event => updateActivitySelect(event.target as HTMLSelectElement),
            name: bookingData.projectId.toString()
        }, ...projectList(bookingData.projectId)
        ),
            bookingData.activityId ? h('select', {
                className: 'activitySelect', onchange: event => updateActivitySelect(event.target as HTMLSelectElement),
                name: bookingData.activityId.toString()
            }, ...activityList(bookingData.projectId, bookingData.activityId)) : spanFromActivityType(bookingData.activityType),
            h('div', {}, ...getInfoIconsFromKey(bookingData)),
            h('button', { className: 'edit-button' },
                h('i', { className: ICONS.edit })),
            h('button', { className: 'delete-button' },
                h('i', { className: ICONS.delete }))
        );
    return row;
}

function renderDateData(dateData: DateData, bookingList: Element[]) {
    const row =
        h('div', { className: 'date-row flex d-col' },
            h('div', { className: 'date flex d-row' },
                h('input', { type: 'date', value: dateData.date }),
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event.target as HTMLButtonElement) },
                    h('i', { className: ICONS.plus }))),
            h('div', { className: 'booking-list flex d-col hide' }, ...bookingList)
        );

    return row;
}

function renderTicketData(userData: TicketData, dateList: Element[]) {
    const row =
        h('div', { className: 'employee-row flex d-col' },
            h('div', { className: 'employee flex d-row' },
                h('p', { textContent: userData.name }),
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event.target as HTMLButtonElement) },
                    h('i', { className: ICONS.plus }))),
            h('div', { className: 'date-list flex d-col hide' }, ...dateList)
        );

    return row;
}

function spanFromActivityType(type: number) {
    return h('span',
        { className: SYS[type as keyof typeof SYS].color },
        SYS[type as keyof typeof SYS].text);
}

function getInfoIconsFromKey(bookingData: BookingData) {
    const filterByBool = Object.keys(bookingData).filter(key => {
        return !bookingData[key as keyof BookingData] && ICONS[key as keyof typeof ICONS]
    });
    if (!filterByBool.length) return [h('i', { className: ICONS.minus })];

    return filterByBool.map(key => h('i', { className: ICONS[key as keyof typeof ICONS] }))
}

ticketsJson.forEach(user => {
    ticketList.append(returnTicketElement(user))
});


function updateActivitySelect(target: HTMLSelectElement) {
    const elemToUpdate = target.parentElement?.children[1];
    console.log(elemToUpdate)
    if (!elemToUpdate) return;
    if (elemToUpdate.classList.contains('activitySelect')) {
        elemToUpdate.textContent = '';
        elemToUpdate.append(...activityList(parseInt(target.value), 1));
    }
}

function toggleSect(target: HTMLButtonElement) {
    const icon = target.children[0];
    updateButtonIcon(icon);

    const parent = target.parentElement?.parentElement;
    if (!parent) return;
    if (parent.classList.contains('employee-row')) {
        parent.querySelectorAll('.booking-list:not(.hide)')
            .forEach(elem => elem.classList.toggle('hide'));
        parent.querySelectorAll('.date-list .toggle-button .fa-minus')
            .forEach(icon => updateButtonIcon(icon));
    }
    parent.children[1].classList.toggle('hide');
}

function updateButtonIcon(icon: Element) {
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
}