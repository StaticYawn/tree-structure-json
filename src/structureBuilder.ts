import { activitiesJson, projectsJson } from "./fetchRequests";
import { ActivityData } from "./types";

const findAll = (obj: Array<ActivityData>, value: number): Array<ActivityData> => {
    return obj.filter(e => e.projectId === value)
}

export function h(tagName: string, attrsAndEvents: { [key: string]: string | ((event: Event) => void) | void } = {}, ...children: (Element | string)[]): Element {
    const element = document.createElement(tagName);

    const [attributes, events] = partition(
        Object.entries(attrsAndEvents), ([key]) => !key.startsWith('on')
    );

    for (const [eventRaw, handlers] of events) {
        const event = eventRaw.slice(2)

        castArray(handlers as keyof EventListenerOrEventListenerObject)
            .forEach(handler => element.addEventListener(event, handler))
    }
    Object.assign(element, Object.fromEntries(attributes));
    element.append(...children);
    return element;
}

function castArray<T>(item: T | T[]): T[] {
    return Array.isArray(item) ? item : [item]
}

function partition<T>(iter: Iterable<T>, fn: (item: T, index: number, iter: Iterable<T>) => unknown): [T[], T[]] {
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

export function listChildren(selected: number, projId?: number): Element[] {
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