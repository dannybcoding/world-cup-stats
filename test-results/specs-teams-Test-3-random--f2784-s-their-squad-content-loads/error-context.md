# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs\teams.spec.ts >> Test 3 random team pages ensures their squad content loads
- Location: tests\specs\teams.spec.ts:44:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.team-page h1')
Expected: "Argentina"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for locator('.team-page h1')

```

```yaml
- navigation:
  - heading "World Cup Stats" [level=2]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Teams":
        - /url: /teams
    - listitem:
      - link "Players":
        - /url: /players
    - listitem:
      - link "Stats":
        - /url: /stats
- alert:
  - paragraph: Unable to load team data.
  - text: Failed to fetch
- contentinfo:
  - paragraph: Built by Daniel Anderson
```

# Test source

```ts
  1  | import {Page, Locator, expect} from "@playwright/test";
  2  | 
  3  | export class TeamPage {
  4  |     readonly page: Page;
  5  | 
  6  |     readonly teamName: Locator;
  7  |     readonly teamLogo: Locator;
  8  |     readonly teamStats: Locator;
  9  |     readonly playerCards: Locator;
  10 | 
  11 |     constructor(page: Page) {
  12 |         this.page = page;
  13 | 
  14 |         this.teamName = page.locator(".team-page h1");
  15 | 
  16 |         //WRONG IDENTIFIER
  17 |         this.teamLogo = page.locator(".team-logo");
  18 |         //WRONG IDENTFIER
  19 | 
  20 |         this.teamStats = page.locator(".stats-grid");
  21 |         this.playerCards = this.page.locator(".player-card");
  22 |     }
  23 | 
  24 |     async waitForTeamLoaded(teamName: string) {
> 25 |         await expect(this.teamName).toHaveText(teamName, {
     |                                     ^ Error: expect(locator).toHaveText(expected) failed
  26 |             timeout: 10000
  27 |         });
  28 |     }
  29 | 
  30 |     async waitForRosterLoaded() {
  31 |         await expect(this.playerCards.first()).toBeVisible({
  32 |             timeout: 10000
  33 |         });
  34 |     }
  35 | }
```