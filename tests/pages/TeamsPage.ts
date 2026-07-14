import { Page, Locator } from "@playwright/test";

export class TeamsPage {
    readonly page: Page;

    readonly searchInput: Locator;
    readonly countryLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        this.searchInput = page.getByPlaceholder("Search countries...");
        this.countryLinks = page.locator(".country a");
    }

    async goto() {
        await this.page.goto("/teams");
    }

    async search(teamName: string) {
        await this.searchInput.fill(teamName);
    }

    async openTeam(teamName: string) {
        await this.page.getByRole("link", {
            name: teamName,
            exact: true,
        }).click();
    }

    async teamCount() {
        return this.countryLinks.count();
    }
}