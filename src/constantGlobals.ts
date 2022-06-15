export const SYS = {
    1: { text: 'Arbeitsbeginn', color: 'green' },

    2: { text: 'Projektwechsel', color: 'gray' },

    3: { text: 'Pausenende', color: 'gray' },

    4: { text: 'Pausenbeginn', color: 'gray' },

    5: { text: 'Activity', color: '', },

    6: { text: 'Arbeitsende', color: 'red' }
}
export const ICONS = {
    note: 'fas fa-message',
    image: 'fas fa-image',
    plus: 'fas fa-plus',
    minus: 'fas fa-minus',
    edit: 'fas fa-edit',
    delete: 'fas fa-trash'
}

export const ticketList = document.querySelector('.ticket-list') as Element;