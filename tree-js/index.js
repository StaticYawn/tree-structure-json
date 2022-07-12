const SYS = {
    1: { text: 'Arbeitsbeginn', color: 'has-text-success' },

    2: { text: 'Projektwechsel', color: 'has-text-gray' },

    3: { text: 'Pausenende', color: 'has-text-gray' },

    4: { text: 'Pausenbeginn', color: 'has-text-gray' },

    5: { text: 'Activity', color: '', },

    6: { text: 'Arbeitsende', color: 'has-text-danger' }
}
const ICONS = {
    note: 'fas fa-message has-text-success',
    image: 'fas fa-image has-text-info',
    plus: 'fas fa-plus',
    minus: 'fas fa-minus',
    edit: 'fas fa-pencil-alt',
    delete: 'fas fa-trash'
}

async function getJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw 'shit is indeed fucked'
        return response.json();
    } catch (e) {
        console.error(e)
    }
}

// const ticketsJson = await getJson('https://test.bizztime.eu/Node.php?n=ticket-list&from=2022-07-05&to=2022-07-11&worker=4');
const [ticketsJson, projectsJson, activitiesJson] = await Promise.all(
    ['tickets', 'projects', 'activities'].map(f => getJson(`/${f}.json`))
);


const findAll = (obj, value)=> {
    return obj.filter(e => e.projectId === value)
}

export function h(tagName, attrsAndEvents, ...children){
    const element = document.createElement(tagName);

    const [attributes, events] = partition(
        Object.entries(attrsAndEvents), ([key]) => !key.startsWith('on')
    );

    for (const [eventRaw, handlers] of events) {
        const event = eventRaw.slice(2)

        castArray(handlers)
            .forEach(handler => element.addEventListener(event, handler))
    }
    Object.assign(element, Object.fromEntries(attributes));
    element.append(...children);
    return element;
}

function castArray(item) {
    return Array.isArray(item) ? item : [item]
}

function partition(iter, fn){
    const passed = []
    const failed = []
    let i = 0
    for (const item of iter) {
        if (fn(item, i++, iter)) {
            passed.push(item)
        } else {
            failed.push(item)
        }
    }
    return [passed, failed]
}

export function listChildren(selected, projId) {
    const children1 = projId ? findAll(activitiesJson, projId) : projectsJson;
    return children1.map(({ id, name, ...rest }) => {
        const element = document.createElement('option');
        element.value = id.toString();
        if('customerId' in rest) element.textContent = `(${rest.customerId}) ${name}`
        else element.textContent = `${name}`;
        if (id === selected) element.selected = true;
        return element;
    });
}

function returnDateElement(dateData) {
    const booking = dateData.bookings.map(renderBookingData);
    return renderDateData(dateData, booking);
}

function returnTicketElement(userData) {
    const dateList = userData.dates.map(returnDateElement);
    return renderTicketData(userData, dateList)
}

function renderBookingData(bookingData) {
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

function renderDateData(dateData, bookingList) {
    const row =
        h('div', { className: 'date-row row flex d-col' },
            h('div', { className: 'date flex d-row' },
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event) },
                    h('i', { className: ICONS.plus })),
                h('input', { className: 'date-input input is-small', type: 'date', value: dateData.date })),
            h('div', { className: 'booking-list list flex d-col is-hidden' },
                ...bookingList)
        );
    return row;
}

function renderTicketData(userData, dateList) {
    const row =
        h('div', { className: 'employee-row row flex d-col' },
            h('div', { className: 'employee flex d-row' },
                h('button', { className: 'toggle-button', onclick: event => toggleSect(event) },
                    h('i', { className: ICONS.plus })),
                h('p', { className: 'username', textContent: userData.name })),
            h('div', { className: 'date-list list flex d-col is-hidden' },
                ...dateList)
        );
    return row;
}

function spanFromActivityType(type) {
    const icons = SYS[type]
    return h('span',
        { className: `${icons.color} flex span-activity is-small` }, icons.text);
}

function renderInfoIconsFromKey(bookingData) {
    const filterByBool = Object.keys(bookingData).filter(key => {
        return !bookingData[key] && ICONS[key]
    });
    if (!filterByBool.length) return [h('i', { className: ICONS.minus })];

    return filterByBool.map(key => h('i', { className: ICONS[key] }))
}


const ticketContainer = document.querySelector('.ticket-container');
ticketsJson.forEach(user => {
    ticketContainer.append(returnTicketElement(user))
});


function updateActivitySelect(event) {
    const target = event.target;
    const elemToUpdate = target.parentElement?.children[2];
    
    if (!elemToUpdate) return;
    if (!elemToUpdate.classList.contains('activ-sel')) return;

    elemToUpdate.textContent = '';
    elemToUpdate.append(...listChildren(1, parseInt(target.value)));
}

function toggleSect(event) {
    const target = event.target;
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
    parent.querySelector('.list').classList.toggle('is-hidden');
}

function updateButtonIcon(icon) {
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
}