import { Page } from "@playwright/test";
import japanTeam from "../fixtures/teams/japan-team.json" assert { type: "json" };
import japanSquad from "../fixtures/teams/japan-squad.json" assert { type: "json" };
import japanStats from "../fixtures/teams/japan-stats.json" assert { type: "json" };
import japanFixtures from "../fixtures/teams/japan-fixtures.json" assert { type: "json" };
import japanFixturePlayersHome from "../fixtures/teams/japan-fixture-players-855746-team-6.json" assert { type: "json" };
import japanFixturePlayersAway from "../fixtures/teams/japan-fixture-players-855746-team-8.json" assert { type: "json" };
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

const playerDetails: {[key: string]: any} = {};

Object.values(mockData).forEach(({team, squad}) => {
  const squadPlayers = squad.response?.[0]?.players ?? [];
  const leagueInfo = {
    id: 1,
    name: "World Cup",
    country: "World",
    logo: "https://media.api-sports.io/football/leagues/1.png",
    flag: null,
    season: 2022,
  };

  squadPlayers.forEach((player: any) => {
    const [firstname, ...lastnameParts] = player.name.split(" ");
    playerDetails[String(player.id)] = {
      player: {
        ...player,
        firstname: firstname || player.name,
        lastname: lastnameParts.join(" ") || "",
        birth: {
          date: "2000-01-01",
          place: "Unknown",
          country: team.name,
        },
        nationality: team.name,
        height: "180",
        weight: "75",
        injured: false,
      },
      statistics: [
        {
          team: {
            id: team.id,
            name: team.name,
            logo: team.logo,
          },
          league: leagueInfo,
          games: {
            appearences: 4,
            lineups: 4,
            minutes: 302,
            number: player.number || 0,
            position: player.position || "N/A",
            rating: "7",
            captain: false,
          },
          substitutes: {
            in: 0,
            out: 3,
            bench: 1,
          },
          shots: {
            total: 8,
            on: 4,
          },
          goals: {
            total: 1,
            conceded: 0,
            assists: 2,
            saves: null,
          },
          passes: {
            total: 76,
            key: 8,
            accuracy: 86,
          },
          tackles: {
            total: 3,
            blocks: 1,
            interceptions: null,
          },
          duels: {
            total: 36,
            won: 15,
          },
          dribbles: {
            attempts: 13,
            success: 5,
            past: null,
          },
          fouls: {
            drawn: 7,
            committed: null,
          },
          cards: {
            yellow: 0,
            yellowred: 0,
            red: 0,
          },
          penalty: {
            won: null,
            commited: null,
            scored: 0,
            missed: 0,
            saved: null,
          },
        },
      ],
    };
  });
});

interface MockFootballApiOptions {
  flakyUrls?: string[];
}

export async function mockFootballApi(page: Page, options?: MockFootballApiOptions) {
  const flakyFailureCount = new Map<string, number>();

  await page.route("**/v3.football.api-sports.io/**", async (route) => {
    const url = route.request().url();
    const search = new URL(url).searchParams;

    if (options?.flakyUrls) {
      for (const pattern of options.flakyUrls) {
        if (url.includes(pattern)) {
          const failures = flakyFailureCount.get(pattern) ?? 0;
          if (failures < 1) {
            flakyFailureCount.set(pattern, failures + 1);
            return route.abort();
          }
        }
      }
    }

    // Route: GET /teams (teams list for league/season)
    if (url.includes("/teams?league=1&season=2022")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(teamsList),
      });
    }

    // Extract team ID and player ID from different parameter names
    let teamId = null;
    let playerId = null;
    
    // Try to match team=ID or team&ID
    const teamMatch = url.match(/[?&]team[=&](\d+)/);
    if (teamMatch) teamId = teamMatch[1];
    
    // Try to match id=ID (used in /teams and player detail endpoints)
    const idMatch = url.match(/[?&]id[=&](\d+)/);
    if (idMatch) {
      if (url.includes("/players?")) {
        playerId = idMatch[1];
      } else {
        teamId = idMatch[1];
      }
    }

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

    // Route: GET /players by player id
    if (url.includes("/players?") && playerId && !url.includes("/players/squads")) {
      const detail = playerDetails[playerId];
      if (detail) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            get: "players",
            parameters: {
              id: playerId,
              league: "1",
              season: "2022",
            },
            errors: [],
            results: 1,
            paging: {
              current: 1,
              total: 1,
            },
            response: [detail],
          }),
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

    // Route: GET /fixtures list for a team
    if (url.includes("/fixtures?") && search.get("league") === "1" && search.get("season") === "2022" && search.get("team") === "6") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(japanFixtures),
      });
    }

    // Route: GET /fixtures by fixture ID
    if (url.includes("/fixtures?") && search.get("id") === "855746") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(japanFixtures),
      });
    }

    // Route: GET /fixtures/players for a fixture and team
    if (url.includes("/fixtures/players") && search.get("fixture") === "855746") {
      if (search.get("team") === "6") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(japanFixturePlayersHome),
        });
      }

      if (search.get("team") === "8") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(japanFixturePlayersAway),
        });
      }
    }

    // If no mock data found, abort the request
    return route.abort();
  });
}
