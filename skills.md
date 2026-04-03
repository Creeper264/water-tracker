# 编程相关 AI Agent Skills 清单

> **更新时间**: 2026-04-03  
> **来源**: GitHub、SkillHub、ClawHub  
> **目的**: 为 AI Agent 提供可复用的编程技能集合，覆盖团队协作、一人公司、专业开发等场景

---

## 📋 目录

- [核心编程技能](#核心编程技能)
- [团队协作技能](#团队协作技能)
- [一人公司/独立开发者](#一人公司独立开发者)
- [代码质量与审查](#代码质量与审查)
- [开发工具集成](#开发工具集成)
- [行业特定技能](#行业特定技能)
- [最佳实践资源](#最佳实践资源)

---

## 🚀 核心编程技能

### 1. Expert-Coding-Skills ⭐⭐⭐
**仓库**: [ProgrammerAnthony/Expert-Coding-Skills](https://github.com/CameloeAnthony/AndroidMVPDemo)  
**描述**: 生产级 AI Agent 技能集，覆盖代码审查、安全审计、TDD、需求工程、架构设计、调试等

**技能列表**:
- 代码审查 (Code Review)
- 安全审计 (Security Audit)
- 测试驱动开发 (TDD)
- 需求工程 (Requirements Engineering)
- 架构设计 (Architecture Design)
- 调试技能 (Debugging Skills)

**适用场景**: 专业开发团队、企业级项目

---

### 2. BytesAgain AI Skills ⭐⭐⭐
**仓库**: [bytesagain/ai-skills](https://github.com/bytesagain/ai-skills)  
**描述**: 最大的开源 AI Agent Skill 集合，461+ 插件，支持 Claude Code、OpenClaw 等 SKILL.md 兼容平台

**安装方式**:
```bash
# Claude Code
/plugin marketplace add bytesagain/ai-skills
/plugin install debug@bytesagain-skills
/plugin install sql-generator@bytesagain-skills
```

**分类统计**:
| 分类 | 示例 | 数量 |
|------|------|------|
| Dev Tools | debug, lint, git, docker, sql-generator | 80+ |
| Content | blog-writer, tweet-generator, copywriter | 50+ |
| Finance | crypto-tracker, portfolio, bookkeeper | 40+ |
| Productivity | task-planner, calendar, note-taker | 40+ |
| Chinese Tools | 中文日历, 成语词典, 公务员考试 | 30+ |
| Data | chart-generator, csv-analyzer, dashboard | 30+ |
| Health | fitness-plan, sleep-tracker, meditation | 20+ |
| Industrial | PLC, SCADA, HMI, CNC, CAD, CAM | 60+ |
| More | 150+ additional skills | 150+ |

**适用场景**: 全栈开发、数据处理、内容创作

---

### 3. Superpowers ⭐⭐⭐
**仓库**: GitHub Trending 榜单项目  
**描述**: AI 编程 Agent 的工程化技能框架，78,000+ 星标，为 AI 编码代理注入专业工程师的"肌肉记忆"

**核心能力**:
- 完整的软件开发工作流框架
- 代码生成最佳实践
- 项目架构设计模式
- 测试与部署流程

**适用场景**: AI 辅助编程、自动化开发

---

## 👥 团队协作技能

### 1. Pair Programming Skills
**来源**: [Team Collaboration and Pair Programming](https://github.com/GSA/data.gov/wiki/Team-Collaboration-and-Pair-Programming)

**核心实践**:
- **Owner-Supporter 模式**: Task 粒度控制（几小时到一两天）
- **TMUX 协作**: 多用户实时编程会话
- **远程结对编程**: 分布式团队协作

**技能要点**:
```
1. Pair 形成 → Team 讨论分解 Task
2. Owner 自发协商选择任务
3. Supporter 配对开发
4. 实时代码共享与审查
```

**工具支持**:
- VS Code Live Share
- TMUX 多人会话
- Slack Huddle 集成

---

### 2. Code Review & Team Review
**技能类型**: 团队评审、技术评审

**流程规范**:
- WalkThrough (走读)
- Peer DeskCheck (同行检查)
- Technical Review (技术评审)
- Ad hoc Review (特别检查)

**最佳实践**:
- 评审参与者必须了解评审过程
- 避免"为了评审而评审"
- 关注代码质量而非个人风格

---

## 🏢 一人公司/独立开发者

### 1. One-Person Company AI Tools ⭐⭐⭐
**仓库**: [cyfyifanchen/one-person-company](https://github.com/cyfyifanchen/one-person-company)  
**描述**: 一人公司 AI 工具系列，持续更新，帮助独立开发者提升生产力

**核心工具链**:

#### 大语言模型 (LLM)
| 模型 | 特点 | 排名 |
|------|------|------|
| Claude 3.7 Sonnet | 多功能通用、知识更新快 | WebDev Arena 🥇 #1 |
| Gemini-2.5-Pro | 逻辑推理强、支持多模态 | WebDev Arena 🥈 #2 |
| DeepSeek-V3 | 开发能力优秀、代码质量高 | WebDev Arena 🏅 #4 |

#### 代码开发工具
| 工具 | 特点 | 价格 |
|------|------|------|
| Cursor | AI 辅助开发、代码补全、上下文理解强 | 基础功能免费 |
| Deepwiki | 自动生成代码文档、支持私有仓库 | 免费 |
| Tempo | 快速构建全栈项目（后端+前端+Auth+支付） | 免费 |

#### TTS 语音合成
| 服务 | 特点 | 价格 |
|------|------|------|
| Microsoft Azure TTS | 多语言支持、情感语调强大 | 免费 5M 字符/月 |
| ElevenLabs | 角色感强、音质好、支持情绪变化 | $11/百万字符起 |
| 科大讯飞 | 中文语音第一、多场景支持 | ¥0.2/千字符 |

#### 设计工具
| 工具 | 特点 | 价格 |
|------|------|------|
| Recraft.ai | 全能设计神器、Logo/图片/MockUp/Banner | 每天 100 次免费 |
| Canva | 海量模板、支持文档/白板/社媒/视频 | 绑卡免费 30 天 |
| Finisher | AI 生成沉浸式网页头图 | 免费 |

---

### 2. OneClaw Framework
**仓库**: [hkyutong/OneClaw](https://github.com/hkyutong/OneClaw)  
**标语**: "One person. An AI army. A fully operational company."

**核心理念**:
- 一人驱动的 AI 军团
- 自动化执行
- 无需招聘即可扩展

**适用场景**: 独立创业者、自由职业者、微型企业

---

### 3. Bika.ai
**网站**: [bika.ai](https://bika.ai/)  
**描述**: AI Organizer for One-Person Company

**核心功能**:
- AI Programmer: 一键生成网页
- X/Twitter Manager: 自动化推文管理
- Email Marketer: 邮件自动化流程

---

## 🔍 代码质量与审查

### 1. Code Review Skills
**核心维度**:
- 代码正确性
- 性能优化建议
- 安全漏洞检测
- 可维护性评估

### 2. Security Audit Skills
**检查项**:
- SQL 注入防护
- XSS 漏洞扫描
- CSRF 防护
- 敏感信息泄露
- 依赖包安全审计

### 3. Test-Driven Development (TDD)
**流程**:
```
1. 编写测试用例（Red）
2. 实现最小代码（Green）
3. 重构优化（Refactor）
4. 重复循环
```

---

## 🛠️ 开发工具集成

### 1. IDE & 编辑器
| 工具 | 特点 | 适用平台 |
|------|------|----------|
| Cursor | AI 辅助开发、3.7 免费用 | 跨平台 |
| VS Code | 开源免费、插件丰富 | 跨平台 |
| Windsurf | 轻量级开发工具 | 跨平台 |
| TRAE | AI 驱动 IDE | Web |

### 2. 终端工具
| 工具 | 特点 | 价格 |
|------|------|------|
| Warp | AI 增强终端 | 提供免费额度 |
| TMUX | 会话保持、多用户协作 | 开源免费 |

### 3. 文档生成
| 工具 | 特点 | 价格 |
|------|------|------|
| Deepwiki | 自动生成技术文档 | 免费 |
| gitdiagram | 架构可视化 | 免费 |
| gitsummarize | 架构级概览 | 开源 |

---

## 🏭 行业特定技能

### 1. 工业自动化
**技能覆盖**: PLC、SCADA、HMI、CNC、CAD、CAM  
**数量**: 60+ 技能  
**来源**: BytesAgain AI Skills

### 2. 金融科技
**技能列表**:
- crypto-tracker: 加密货币追踪
- portfolio: 投资组合管理
- bookkeeper: 记账工具
- stock-analysis: 股票分析

**数量**: 40+ 技能

### 3. 数据科学
**技能列表**:
- chart-generator: 图表生成
- csv-analyzer: CSV 分析
- dashboard: 数据面板
- RAG Agent: 检索增强生成

**数量**: 30+ 技能

---

## 📚 最佳实践资源

### 1. Programming Best Practices
**仓库**: [dereknguyen269/programing-best-practices](https://github.com/dereknguyen269/programing-best-practices-2023)  
**覆盖范围**: 30+ 编程语言和框架  
**内容类型**: 文章、指南、最佳实践

### 2. Awesome AI DevTools
**仓库**: [candicehchow/awesome-ai-devtools](https://github.com/candicehchow/awesome-ai-devtools)  
**描述**: AI 驱动的开发者工具精选列表  
**包含**:
- IDE 集成
- 代码补全工具
- 重构工具
- 调试工具
- 文档生成器

### 3. Programming Skills Summary
**仓库**: [mafing/programming-skills-summary](https://github.com/mafing/programming-skills-summary)  
**内容**: 
- API 设计
- Git 最佳实践
- HTML/CSS
- JavaScript
- Python
- 数据库
- NoSQL
- 服务器部署

---

## 🔧 技能安装方式

### OpenClaw / ClawHub
```bash
# 通过 ClawHub 安装
clawhub install skill-name

# 或使用 skillhub
skillhub install skill-name
```

### Claude Code
```bash
# 添加市场
/plugin marketplace add bytesagain/ai-skills

# 安装技能
/plugin install skill-name@bytesagain-skills
```

### 直接复制
将 SKILL.md 文件复制到项目的 `.claude-plugin/skills/` 目录

---

## 📊 技能统计总览

| 分类 | 数量 | 主要来源 |
|------|------|----------|
| 开发工具 | 80+ | BytesAgain |
| 内容创作 | 50+ | BytesAgain |
| 金融科技 | 40+ | BytesAgain |
| 生产力工具 | 40+ | BytesAgain |
| 中文工具 | 30+ | BytesAgain |
| 数据处理 | 30+ | BytesAgain |
| 健康管理 | 20+ | BytesAgain |
| 工业自动化 | 60+ | BytesAgain |
| 其他技能 | 150+ | 社区贡献 |
| **总计** | **461+** | 多来源 |

---

## 🎯 推荐技能组合

### 全栈开发者
```
✅ debug@bytesagain-skills
✅ sql-generator@bytesagain-skills
✅ git-skills
✅ docker-tools
✅ api-design
```

### 一人公司/独立开发者
```
✅ task-planner
✅ calendar
✅ blog-writer
✅ email-marketer
✅ chart-generator
✅ cursor-integration
```

### 团队协作
```
✅ code-review
✅ pair-programming
✅ team-communication
✅ project-management
✅ documentation-generator
```

### 数据科学家
```
✅ csv-analyzer
✅ chart-generator
✅ dashboard
✅ rag-agent
✅ ml-pipeline
```

---

## 📖 学习路径

### 初级开发者
1. 学习基础编程最佳实践
2. 使用代码生成工具（Cursor、v0.dev）
3. 掌握 Git 协作流程
4. 练习代码审查

### 中级开发者
1. 深入架构设计模式
2. 学习 TDD 实践
3. 掌握安全审计技能
4. 自动化开发流程

### 高级开发者
1. 构建自定义 Skills
2. 集成 AI Agent 到工作流
3. 优化团队协作流程
4. 贡献开源技能

---

## 🔗 相关链接

### 官方平台
- [OpenClaw](https://openclaw.ai) - AI Agent 平台
- [ClawHub](https://clawhub.ai) - 技能市场
- [SkillHub](https://skillhub.ai) - 技能分发平台

### 推荐仓库
- [bytesagain/ai-skills](https://github.com/bytesagain/ai-skills) - 461+ Skills
- [cyfyifanchen/one-person-company](https://github.com/cyfyifanchen/one-person-company) - 一人公司工具
- [candicehchow/awesome-ai-devtools](https://github.com/candicehchow/awesome-ai-devtools) - AI 开发工具

### 模型排行
- [LMArena Leaderboard](https://web.lmarena.ai/leaderboard) - 模型对比
- [Alama](https://alama.ai) - 模型对比聚合平台

---

## 📝 贡献指南

欢迎贡献新的编程技能！请遵循以下步骤：

1. Fork 相关仓库
2. 创建 SKILL.md 文件
3. 添加必要的脚本和文档
4. 提交 Pull Request

### SKILL.md 格式
```markdown
---
name: skill-name
description: 简短描述
---

# Skill 标题

详细的使用说明和示例...
```

---

## 📄 许可证

各技能遵循其原始仓库的许可证。本清单采用 MIT 许可证。

---

**最后更新**: 2026-04-03  
**维护者**: AI Agent Community  
**贡献者**: 感谢所有开源贡献者
