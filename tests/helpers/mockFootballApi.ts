import { Page } from "@playwright/test";
import japanTeam from "../fixtures/teams/japan-team.json" assert { type: "json" };
import japanSquad from "../fixtures/teams/japan-squad.json" assert { type: "json" };
import japanStats from "../fixtures/teams/japan-stats.json" assert { type: "json" };
import brazilTeam from "../fixtures/teams/brazil-team.json" assert { type: "json" };
import brazilSquad from "../fixtures/teams/brazil-squad.json" assert { type: "json" };
import brazilStats from "../fixtures/teams/brazil-stats.json" assert { type: "json" };
import teamsList from "../fixtures/teams/teams-list.json" assert { type: "json" };

interface MockData {
  [key: string]: {
    team: any;
    squad: any;
    stats: any;
  };
}

const mockData: MockData = {
  "6": {
    team: japanTeam,
    squad: japanSquad,
    stats: japanStats
  },
  "8": {
    team: brazilTeam,
    squad: brazilSquad,
    stats: brazilStats
  }
};

export async function mockFootballApi(page: Page) {
  await page.route("**/v3.football.api-sports.io/**", async (route) => {
    const url = route.request().url();

    // Route: GET /teams (teams list for league/season)
    if (url.includes("/teams?league=1&season=2022")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(teamsList),
      });
    }

    // Extract team ID from different parameter names
    let teamId = null;
    
    // Try to match team=ID or team&ID
    const teamMatch = url.match(/[?&]team[=&](\d+)/);
    if (teamMatch) teamId = teamMatch[1];
    
    // Try to match id=ID (used in /teams endpoint)
    const idMatch = url.match(/[?&]id[=&](\d+)/);
    if (idMatch) teamId = idMatch[1];

    // Route: GET /teams with id parameter
    if (url.includes("/teams?") && teamId && !url.includes("statistics")) {
      const data = mockData[teamId];
      if (data) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data.team),
        });
      }
    }

    // Route: GET /players/squads
    if (url.includes("/players/squads") && teamId) {
      const data = mockData[teamId];
      if (data) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data.squad),
        });
      }
    }

    // Route: GET /teams/statistics
    if (url.includes("/teams/statistics") && teamId) {
      const data = mockData[teamId];
      if (data) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data.stats),
        });
      }
    }

    // If no mock data found, abort the request
    return route.abort();
  });
}
