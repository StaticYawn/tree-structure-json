import './style.css'
import { ticketsJson } from './fetchRequests';
import { BookingData, DateData, TicketData } from './types';
import { h, listChildren } from './structureBuilder';
import { ICONS, SYS, ticketContainer } from './constantGlobals';

function returnDateElement(dateData: DateData) {
    const booking = dateData.bookings.map(renderBookingData);
    return renderDateData(dateData, booking);
}

function returnTicketElement(userData: TicketData) {
    const dateList = userData.dates.map(returnDateElement);
    return renderTicketData(userData, dateList)
}

function renderBookingData(bookingData: BookingData) {
    const row =
        h('div', { className: 'booking flex d-col' },
            h('div', {className: 'utility flex d-row'},
                h('input', { className: 'time-input', type: 'time', value: bookingData.time }),
                h('div', { className: 'icon-button-group flex' },
                    h('div', { className: 'info-icons flex' },
                        ...renderInfoIconsFromKey(bookingData)),
                    h('div', { className: 'util-buttons ' },
                        h('button', { className: 'edit-button' },
                            h('i', { className: ICONS.edit })),
                        h('button', { className: 'delete-button' },
                            h('i', { className: ICONS.delete }))
                    )
                )
            ),
            h('select', { className: 'project-select', onchange: event => updateActivitySelect(event), name: bookingData.projectId.toString() },
                ...listChildren(bookingData.projectId)),
            bookingData.activityId ?
                h('select', { className: 'activity-select', name: bookingData.activityId.toString() },
                    ...listChildren(bookingData.activityId, bookingData.projectId)) :
                spanFromActivityType(bookingData.activityType),
        );
    return row;
}

function renderDateData(dateData: DateData, bookingList: Element[]) {
    const row =
        h('div', { className: 'date-row row flex d-col' },
            h('div', { className: 'date flex d-row' },
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event) },
                    h('i', { className: ICONS.plus })),
                h('input', { className: 'date-input', type: 'date', value: dateData.date })),
            h('div', { className: 'booking-list list flex d-col ' },
                ...bookingList)
        );
    return row;
}

function renderTicketData(userData: TicketData, dateList: Element[]) {
    const row =
        h('div', { className: 'employee-row row flex d-col' },
            h('div', { className: 'employee flex d-row' },
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event) },
                    h('i', { className: ICONS.plus })),
                h('p', { className: 'username', textContent: userData.name })),
            h('div', { className: 'date-list list flex d-col ' },
                ...dateList)
        );
    return row;
}

function spanFromActivityType(type: number) {
    const icons = SYS[type as keyof typeof SYS]
    return h('span',
        { className: `${icons.color} span-activity` }, icons.text);
}

function renderInfoIconsFromKey(bookingData: BookingData) {
    const filterByBool = Object.keys(bookingData).filter(key => {
        return !bookingData[key as keyof BookingData] && ICONS[key as keyof typeof ICONS]
    });
    if (!filterByBool.length) return [h('i', { className: ICONS.minus })];

    return filterByBool.map(key => h('i', { className: ICONS[key as keyof typeof ICONS] }))
}

ticketsJson.forEach(user => {
    ticketContainer.append(returnTicketElement(user))
});


function updateActivitySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const elemToUpdate = target.parentElement?.children[2];

    if (!elemToUpdate) return;
    if (!elemToUpdate.classList.contains('activity-select')) return;

    elemToUpdate.textContent = '';
    elemToUpdate.append(...listChildren(1, parseInt(target.value)));
}

function toggleSect(event: Event) {
    const target = event.target as HTMLButtonElement;
    const icon = target.firstElementChild;
    if (!icon) return;
    updateButtonIcon(icon);

    const parent = target.closest('.row');
    if (!parent) return;
    if (parent.classList.contains('employee-row')) {
        parent.querySelectorAll('.booking-list:not(.hide)')
            .forEach(elem => elem.classList.toggle('hide'));
        parent.querySelectorAll('.date-list .toggle-button .fa-minus')
            .forEach(icon => updateButtonIcon(icon));
    }
    parent.querySelector('.list')!.classList.toggle('hide');
}

function updateButtonIcon(icon: Element) {
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
}