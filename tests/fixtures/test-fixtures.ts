import {test as base} from "@playwright/test";
import {TeamsPage} from "../pages/TeamsPage";
import {TeamPage} from "../pages/TeamPage";
import {GamePage} from "../pages/GamePage";
import {HomePage} from "../pages/HomePage";
import {PlayerPage} from "../pages/PlayerPage";


type Fixtures = {
    teamsPage: TeamsPage;
    teamPage: TeamPage;
    gamePage: GamePage;
    homePage: HomePage;
    playerPage: PlayerPage;
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

    gamePage: async ({page}, use) => {
        const gamePage = new GamePage(page);
        await use(gamePage);
    },

    playerPage: async ({page}, use) => {
        const playerPage = new PlayerPage(page);
        await use(playerPage);
    },

});

test.beforeEach(async ({page}) => {

    page.on("response", async res => {

        const url = res.url();

        if (!url.includes("football.api-sports.io")) {
            return;
        }

        console.log("API CALL:", res.status(), url);

        if (res.status() === 429) {
            console.log(
                "RATE LIMIT:",
                await res.text()
            );
            return;
        }

        try {
            const body = await res.json();

            if (body.errors && Object.keys(body.errors).length > 0) {
                console.log(
                    "API ERRORS:",
                    body.errors
                );
            }

        } catch {
            console.log("Could not parse:", url);
        }
    });


    page.on("requestfailed", request => {

        if(request.url().includes("football.api-sports.io")) {
            console.log(
                "FAILED REQUEST:",
                request.failure()?.errorText
            );
        }

    });


    page.on("console", msg => {
        if(msg.type() === "error") {
            console.log(
                "BROWSER ERROR:",
                msg.text()
            );
        }
    });


    page.on("pageerror", error => {
        console.log(
            "PAGE ERROR:",
            error.message
        );
    });

});


export {expect} from "@playwright/test";