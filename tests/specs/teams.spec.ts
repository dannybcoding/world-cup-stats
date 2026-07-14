import {test, expect} from "@playwright/test";
import {TeamsPage} from "../pages/TeamsPage";


test("Teams page loads", async ({page}) => {

    const teamsPage = new TeamsPage(page);

    await teamsPage.goto();

    await expect(page).toHaveURL(/teams/);

});


test("User can search for Brazil", async ({page}) => {

    const teamsPage = new TeamsPage(page);

    await teamsPage.goto();

    await teamsPage.search("Brazil");

    await expect(
        page.locator(".search-result")
            .filter({hasText: "Brazil"})
    ).toBeVisible();

});


test("User can open Brazil team page", async ({page}) => {

    const teamsPage = new TeamsPage(page);

    await teamsPage.goto();

    await teamsPage.openTeam("Brazil");

    await expect(page).toHaveURL(/brazil/);

});