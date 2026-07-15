import {test as base} from "@playwright/test";
import {TeamsPage} from "../pages/TeamsPage";
import {TeamPage} from "../pages/TeamPage";


type Fixtures = {
    teamsPage: TeamsPage;
    teamPage: TeamPage;
};




export const test = base.extend<Fixtures>({

    teamsPage: async ({page}, use) => {

        const teamsPage = new TeamsPage(page);

        await use(teamsPage);

    },

    teamPage: async ({page}, use) => {
        const teamPage = new TeamPage(page);
        await use(teamPage);
    },

});


export {expect} from "@playwright/test";