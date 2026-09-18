# Credits & attribution

This is **commissioned work**. Most of what you see on screen is not mine.
This file records who made what, so nothing here is passed off as my own.

> **⚠ OUTSTANDING — the repo is already public.** `[CLIENT NAME]` below is still a
> placeholder. Ask the client for the name or studio they want credited, and whether
> they want to be named at all. Until then this page credits their work to nobody,
> which is the one thing this file exists to prevent.

---

## Artwork — © [CLIENT NAME], all rights reserved

Every image and the video in `assets/` were drawn and produced by the client —
**except `assets/ui/`, which is mine** (see below).
They may not be reused, redistributed, or adapted without the client's
permission. See [LICENSE](LICENSE).

| File | What it is |
|---|---|
| `assets/title/title-bg.png` | Title screen painting, including the hand-lettered "Ways to Remain" logo |
| `assets/title/intro.mp4` | Animated opening sequence |
| `assets/lobby/passport.png` | Passport spread used as the stage-select background |
| `assets/lobby/ticket-roiet.png` | Roi Et bus ticket (stage 1 button) |
| `assets/lobby/stamp-bangkok.png` | Bangkok visa stamp |
| `assets/lobby/stamp-png.png` | Papua New Guinea migration stamp |
| `assets/lobby/stamp-japan.png` | Japan immigration stamp |
| `assets/roiet/scene.png` | Roi Et riverside panorama (3965 × 1080) |
| `assets/roiet/coffin.png` | Coffin / bier object layer |
| `assets/roiet/villager.png` | Villager object layer |
| `assets/roiet/villager-portrait.png` | Villager portrait for the dialog box |

The site is published at https://sh1usez.github.io/Way-To-Remain/, so these files
are served publicly. GitHub Pages cannot be access-restricted on a free or Pro
account — making the repository private would hide the source, not the artwork.

The client also supplied layout reference images (the files named
`ตัวอย่างจัดวาง…`). Those are not committed here — they were used only to
measure where each asset sits, and every position in the CSS is taken from them.

## UI brush panels — mine

`assets/ui/brush-panel.svg` and `assets/ui/brush-tag.svg` are the dialog box and
label backgrounds. I generated them from scratch as SVG paths — no stock art, no
traced or downloaded image — so they carry no third-party licence.

They are a stand-in matched to the client's ink style. If the client would rather
paint their own brush frames, dropping replacements at those two paths is the only
change needed.

Like the rest of the code, no licence is granted for them — see [LICENSE](LICENSE).

## Audio — sourced by the developer, licences NOT YET RECORDED

> **⚠ OUTSTANDING.** These files were downloaded from free sound libraries, but the
> source URL and licence of each one is not recorded below. The repo is public, so
> any CC-BY file here is currently being used **without the attribution its licence
> requires**. Fill in the two right-hand columns from wherever each file was
> downloaded, and drop anything that turns out to be non-commercial or share-alike.

| File | Used for | Source | Licence |
|---|---|---|---|
| `assets/audio/bgm-roiet-khaen.mp3` | Roi Et background music (khaen) | — | — |
| `assets/audio/amb-roiet.mp3` | Roi Et ambience, river and insects | — | — |
| `assets/audio/sfx-stamp.mp3` | Passport stamp on stage select | — | — |
| `assets/audio/sfx-paper.mp3` | Paper rustle on card hover | — | — |
| `assets/audio/sfx-hover.mp3` | Start button hover | — | — |
| `assets/audio/sfx-confirm.mp3` | Start button press | — | — |
| `assets/audio/sfx-whoosh.mp3` | Page transition | — | — |
| `assets/audio/sfx-tick.mp3` | Hotspot hover | — | — |
| `assets/audio/sfx-thud.mp3` | Dialog box opens | — | — |
| `assets/audio/sfx-blip.mp3` | Dialog typewriter | — | — |
| `assets/audio/sfx-select.mp3` | Dialog advance | — | — |

Background music is used on the Roi Et stage only. The title screen and lobby have
sound effects but no music, by the client's instruction.

## Font — Playpen Sans Thai

Designed by TypeTogether, distributed through Google Fonts under the
[SIL Open Font License 1.1](https://openfontlicense.org/).
Loaded from the Google Fonts CDN in `css/base.css`; not bundled in this repo.
Requested by the client.

## Placeholder Thai dialogue — mine, and temporary

The Thai lines in `data/roiet-dialog.js` are **placeholder text I wrote** to get
the dialog system working. They are not the client's script and are not final —
they exist to be replaced. Do not treat them as the game's writing.

## Code

Everything in `css/`, `js/`, `data/` and the `.html` files was written by me,
with assistance from Claude (Anthropic). Commit authorship is mine alone.

> **This repo is public but not open source.** Because the work was commissioned,
> ownership of the code may sit with the client depending on the agreement, so no
> licence is offered until that is settled. If the client is happy for the code to
> be released, MIT would be the natural choice — that is a conversation to have
> with them, not a decision to make unilaterally. See [LICENSE](LICENSE).
