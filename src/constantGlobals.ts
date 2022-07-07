export const SYS = {
    1: { text: 'Arbeitsbeginn', color: 'has-text-success' },

    2: { text: 'Projektwechsel', color: 'has-text-gray' },

    3: { text: 'Pausenende', color: 'has-text-gray' },

    4: { text: 'Pausenbeginn', color: 'has-text-gray' },

    5: { text: 'Activity', color: '', },

    6: { text: 'Arbeitsende', color: 'has-text-danger' }
}
export const ICONS = {
    note: 'fas fa-message has-text-success',
    image: 'fas fa-image has-text-info',
    plus: 'fas fa-plus',
    minus: 'fas fa-minus',
    edit: 'fas fa-pencil-alt',
    delete: 'fas fa-trash'
}

export const ticketContainer = document.querySelector('.ticket-container') as Element;