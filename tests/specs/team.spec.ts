import {test, expect} from "../fixtures/test-fixtures";
import {PlaywrightTestArgs, PlaywrightWorkerOptions} from "@playwright/test";
import {mockFootballApi} from "../helpers/mockFootballApi";

test("Stats load for 1 random team", async ({teamsPage, teamPage, page}) => {
    // Mock the Football API before navigating
    await mockFootballApi(page);

    await teamsPage.goto();

    const teams = await teamsPage.getTeamLinks();
    
    // Filter to only test teams we have mock data for (Brazil)
    const teamsWithMockData = teams.filter(t => t.name === "Brazil");
    const randomTeam = teamsWithMockData.length > 0 
        ? teamsWithMockData[0]
        : teams.slice(0, 1)[0];

    //console.log("Random teams selected:", randomTeams);


        await teamsPage.goto();

        await teamsPage.openTeam(randomTeam.name);
        await expect(teamsPage.page).toHaveURL(randomTeam.href);
        await teamPage.waitForTeamLoaded(randomTeam.name);

        // Verify actual page content
        await expect(teamPage.teamStats).toBeVisible()

});