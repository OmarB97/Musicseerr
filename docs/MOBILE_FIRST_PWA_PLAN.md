# MusicSeerr Mobile-First PWA Plan

## Context

MusicSeerr is used at `music.kostudios.io` from the KO NAS hosted fork
`OmarB97/Musicseerr`, including iPhone Safari's Add to Home Screen flow. The
current experience behaves like a desktop web app compressed into a phone:
global navigation is sidebar-shaped, the player is a fixed desktop bar, mobile
safe areas are not first-class, and dense content pages rely on breakpoint
fallbacks instead of phone-specific interaction models.

The fork should improve the KO-hosted experience quickly while keeping the
architecture upstreamable for `HabiRabbu/Musicseerr`. KO-only deployment,
secrets, container tags, and NAS restart procedures stay outside upstream code.

## Goals

- Make the iPhone standalone PWA feel deliberate: stable viewport, safe-area
  aware chrome, usable bottom navigation, and a player that does not cover
  primary content.
- Establish mobile shell primitives that every page can depend on instead of
  each page inventing its own padding, fixed bars, or breakpoint math.
- Phase the work so the fork can ship incremental PRs, then offer clean
  upstream PRs when the upstream-visible diff is not polluted by older fork
  patches.
- Verify on mobile-sized viewports and the live KO endpoint before calling the
  feature settled.

## Non-Goals

- Do not redesign every content page in phase 1.
- Do not introduce a native iOS wrapper before the web app has a solid PWA
  foundation.
- Do not commit KO NAS secrets, tokens, local endpoints, or deployment state.
- Do not force upstream to accept KO-specific branding, service assumptions, or
  deployment details.

## Architecture

### Shell Contract

The app shell owns the global mobile geometry:

- `viewport-fit=cover` and iOS standalone metadata in `app.html`.
- CSS custom properties for top safe area, bottom safe area, tab bar height,
  player height, and combined content padding.
- Desktop sidebar stays desktop-only; phone navigation becomes a bottom tab bar.
- Top search remains available on every page, with the search dialog accessible
  from the bottom tab bar.
- Page content gets padding through `.musicseerr-main-content`, not per-page
  guesses.

### Player Contract

The global player must be treated as mobile chrome:

- On phones, the mini-player sits above the bottom tab bar.
- Main content pads for both tab bar and player when playback is visible.
- Phone mini-player prioritizes artwork, title, artist, previous/play/next, and
  close. Queue, EQ, lyrics, volume, and provider badges remain available on
  larger breakpoints until a dedicated mobile full-player sheet is built.
- Desktop keeps the wide player bar at the bottom of the viewport.

### Content Contract

Phase 2 page work should consume the shell variables and follow a small set of
patterns:

- Cards become phone-readable list/cards with 44px or larger hit targets.
- Dense metadata moves into progressive sections or sheets.
- Tables gain mobile row/card variants instead of horizontal scrolling.
- Settings forms use grouped sections, sticky save affordances, and inputs that
  avoid iOS zoom.
- Album, artist, search, library, playlist, and request flows each need a
  phone-specific smoke path.

## Delivery Phases

### Phase 0 - Feature registration and plan

Create the MeshBoard feature and child tasks, capture this plan, and verify the
fork/upstream delivery constraints.

### Phase 1 - Mobile shell foundation

Ship the global PWA shell:

- iOS standalone metadata and manifest baseline.
- Safe-area CSS tokens.
- Mobile bottom tab navigation.
- Desktop-only sidebar behavior.
- Main content bottom padding contract.
- Mobile-positioned mini-player.
- Mobile toast offset.
- Svelte check/build plus viewport smoke.

### Phase 2 - Core phone flows

Refactor primary routes around phone use:

- Home/discover carousels and source switchers.
- Search results and suggestions.
- Album details, track list, source bars, and request controls.
- Artist details, discography, and monitoring controls.
- Library source pages and pagination.
- Playlists, queue, and requests.
- Settings sections and save/test controls.

### Phase 3 - Mobile full-player and queue

Add a phone-native playback layer:

- Expanded now-playing sheet.
- Queue drawer tuned for thumb use.
- Lyrics, EQ, provider source, scrobble status, and volume as sheet sections.
- Lock-screen/PWA media metadata audit where browser support allows.

### Phase 4 - KO deployment and live verification

After fork PR review and merge:

- Build a tagged fork image.
- Take a KO NAS lease before service updates.
- Deploy to `music.kostudios.io`.
- Verify health, mobile viewport screenshots, playback, navigation, search,
  and safe-area behavior.
- Roll back to the previous image tag if smoke fails.

## Fork and Upstream Strategy

The fork PR targets `OmarB97/Musicseerr` first so the hosted KO service can move
quickly. Upstream PRs target `HabiRabbu/Musicseerr` only when the upstream
visible diff is clean.

As of this plan, upstream PR #81 for the earlier Navidrome player fix is still
open. New mobile work should not be presented upstream as a clean standalone PR
until that base patch lands or the mobile branch is rebased onto a clean
upstream-compatible base. If a fork PR ships before then, record the upstream
handoff as blocked by the active fork-mirror stack rather than opening a noisy
upstream PR.

## Verification

Phase 1 verification:

- `pnpm check`
- `pnpm build`
- Browser smoke at iPhone-sized viewport with no horizontal overflow.
- Screenshots for home, search, library, and player-visible states when data is
  available.

Feature-level verification:

- Fork PR merged or explicitly held with review state.
- Upstream PR opened only when upstream-visible diff is clean, or a MeshBoard
  task records why it is blocked.
- KO NAS deployment uses a lease and records image tag, health check, and
  rollback tag.
- Live `music.kostudios.io` iPhone-sized smoke covers Home Screen PWA geometry:
  top safe area, bottom tab bar, player, scrollable content, search, library,
  settings, and playback.

## Risks and Mitigations

- Mobile shell changes can cover existing modals or toasts. Mitigate with
  explicit z-index ordering and viewport smoke.
- Sidebar changes can hide desktop-only links on phones. Mitigate by adding
  bottom-tab access for the most common routes now and tracking phase 2 for
  secondary routes.
- Player relocation can create double padding. Mitigate by making the shell the
  single owner of bottom padding.
- Upstream PRs can accidentally include older fork patches. Mitigate by checking
  `git diff upstream/main...HEAD` before upstream PR creation.
- Live deploy can interrupt household listening. Mitigate with KO NAS lease,
  health checks, and rollback tag.

## Open Follow-Ups

- Add automated Playwright mobile visual smoke once the local app can be run
  with predictable fixture data.
- Build the mobile full-player sheet in phase 3.
- Add route-level mobile tests for album, artist, library, playlist, requests,
  and settings in phase 2.
