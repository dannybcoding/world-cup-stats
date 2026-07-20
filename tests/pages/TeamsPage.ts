import {Page, Locator} from "@playwright/test";

export class TeamsPage {
    readonly page: Page;

    readonly searchInput: Locator;
    readonly countryLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        this.searchInput = page.getByPlaceholder("Search countries...");
        this.countryLinks = page.locator("a[href*='/teams/']");
    }

    async goto() {
        await this.page.goto("/teams");

        await this.countryLinks.first().waitFor({
            state: "visible",
            timeout: 10000,
        });
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


    searchResult(teamName: string) {

        return this.page
            .locator(".search-result")
            .filter({
                hasText: teamName
            });

    }

    async getTeamLinks() {
        return await this.countryLinks.evaluateAll(links =>
            links.map(link => ({
                name: link.textContent?.trim() || "",
                href: link.getAttribute("href") || ""
            }))
        );
    }
}

