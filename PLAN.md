# Clew Implementation Plan

## Status: Phase 1 Complete — Foundation

Build and typecheck pass for all 10 packages + CLI app.

## Phase 2: Init, Config, Doctor + CLI Stubs
**Current:** ~50% done (CLI commands exist, need updating)

- [x] Root `package.json` with workspace scripts
- [x] `clew init` — creates `~/.clew` with config, providers, taste, subdirs
- [x] `clew config get/set` — reads/writes config.json
- [x] `clew doctor` — checks environment and providers
- [x] `clew key add/set/get/list/delete` — manages API keys
- [x] `clew model list/add/use` — model selection
- [x] `clew session list/new/show` — session management
- [x] `clew memory add/search/clear` — memory store
- [x] `clew taste show/add/dislike/inspect` — taste rules
- [x] Stubs: `run`, `plan`, `code`, `review`, `fix`, `test`, `loop`, `mcp`, `skill`, `bridge`

## Phase 3: Provider Gateway
**Current:** Partial

- [ ] OpenAI-compatible adapter (exists)
- [ ] Provider interface alignment with spec
- [ ] Key store using `~/.clew/keys.json`
- [ ] Model registry with route profiles (cheap/fast/best/local/balanced)
- [ ] Fallback strategy
- [ ] Test: key operations, model selection

## Phase 4: Memory Engine
**Current:** Partial

- [ ] SQLite database with schema (exists: store.ts, database.ts)
- [ ] FTS5 full-text search
- [ ] Memory types: preference, project_fact, decision, correction, session_summary, taste_signal, note
- [ ] Timeline events
- [ ] Feedback signals (accepted, rejected, corrected, etc.)
- [ ] Working memory
- [ ] Recall scoring formula
- [ ] `clew memory timeline`
- [ ] `clew memory feedback <id> <signal>`
- [ ] `clew memory forget <id>`
- [ ] Tests: add, search, timeline

## Phase 5: Taste Engine
**Current:** Partial

- [x] Taste store (store.ts, io.ts)
- [x] `clew taste add`
- [x] `clew taste dislike`
- [x] `clew taste inspect`
- [ ] Taste signal recording
- [ ] Taste prompt compiler (`compileTastePrompt`)
- [ ] Signal auto-learning (future)
- [ ] Tests: add rule, dislike, compile

## Phase 6: Chat
**Current:** Stub (uses DefaultAgentRuntime stub)

- [ ] Wire provider gateway into chat
- [ ] Load config + current model
- [ ] Load relevant memory
- [ ] Load compiled taste prompt
- [ ] Send messages to provider
- [ ] Save session events
- [ ] Interactive chat loop
- [ ] Test: `clew chat --message "hello"`

## Phase 7: Agents and Tools
**Current:** Stubs

- [ ] Tool permission interfaces
- [ ] File read/search tools
- [ ] Shell command with approval prompt
- [ ] Git status/diff tools
- [ ] Planner agent (reads task, returns plan)
- [ ] Reviewer agent (reads diff, returns review)
- [ ] `clew loop` — bounded repo check
- [ ] Test: agent types, permission gates

## Phase 8: Docs, README, Tests
**Current:** README is placeholder, no tests yet

- [ ] Rewrite README.md with proper intro, status, install, quick start
- [ ] docs/architecture.md
- [ ] docs/personal.md
- [ ] docs/providers.md
- [ ] docs/memory.md
- [ ] docs/taste.md
- [ ] docs/agents.md
- [ ] docs/mcp.md
- [ ] docs/skills.md
- [ ] Core config tests
- [ ] Taste tests
- [ ] Memory tests
- [ ] Gateway tests
- [ ] CLI smoke tests

## Future Phases (post-MVP)

- MCP client/server implementation
- Skills runner
- Bridge (WebSocket for remote approval/dashboard)
- Vector search (sqlite-vec)
- Dashboard (Vite + React)
- Team features
