import {Page, Locator} from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {
    }

    heading = this.page.getByRole("heading", {
        name: "FIFA World Cup Stats"
    });

    heroText = this.page.getByText(
        "Explore teams, players, and tournament history"
    );

    exploreTeamsButton = this.page.getByRole("button", {
        name: "Explore Teams"
    });

    featuredTeamsHeading = this.page.getByRole("heading", {
        name: "Featured Teams"
    });


    //NAVBAR LOCATORS
    homeLink = this.page.getByRole("link", {name: "Home"});
    teamsLink = this.page.getByRole("link", {
        name: "Teams",
        exact: true
    });
    playersLink = this.page.getByRole("link", {name: "Players"});
    statsLink = this.page.getByRole("link", {name: "Stats"});


    //FEATURED TEAM LOCATORS
    teamGrid = this.page.locator(".team-grid");
    teamCards = this.teamGrid.locator("> div");
    teamLogos = this.teamGrid.locator("img");
    teamNames = this.teamGrid.locator("p");


    async goto() {
        await this.page.goto("/");
        await this.teamCards.first().waitFor({
            state: "visible",
            timeout: 10000,
        });
    }
}