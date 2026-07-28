import {test, expect} from "../fixtures/test-fixtures";
import {mockFootballApi} from "../helpers/mockFootballApi";

const japanPlayer = {
    id: "1004",
    name: "Daizen Maeda",
};

const brazilPlayer = {
    id: "2004",
    name: "Vinícius Júnior",
};

test.describe("Player detail page", () => {
    test("can navigate from players list to a player detail page", async ({page, playerPage}) => {
        await mockFootballApi(page);

        await page.goto("/players");
        await expect(page).toHaveURL("/players");

        await page.getByRole("combobox", {name: /Select a team/i}).selectOption("8");
        await expect(page.getByText(brazilPlayer.name)).toBeVisible();

        await page.getByRole("link", {name: `View details for ${brazilPlayer.name}`}).click();
        await expect(page).toHaveURL(`/players/${brazilPlayer.id}`);

        await playerPage.waitForPlayerLoaded(brazilPlayer.name);
        await expect(playerPage.playerSummaryCard).toBeVisible();
    });

    test("shows player detail links for a selected team", async ({page}) => {
        await mockFootballApi(page);

        await page.goto("/players");
        await expect(page).toHaveURL("/players");

        await page.getByRole("combobox", {name: /Select a team/i}).selectOption("6");
        await expect(page.locator(".player-card").first()).toBeVisible();

        const playerLinks = page.getByRole("link", {name: /View details for/});
        await expect(playerLinks.first()).toBeVisible();
        expect(await playerLinks.count()).toBeGreaterThan(0);
    });

    test("displays player detail and statistics for a player id", async ({page, playerPage}) => {
        await mockFootballApi(page);

        await playerPage.goto(japanPlayer.id);
        await playerPage.waitForPlayerLoaded(japanPlayer.name);
        await expect(playerPage.playerSummaryCard).toBeVisible();
        await expect(playerPage.playerStatGrid.first()).toBeVisible();
        await expect(playerPage.backLink).toBeVisible();
    });
});
