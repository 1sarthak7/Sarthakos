export class Interface {
    constructor(onBack, githubService) {
        this.service = githubService;
        
        // DOM Elements
        this.panel = document.getElementById('holo-panel');
        this.globalMetrics = document.getElementById('global-metrics');
        this.readmeContainer = document.getElementById('readme-content');
        this.status = document.getElementById('system-status');
        
        this.backBtn = document.getElementById('back-btn');
        this.visitBtn = document.getElementById('visit-btn');
        
        this.currentUrl = '#';

        // Bind Events
        this.backBtn.addEventListener('click', onBack);
        this.visitBtn.addEventListener('click', () => {
            if(this.currentUrl) window.open(this.currentUrl, '_blank');
        });
    }

    updateMetrics(metrics) {
        document.getElementById('metric-repos').innerText = metrics.totalRepos;
        document.getElementById('metric-stars').innerText = metrics.totalStars;
        document.getElementById('metric-commits').innerText = metrics.totalCommits;
    }

    notify(msg) {
        this.status.innerText = msg;
        this.status.classList.add('visible');
        setTimeout(() => {
            this.status.classList.remove('visible');
        }, 4000);
    }

    async showProject(data) {
        // Transition UI
        this.globalMetrics.classList.add('hidden');
        this.panel.classList.add('active');

        // Set Basic Info
        document.getElementById('project-title').innerText = data.name;
        document.getElementById('project-tech').innerText = data.language;
        document.getElementById('project-stats').innerText = `★ ${data.stars}  🔱 ${data.forks}`;
        this.currentUrl = data.url;

        // Reset and Load Readme
        this.readmeContainer.innerHTML = '<span style="color: #00f3ff; animation: blink 1s infinite">ESTABLISHING DATA LINK...</span>';
        
        const rawMd = await this.service.fetchReadme(data.name);
        
        // Parse Markdown -> HTML (using marked.js)
        this.readmeContainer.innerHTML = marked.parse(rawMd);
    }

    hide() {
        this.panel.classList.remove('active');
        this.globalMetrics.classList.remove('hidden');
    }
}