import {test, expect} from "../fixtures/test-fixtures";
import {PlaywrightTestArgs, PlaywrightWorkerOptions} from "@playwright/test";


test.skip("Teams page loads", async ({teamsPage}) => {

    await teamsPage.goto();

    await expect(teamsPage.page)
        .toHaveURL(/teams/);

});


test("Search for Team", async ({teamsPage}) => {

    await teamsPage.goto();

    const teams = await teamsPage.getTeamLinks();
    const randomTeam = teams
        .sort(() => Math.random() - 0.5)
        .slice(0, 1)[0];

    await teamsPage.search(randomTeam.name);

    await expect(
        teamsPage.searchResult(randomTeam.name)
    ).toBeVisible();

});


test.skip("User can open Brazil team page", async ({teamsPage}) => {

    await teamsPage.goto();

    await teamsPage.openTeam("Brazil");

    await expect(teamsPage.page)
        .toHaveURL(/brazil/);

});

test("Test 3 random team pages ensures their squad content loads", async ({teamsPage, teamPage}) => {
    await teamsPage.goto();
    // console.log("Country links found:", await teamsPage.countryLinks.count());
    // console.log(await teamsPage.page.url());
    // console.log(await teamsPage.page.content());


    const teams = await teamsPage.getTeamLinks();
    const randomTeams = teams
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    console.log("Random teams selected:", randomTeams);

    for (const team of randomTeams) {
        await teamsPage.goto();

        await teamsPage.openTeam(team.name);
        await expect(teamsPage.page).toHaveURL(team.href);

        console.log("Current URL:", teamsPage.page.url());

        const html = await teamsPage.page.content();
        console.log(html);

        await teamPage.waitForTeamLoaded(team.name);

        // Verify actual page content
        await expect(teamPage.teamName).toHaveText(team.name);

        console.log(team.name, "✓ Team page loaded");

        await expect(teamPage.playerCards.first()).toBeVisible();

        expect(await teamPage.playerCards.count()).toBeGreaterThan(11);
        //console.log(await teamPage.playerCards.first().innerHTML());

        const text = await teamPage.teamName.textContent();
        expect(text?.trim()).not.toBe("");

        //await expect(teamPage.teamLogo).toBeVisible();
    }
});

