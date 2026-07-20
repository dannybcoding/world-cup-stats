import {test, expect} from "../fixtures/test-fixtures";
import {PlaywrightTestArgs, PlaywrightWorkerOptions} from "@playwright/test";

test("Stats load for 1 random team", async ({teamsPage, teamPage}) => {
    await teamsPage.goto();

    const teams = await teamsPage.getTeamLinks();
    const randomTeam = teams
        .sort(() => Math.random() - 0.5)
        .slice(0, 1)[0];

    //console.log("Random teams selected:", randomTeams);


        await teamsPage.goto();

        await teamsPage.openTeam(randomTeam.name);
        await expect(teamsPage.page).toHaveURL(randomTeam.href);
        await teamPage.waitForTeamLoaded(randomTeam.name);

        // Verify actual page content
        await expect(teamPage.teamStats).toBeVisible()

});