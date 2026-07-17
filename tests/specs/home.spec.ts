import {expect, test} from "../fixtures/test-fixtures";

test("Home page displays navbar links", async ({homePage}) => {
    await homePage.goto();

    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.teamsLink).toBeVisible();
    await expect(homePage.playersLink).toBeVisible();
    await expect(homePage.statsLink).toBeVisible();
});

test("Home page displays hero and featured teams", async ({homePage}) => {
    await homePage.goto();

    await expect(homePage.exploreTeamsButton).toBeVisible();
    await expect(homePage.featuredTeamsHeading).toBeVisible();
    await expect(homePage.teamGrid).toBeVisible();
});

test("Teams link navigates to Teams page", async ({homePage, teamsPage, page, teamPage}) => {
    await homePage.goto();

    await homePage.teamsLink.click();

    await expect(page).toHaveURL("/teams");
    await  teamsPage.getTeamLinks();
    await expect.poll(async () => {
        return await teamsPage.teamCount();
    }).toBeGreaterThan(16);



});

