import {Page, Locator, expect} from "@playwright/test";

export class PlayerPage {
    readonly page: Page;
    readonly playerName: Locator;
    readonly playerSummaryCard: Locator;
    readonly playerStatGrid: Locator;
    readonly backLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.playerName = page.locator(".player-page .page-header");
        this.playerSummaryCard = page.locator(".player-summary-card");
        this.playerStatGrid = page.locator(".stat-grid");
        this.backLink = page.getByRole("link", {name: "← Back to players"});
    }

    async goto(playerId: string) {
        await this.page.goto(`/players/${playerId}`);
        await this.playerName.waitFor({state: "visible", timeout: 10000});
    }

    async waitForPlayerLoaded(playerName: string) {
        await expect(this.playerName).toHaveText(playerName, {
            timeout: 10000,
        });
    }
}
