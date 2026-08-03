import {Page, Locator, expect} from "@playwright/test";

export class GamePage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly overviewCard: Locator;
    readonly teamBlocks: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator(".game-page .page-header");
        this.overviewCard = page.locator(".game-overview-card");
        this.teamBlocks = page.locator(".team-game-block");
    }

    async waitForLoaded() {
        await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
        await expect(this.overviewCard).toBeVisible({ timeout: 10000 });
    }
}
