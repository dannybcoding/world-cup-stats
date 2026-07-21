import {test as base} from "@playwright/test";
import {TeamsPage} from "../pages/TeamsPage";
import {TeamPage} from "../pages/TeamPage";
import {HomePage} from "../pages/HomePage";


type Fixtures = {
    teamsPage: TeamsPage;
    teamPage: TeamPage;
    homePage: HomePage
};


export const test = base.extend<Fixtures>({

    homePage: async ({page}, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    teamsPage: async ({page}, use) => {

        const teamsPage = new TeamsPage(page);

        await use(teamsPage);

    },

    teamPage: async ({page}, use) => {
        const teamPage = new TeamPage(page);
        await use(teamPage);
    },

});

test.beforeEach(async ({page}) => {
    page.on("response", async (res) => {
        if (res.url().includes("football.api-sports.io")) {
            console.log("\n--- FOOTBALL API ---");
            console.log("STATUS:", res.status());
            console.log("URL:", res.url());

            const body = await res.json();
            console.log(JSON.stringify(body, null, 2).slice(0, 1000));
        }
    });
});


export {expect} from "@playwright/test";