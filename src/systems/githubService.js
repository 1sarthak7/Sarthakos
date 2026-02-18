export class GithubService {
    constructor(username) {
        this.username = username;
        this.baseUrl = 'https://api.github.com';
        this.readmeCache = new Map();
    }

    async fetchData() {
        try {
            // 1. Fetch User Profile
            const userRes = await fetch(`${this.baseUrl}/users/${this.username}`);
            if (!userRes.ok) throw new Error('API Rate Limit or Network Error');
            const userData = await userRes.json();

            // 2. Fetch Repositories (Sorted by last updated)
            // Limit to 12 for performance and visual clarity
            const reposRes = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=12`);
            const reposData = await reposRes.json();

            // 3. Process Data for Planets
            const repos = this.processRepos(reposData);
            
            // 4. Calculate Heuristic Metrics
            // Fetching commits for every repo triggers rate limits immediately.
            // We use a "Contribution Score" heuristic instead.
            const totalStars = reposData.reduce((acc, r) => acc + r.stargazers_count, 0);
            const totalForks = reposData.reduce((acc, r) => acc + r.forks_count, 0);
            const contribScore = (userData.public_repos * 10) + (totalStars * 5) + (totalForks * 2);

            return {
                repos: repos,
                metrics: {
                    totalRepos: userData.public_repos,
                    totalStars: totalStars,
                    totalCommits: contribScore, // Score displayed as 'Activity'
                    avatar: userData.avatar_url
                },
                isFallback: false
            };

        } catch (error) {
            console.warn("SarthakOS: Offline Mode / API Limit Reached. Using Fallback Data.");
            return this.getFallbackData();
        }
    }

    async fetchReadme(repoName) {
        if (this.readmeCache.has(repoName)) return this.readmeCache.get(repoName);

        try {
            const res = await fetch(`${this.baseUrl}/repos/${this.username}/${repoName}/readme`, {
                headers: { 'Accept': 'application/vnd.github.raw' }
            });
            
            if (!res.ok) return "# NO README DETECTED\n\nNo transmission data found for this sector.";
            
            const text = await res.text();
            this.readmeCache.set(repoName, text);
            return text;
        } catch (e) {
            return "# DATA STREAM INTERRUPTED\n\nSignal lost.";
        }
    }

    processRepos(repos) {
        return repos
            .filter(r => !r.fork) // Filter out forks if desired
            .map((repo, index) => ({
                name: repo.name,
                description: repo.description || "No description provided.",
                language: repo.language || "Plain Text",
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                
                // --- Procedural Planet Properties ---
                // Color based on language
                color: this.getLangColor(repo.language),
                // Radius increases with index (spaced out)
                orbitRadius: 45 + (index * 14), 
                // Speed decreases with distance (Kepler-ish)
                orbitSpeed: 0.35 - (index * 0.015), 
                // Size based on stars (popularity = mass)
                size: 2.0 + (Math.min(repo.stargazers_count, 50) * 0.05),
                // Random Start Angle
                angle: Math.random() * Math.PI * 2,
                // Axis Tilt
                tilt: (Math.random() - 0.5) * 0.5
            }));
    }

    getLangColor(lang) {
        const colors = {
            'JavaScript': '#f7df1e', 'Python': '#3776ab', 'TypeScript': '#3178c6',
            'HTML': '#e34c26', 'CSS': '#563d7c', 'Vue': '#41b883', 'React': '#61dafb',
            'Rust': '#dea584', 'C++': '#f34b7d', 'Go': '#00add8', 'Java': '#b07219'
        };
        return colors[lang] || '#00f3ff'; // Default Neon Blue
    }

    getFallbackData() {
        return {
            repos: [
                { name: "SarthakOS", description: "Interactive 3D Data Cosmos", language: "JavaScript", stars: 100, forks: 20, orbitRadius: 45, orbitSpeed: 0.3, color: '#f7df1e', size: 2.5, angle: 0, tilt: 0, url: '#' },
                { name: "Neural-Net", description: "AI Logic Processing", language: "Python", stars: 50, forks: 10, orbitRadius: 60, orbitSpeed: 0.2, color: '#3776ab', size: 2.0, angle: 2, tilt: 0.2, url: '#' },
                { name: "Crypto-Core", description: "High Frequency Trading", language: "Rust", stars: 75, forks: 5, orbitRadius: 75, orbitSpeed: 0.15, color: '#dea584', size: 1.8, angle: 4, tilt: -0.2, url: '#' }
            ],
            metrics: { totalRepos: 10, totalStars: 225, totalCommits: 500 },
            isFallback: true
        };
    }
}