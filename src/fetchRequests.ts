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


export const [ticketsJson, projectsJson, activitiesJson] = await Promise.all(
        ['tickets', 'projects', 'activities'].map(f => getJson(`/${f}.json`))
    )  as [TicketData[], ProjectData[], ActivityData[]];