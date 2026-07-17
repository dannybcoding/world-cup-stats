import {Page, Locator} from "@playwright/test";

export class TeamPage {
    readonly page: Page;

    readonly teamName: Locator;
    readonly teamLogo: Locator;
    readonly teamStats: Locator;
    readonly playerCards: Locator;

    constructor(page: Page) {
        this.page = page;

        this.teamName = page.locator(".team-page h1");
        //WRONG IDENTIFIER
        this.teamLogo = page.locator(".team-logo");
        //WRONG IDENTFIER
        this.teamStats = page.locator(".team-stats");
        this.playerCards = this.page.locator(".player-card");
    }
}