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
        const url = res.url();

        // Only inspect API-Football calls
        if (!url.includes("football.api-sports.io")) {
            return;
        }

        // Log HTTP-level errors
        if (!res.ok()) {
            console.log(`[HTTP ERROR ${res.status()}] ${url}`);
            return;
        }

        // Check API-level errors inside a 200 response
        try {
            const body = await res.json();

            if (body.errors && Object.keys(body.errors).length > 0) {
                console.log(`[API ERROR ${res.status()}] ${url}`);
                console.log(body.errors);
            }
        } catch (error) {
            console.log(`Could not parse response from ${url}`);
        }
    });
});


export {expect} from "@playwright/test";