import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView, Notice } from "obsidian";
import { exec, ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// ─── Constants ───────────────────────────────────────────────────────────────

const VIEW_TYPE = "gstack-command-center";
const GSTACK_DIR = path.join(os.homedir(), ".gstack");
const ANALYTICS_DIR = path.join(GSTACK_DIR, "analytics");

interface SkillButton {
  name: string;
  label: string;
  icon: string;
  description: string;
  category: "workflow" | "research" | "ops" | "safety";
}

const SKILLS: SkillButton[] = [
  { name: "office-hours", label: "Office Hours", icon: "💡", description: "YC-style product diagnostic", category: "workflow" },
  { name: "investigate", label: "Investigate", icon: "🔍", description: "Root-cause debugging", category: "workflow" },
  { name: "qa", label: "QA Test", icon: "🧪", description: "Find and fix bugs", category: "workflow" },
  { name: "qa-only", label: "QA Report", icon: "📋", description: "Report-only QA", category: "workflow" },
  { name: "review", label: "Code Review", icon: "👁", description: "Pre-landing PR review", category: "workflow" },
  { name: "ship", label: "Ship", icon: "🚀", description: "Test, push, open PR", category: "workflow" },
  { name: "retro", label: "Retro", icon: "📊", description: "Weekly retrospective", category: "research" },
  { name: "health", label: "Health", icon: "💚", description: "Code quality dashboard", category: "ops" },
  { name: "llm-council", label: "LLM Council", icon: "🧠", description: "5 AI advisors weigh in", category: "research" },
  { name: "ai-strategy-researcher", label: "Strategy", icon: "📈", description: "AI business strategy", category: "research" },
  { name: "plan-ceo-review", label: "CEO Review", icon: "🎯", description: "10-star product thinking", category: "workflow" },
  { name: "plan-eng-review", label: "Eng Review", icon: "⚙️", description: "Architecture lock-in", category: "workflow" },
  { name: "cso", label: "Security Audit", icon: "🛡", description: "OWASP + STRIDE audit", category: "safety" },
  { name: "benchmark", label: "Benchmark", icon: "⚡", description: "Performance baselines", category: "ops" },
  { name: "canary", label: "Canary", icon: "🐤", description: "Post-deploy monitoring", category: "ops" },
];

// ─── Settings ────────────────────────────────────────────────────────────────

interface GstackSettings {
  projectDir: string;
  theme: "dark" | "light";
  outputDir: string;
}

const DEFAULT_SETTINGS: GstackSettings = {
  projectDir: "",
  theme: "dark",
  outputDir: "gstack-outputs",
};

// ─── Plugin ──────────────────────────────────────────────────────────────────

export default class GstackCommandCenter extends Plugin {
  settings: GstackSettings = DEFAULT_SETTINGS;
  runningProcesses: Map<string, ChildProcess> = new Map();

  async onload() {
    await this.loadSettings();

    this.registerView(VIEW_TYPE, (leaf) => new CommandCenterView(leaf, this));

    this.addRibbonIcon("terminal-square", "gstack Command Center", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-command-center",
      name: "Open Command Center",
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: "run-skill",
      name: "Run gstack skill...",
      callback: () => this.showSkillPicker(),
    });

    this.addSettingTab(new GstackSettingTab(this.app, this));
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  showSkillPicker() {
    // In a full implementation, this would open a fuzzy suggest modal.
    // For now, open the command center view which has all skill buttons.
    this.activateView();
  }

  async runSkill(skillName: string, args?: string): Promise<string> {
    const projectDir = this.settings.projectDir || this.getVaultPath();
    const skillCmd = args
      ? `claude -p "/${skillName} ${args}" --verbose --output-format stream-json`
      : `claude -p "/${skillName}" --verbose --output-format stream-json`;

    // Detect if running on Windows with a WSL project path
    const isWindows = process.platform === "win32";
    const isWslPath = projectDir.startsWith("\\\\wsl");

    let cmd: string;
    let cwd: string;

    if (isWindows && isWslPath) {
      // Convert \\wsl$\Ubuntu\home\user\project → /home/user/project
      const linuxPath = projectDir
        .replace(/^\\\\wsl\$\\[^\\]+/, "")
        .replace(/\\/g, "/");
      cmd = `wsl bash -lc "cd ${linuxPath} && ${skillCmd}"`;
      cwd = process.env.USERPROFILE || "C:\\";
    } else if (isWindows) {
      // Windows-native path, try wsl anyway since claude CLI is in WSL
      cmd = `wsl bash -lc "${skillCmd}"`;
      cwd = projectDir;
    } else {
      cmd = skillCmd;
      cwd = projectDir;
    }

    return new Promise((resolve, reject) => {
      const child = exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        this.runningProcesses.delete(skillName);
        if (err) {
          reject(new Error(stderr || err.message));
        } else {
          resolve(stdout);
        }
      });
      this.runningProcesses.set(skillName, child);
    });
  }

  async runTest(): Promise<string> {
    const isWindows = process.platform === "win32";
    const cmd = isWindows
      ? `wsl bash -lc "echo OK-from-WSL && claude --version 2>&1 | head -1"`
      : `echo OK-local && claude --version 2>&1 | head -1`;

    return new Promise((resolve, reject) => {
      exec(cmd, { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout);
      });
    });
  }

  getVaultPath(): string {
    const adapter = this.app.vault.adapter as any;
    return adapter.basePath || "";
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    for (const [, proc] of this.runningProcesses) {
      proc.kill();
    }
  }
}

