import { ActivityData, ProjectData, TicketData } from "./types";

async function getJson(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw 'shit is indeed fucked'
        return response.json();

    } catch (e) {
        console.error(e)
    }
}
export const [ticketsJson, projectsJson, activitiesJson]:
    [TicketData[], ProjectData[], ActivityData[]] = await Promise.all([
        getJson('http://127.0.0.1:3000/tickets.json'),
        getJson('http://127.0.0.1:3000/projects.json'),
        getJson('http://127.0.0.1:3000/activities.json')
    ]);
