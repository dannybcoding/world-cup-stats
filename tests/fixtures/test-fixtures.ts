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
    console.log("🔥 BEFORE EACH RUNNING");
    page.on("response", (res) => {
        if (!res.ok()) {
            console.log(`[${res.status()}] ${res.url()}`);
        }
    });

    page.on("requestfailed", (req) => {
        console.log(
            `[FAILED] ${req.url()} — ${req.failure()?.errorText}`
        );
    });
});


export {expect} from "@playwright/test";