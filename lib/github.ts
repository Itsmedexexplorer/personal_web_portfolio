import "server-only";

export interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Activity {
  days: Day[];
  total: number;
  longestStreak: number;
  bestDay: number;
}

const headers = (): HeadersInit => (process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {});

/** Last 12 months of contributions, refreshed hourly. */
export async function getActivity(user: string): Promise<Activity | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { contributions: Day[] };
    const days = json.contributions;
    if (!days?.length) return null;
    let total = 0, longestStreak = 0, run = 0, bestDay = 0;
    for (const d of days) {
      total += d.count;
      run = d.count ? run + 1 : 0;
      longestStreak = Math.max(longestStreak, run);
      bestDay = Math.max(bestDay, d.count);
    }
    return { days, total, longestStreak, bestDay };
  } catch {
    return null;
  }
}

/** Name and age of the most recently pushed public repo, refreshed every 10 minutes. */
export async function getLatestRepo(user: string): Promise<{ name: string; pushedAt: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=5&type=owner`, {
      headers: { Accept: "application/vnd.github+json", ...headers() },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as { name: string; pushed_at: string; fork: boolean; private: boolean }[];
    const r = repos.find((x) => !x.fork && !x.private && x.name.toLowerCase() !== user.toLowerCase());
    return r ? { name: r.name, pushedAt: r.pushed_at } : null;
  } catch {
    return null;
  }
}
