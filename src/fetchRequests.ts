import { ActivityData, ProjectData, TicketData } from "./types";

async function getJson(url: string) {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // throw new Error('blah!')
}

const ticketsJson: Array<TicketData> = await getJson('http://127.0.0.1:3000/tickets.json');
const projectsJson: Array<ProjectData> = await getJson('http://127.0.0.1:3000/projects.json');
const activiesJson: Array<ActivityData> = await getJson('http://127.0.0.1:3000/activities.json');

export { ticketsJson, projectsJson, activiesJson };