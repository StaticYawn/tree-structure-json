// import './style.css'
import './register.css'
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
        h('div', { className: 'booking flex' },
            h('div', { className: 'time-input-div' },
                h('input', { className: 'time-input input is-small', type: 'time', value: bookingData.time })),
            h('select', { className: 'proj-sel select is-small', onchange: event => updateActivitySelect(event), name: bookingData.projectId.toString() },
                ...listChildren(bookingData.projectId)),
            bookingData.activityId ?
                h('select', { className: 'activ-sel select is-small', name: bookingData.activityId.toString() },
                    ...listChildren(bookingData.activityId, bookingData.projectId)) :
                spanFromActivityType(bookingData.activityType),
            h('div', { className: 'utility flex' },
                h('div', { className: 'info-icons flex' },
                    ...renderInfoIconsFromKey(bookingData)),
                h('div', { className: 'util-buttons flex' },
                    h('a', { className: 'edit-button button is-link is-small', href: '#' },
                        h('i', { className: ICONS.edit })),
                    h('a', { className: 'delete-button button is-danger is-small', href: '#' },
                        h('i', { className: ICONS.delete }))))
        );
    return row;
}

function renderDateData(dateData: DateData, bookingList: Element[]) {
    const row =
        h('div', { className: 'date-row row flex d-col' },
            h('div', { className: 'date flex d-row' },
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event) },
                    h('i', { className: ICONS.plus })),
                h('input', { className: 'date-input input is-small', type: 'date', value: dateData.date })),
            h('div', { className: 'booking-list list flex d-col is-hidde' },
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
            h('div', { className: 'date-list list flex d-col is-hidde' },
                ...dateList)
        );
    return row;
}

function spanFromActivityType(type: number) {
    const icons = SYS[type as keyof typeof SYS]
    return h('span',
        { className: `${icons.color} flex span-activity is-small` }, icons.text);
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
        parent.querySelectorAll('.booking-list:not(.is-hidden)')
            .forEach(elem => elem.classList.toggle('is-hidden'));
        parent.querySelectorAll('.date-list .toggle-button .fa-minus')
            .forEach(icon => updateButtonIcon(icon));
    }
    parent.querySelector('.list')!.classList.toggle('is-hidden');
}

function updateButtonIcon(icon: Element) {
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
}