// ─── View ────────────────────────────────────────────────────────────────────

class CommandCenterView extends ItemView {
  plugin: GstackCommandCenter;
  outputEl: HTMLElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: GstackCommandCenter) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "gstack Command Center"; }
  getIcon() { return "terminal-square"; }

  async onOpen() {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.addClass("gstack-cc");

    // Header
    const header = container.createDiv("gstack-cc-header");
    header.createEl("h2", { text: "gstack Command Center" });
    const statusEl = header.createDiv("gstack-cc-status");
    this.renderStatus(statusEl);

    // Skill grid by category
    const categories: Record<string, string> = {
      workflow: "Workflow",
      research: "Research & Analysis",
      ops: "Operations",
      safety: "Safety & Security",
    };

    for (const [cat, label] of Object.entries(categories)) {
      const skills = SKILLS.filter((s) => s.category === cat);
      if (!skills.length) continue;

      const section = container.createDiv("gstack-cc-section");
      section.createEl("h3", { text: label });
      const grid = section.createDiv("gstack-cc-grid");

      for (const skill of skills) {
        const btn = grid.createEl("button", { cls: "gstack-cc-btn" });
        btn.createSpan({ text: skill.icon, cls: "gstack-cc-btn-icon" });
        const info = btn.createDiv("gstack-cc-btn-info");
        info.createEl("strong", { text: skill.label });
        info.createEl("small", { text: skill.description });

        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.triggerSkill(skill);
        });
      }
    }

    // Test connection button
    const testSection = container.createDiv("gstack-cc-section");
    const testBtn = testSection.createEl("button", { text: "Test Connection", cls: "gstack-cc-test-btn" });
    testBtn.addEventListener("click", async () => {
      testBtn.textContent = "Testing...";
      try {
        const result = await this.plugin.runTest();
        testBtn.textContent = "Connected: " + result.trim();
        testBtn.addClass("gstack-cc-test-ok");
      } catch (err: any) {
        testBtn.textContent = "Error: " + err.message;
        testBtn.addClass("gstack-cc-test-fail");
      }
    });

    // Recent outputs section
    const outputSection = container.createDiv("gstack-cc-section");
    outputSection.createEl("h3", { text: "Output" });
    this.outputEl = outputSection.createDiv("gstack-cc-output");
    this.outputEl.createEl("p", { text: "Click a skill to run it. Output appears here.", cls: "gstack-cc-muted" });

    // Recent activity
    const activitySection = container.createDiv("gstack-cc-section");
    activitySection.createEl("h3", { text: "Recent Activity" });
    await this.renderActivity(activitySection);
  }

  renderStatus(el: HTMLElement) {
    const projectDir = this.plugin.settings.projectDir || this.plugin.getVaultPath();
    const projectName = path.basename(projectDir);

    // Check git branch
    exec("git branch --show-current", { cwd: projectDir }, (err, stdout) => {
      const branch = stdout?.trim() || "unknown";
      el.empty();
      el.createSpan({ text: `${projectName}`, cls: "gstack-cc-project" });
      el.createSpan({ text: ` on `, cls: "gstack-cc-muted" });
      el.createSpan({ text: branch, cls: "gstack-cc-branch" });
    });
  }

  async renderActivity(el: HTMLElement) {
    const usageFile = path.join(ANALYTICS_DIR, "skill-usage.jsonl");
    try {
      const content = fs.readFileSync(usageFile, "utf-8");
      const lines = content.trim().split("\n").slice(-10).reverse();
      const list = el.createEl("ul", { cls: "gstack-cc-activity" });

      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          const li = list.createEl("li");
          const time = new Date(entry.timestamp || entry.ts).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
          });
          li.createSpan({ text: `/${entry.skill || entry.name}`, cls: "gstack-cc-skill-name" });
          li.createSpan({ text: ` — ${time}`, cls: "gstack-cc-muted" });
          if (entry.duration_s) {
            li.createSpan({ text: ` (${Math.round(entry.duration_s)}s)`, cls: "gstack-cc-muted" });
          }
        } catch { /* skip malformed lines */ }
      }
    } catch {
      el.createEl("p", { text: "No activity yet. Run a skill to see history.", cls: "gstack-cc-muted" });
    }
  }

  async triggerSkill(skill: SkillButton) {
    new Notice(`Clicked: /${skill.name}`);
    if (!this.outputEl) {
      new Notice("Error: outputEl is null");
      return;
    }

    // Show running state
    this.outputEl.empty();
    const statusLine = this.outputEl.createDiv("gstack-cc-running");
    statusLine.createSpan({ text: `${skill.icon} Running /${skill.name}...` });
    const spinner = statusLine.createSpan({ cls: "gstack-cc-spinner" });

    new Notice(`gstack: running /${skill.name}...`);

    try {
      const result = await this.plugin.runSkill(skill.name);
      this.outputEl.empty();

      // Parse stream-json output for the final result
      const lines = result.trim().split("\n");
      let finalText = "";
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          if (msg.type === "assistant" && msg.message?.content) {
            for (const block of msg.message.content) {
              if (block.type === "text") finalText += block.text + "\n";
            }
          }
        } catch {
          finalText += line + "\n";
        }
      }

      // Render output
      const header = this.outputEl.createDiv("gstack-cc-output-header");
      header.createSpan({ text: `${skill.icon} /${skill.name}` });
      header.createEl("button", { text: "Save to vault", cls: "gstack-cc-save-btn" })
        .addEventListener("click", () => this.saveOutput(skill.name, finalText));

      const pre = this.outputEl.createEl("pre", { cls: "gstack-cc-output-text" });
      pre.createEl("code", { text: finalText.trim() || "(no output)" });

      new Notice(`gstack: /${skill.name} complete`);
    } catch (err: any) {
      this.outputEl.empty();
      this.outputEl.createEl("p", { text: `Error: ${err.message}`, cls: "gstack-cc-error" });
      new Notice(`gstack: /${skill.name} failed`);
    }
  }

  async saveOutput(skillName: string, content: string) {
    const outputDir = this.plugin.settings.outputDir;
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `${outputDir}/${skillName}-${date}.md`;

    await this.app.vault.adapter.mkdir(outputDir);
    await this.app.vault.create(fileName, `# /${skillName} — ${date}\n\n${content}`);
    new Notice(`Saved to ${fileName}`);
  }

  async onClose() {}
}

// ─── Settings Tab ────────────────────────────────────────────────────────────

class GstackSettingTab extends PluginSettingTab {
  plugin: GstackCommandCenter;

  constructor(app: App, plugin: GstackCommandCenter) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "gstack Command Center" });

    new Setting(containerEl)
      .setName("Project directory")
      .setDesc("Working directory for skill execution. Leave blank to use vault root.")
      .addText((text) =>
        text
          .setPlaceholder("/path/to/your/project")
          .setValue(this.plugin.settings.projectDir)
          .onChange(async (value) => {
            this.plugin.settings.projectDir = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Output folder")
      .setDesc("Vault folder where skill outputs are saved.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.outputDir)
          .onChange(async (value) => {
            this.plugin.settings.outputDir = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
