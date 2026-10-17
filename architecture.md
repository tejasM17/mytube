# YouTube Clone Architecture

**YourTube** — two-process clone: a Next.js client (`yourtube/`) and an Express API (`server/`). Media files live on the API disk. User identity starts in Firebase Auth (Google) and is upserted into MongoDB. There is no Prisma, Supabase, PostgreSQL, JWT middleware, App Router, or server actions in the current tree.

---

## 1. System overview

```mermaid
flowchart LR
  subgraph client [yourtube — Next.js Pages Router]
    UI[Pages + components]
    AuthCtx[AuthContext]
    FB[Firebase Auth]
    AX[axios BACKEND_URL]
  end
  subgraph api [server — Express 5]
    RT[Routers]
    CT[Controllers]
    ML[Multer uploads/]
  end
  subgraph data [Data]
    MG[(MongoDB via Mongoose)]
  end
  UI --> AuthCtx
  AuthCtx --> FB
  AuthCtx --> AX
  UI --> AX
  AX -->|HTTP JSON / multipart| RT
  RT --> CT
  CT --> MG
  CT --> ML
  UI -->|video src /uploads| ML
```

```mermaid
sequenceDiagram
  actor U as Browser
  participant N as Next.js pages
  participant F as Firebase Auth
  participant E as Express :5000
  participant M as MongoDB
  U->>N: Sign in
  N->>F: signInWithPopup Google
  F-->>N: email, name, photoURL
  N->>E: POST /user/login
  E->>M: find or create user
  M-->>E: user document
  E-->>N: { result }
  N->>N: localStorage user
  U->>N: Open /watch/:id
  N->>E: GET /video/getall
  N->>E: POST /history/:videoId { userId }
  E->>M: history row + views++
  N->>E: GET /comment/:videoid
```

---

## 2. Technical stack

Versions are the ranges declared in `package.json` (lockfile may pin patches).

| Layer | Choice | Version |
| --- | --- | --- |
| Frontend framework | Next.js (Pages Router, `reactStrictMode`) | `15.3.3` |
| UI library | React / React DOM | `^19.0.0` |
| Language | TypeScript (strict, `jsx: preserve`, path `@/*`) | `^5` |
| CSS | Tailwind CSS v4 + `@tailwindcss/postcss` + `tw-animate-css` | `^4` / `^1.3.4` |
| Component system | shadcn/ui, style `new-york`, base `neutral`, CSS variables, icons `lucide` | CLI preset `b0`, template `next` (project landed on Pages, `rsc: false`) |
| Class helpers | `clsx`, `tailwind-merge`, `class-variance-authority` | `^2.1.1` / `^3.3.0` / `^0.7.1` |
| Primitives | Radix Avatar, Dialog, Dropdown Menu, Label, Progress, Slot | see `yourtube/package.json` |
| Toasts / theme hook | `sonner`, `next-themes` | `^2.0.5` / `^0.4.6` |
| Icons / dates | `lucide-react`, `date-fns` | `^0.513.0` / `^4.1.0` |
| HTTP client | `axios` (`baseURL = BACKEND_URL`) | `^1.10.0` |
| Client auth | Firebase Auth, Google popup | `firebase ^11.9.1` |
| API | Express (ESM), `cors`, `dotenv`, `body-parser` | `express ^5.1.0` |
| Uploads | Multer disk storage, `video/mp4` only; `express-fileupload` is installed and unused | `multer ^2.0.1` |
| Database | MongoDB + Mongoose. **No Prisma, Supabase, or PostgreSQL.** | `mongoose ^8.16.0` |
| Token lib | `jsonwebtoken` is a dependency and is **not** used. Routes are open. | `^9.0.2` |
| Process | `nodemon` via `npm start`, `PORT` or `5000` | `^3.1.10` |
| Deploy target in repo | None committed (no `vercel.json`, Docker, or CI). Next is Vercel-shaped; Express + local `uploads/` needs a Node host with a persistent disk or object storage. | — |

**shadcn components present:** `avatar`, `button`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `sonner`, `textarea`.

**Not in this repo:** App Router (`app/`), React Server Components, Server Actions, route handlers under `app/api` (only a stub `src/pages/api/hello.ts`), middleware, Prisma schema, Supabase client.

### 2026 UI building blocks (installed vs typical extensions)

Installed and in active use: Button, Input, Dialog, Dropdown Menu, Avatar, Sonner, Lucide.

Common shadcn extensions this product surface still calls for (not installed): `sidebar`, `sheet` (mobile drawer), `tabs`, `scroll-area`, `separator`, `skeleton`, `badge`, `tooltip`, `card`, `form` + `zod`, `command` (search palette), `aspect-ratio` (16:9 player), `slider` (seek), `popover`.

---

## 3. Folder structure

```text
you_tube2.0/
├── architecture.md
├── yourtube/                      # Next.js client
│   ├── components.json            # shadcn new-york / neutral
│   ├── next.config.ts             # exposes BACKEND_URL
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── public/                    # static svg + sample video
│   └── src/
│       ├── pages/                 # Pages Router (not App Router)
│       │   ├── _app.tsx           # UserProvider + Header + Sidebar + Toaster
│       │   ├── _document.tsx
│       │   ├── index.tsx          # home feed
│       │   ├── api/hello.ts       # unused Next API stub
│       │   ├── search/index.tsx
│       │   ├── watch/[id]/index.tsx
│       │   ├── channel/[id]/index.tsx
│       │   ├── history/index.tsx
│       │   ├── liked/index.tsx
│       │   └── watch-later/index.tsx
│       ├── components/            # feature UI
│       │   ├── ui/                # shadcn primitives
│       │   ├── Header.tsx
│       │   ├── Sidebar.tsx
│       │   ├── Videogrid.tsx, videocard.tsx, Videopplayer.tsx
│       │   ├── VideoInfo.tsx, VideoUploader.tsx, RelatedVideos.tsx
│       │   ├── Comments.tsx, category-tabs.tsx, SearchResult.tsx
│       │   ├── ChannelHeader.tsx, Channeltabs.tsx, ChannelVideos.tsx
│       │   ├── channeldialogue.tsx
│       │   └── HistoryContent.tsx, LikedContent.tsx, WatchLaterContent.tsx
│       ├── lib/
│       │   ├── AuthContext.js     # Google sign-in + /user/login
│       │   ├── axiosinstance.js
│       │   ├── firebase.js
│       │   └── utils.ts           # cn()
│       └── styles/globals.css
└── server/
    ├── index.js                   # Express bootstrap + mongoose.connect
    ├── routes/                    # auth, video, like, watchlater, history, comment
    ├── controllers/               # same domains
    ├── Modals/                    # Mongoose models (folder name is Modals)
    ├── filehelper/filehelper.js   # multer
    └── uploads/                   # served at GET /uploads
```

Sidebar also links to `/explore` and `/subscriptions`. Those pages are not in `src/pages`.

---

## 4. Frontend routes and navigation

Shell is global in `_app.tsx`: sticky header, left sidebar, page body. All pages are client-rendered React components (`"use client"` is implicit for Pages). Data fetching is `axios` inside components, not `getServerSideProps`.

| Path | File | Role |
| --- | --- | --- |
| `/` | `pages/index.tsx` | Home grid from `GET /video/getall` |
| `/search?q=` | `pages/search/index.tsx` | Client filter of the same video list |
| `/watch/[id]` | `pages/watch/[id]/index.tsx` | Player, likes, comments, history, watch later |
| `/channel/[id]` | `pages/channel/[id]/index.tsx` | Channel header + that uploader’s videos |
| `/history` | `pages/history/index.tsx` | `GET /history/:userId` |
| `/liked` | `pages/liked/index.tsx` | `GET /like/:userId` |
| `/watch-later` | `pages/watch-later/index.tsx` | `GET /watch/:userId` |
| `/api/hello` | `pages/api/hello.ts` | Next stub, not used by the UI |

```mermaid
flowchart TB
  subgraph top [Header]
    Menu[Menu icon — no drawer wired]
    Logo[Logo → /]
    Search[Search form → /search?q=]
    Mic[Mic — visual only]
    Upload[Video icon — visual only]
    Bell[Bell — visual only]
    Avatar[Avatar menu or Sign in]
  end
  subgraph side [Sidebar w-64 always visible]
    Home[/]
    Explore[/explore — no page]
    Subs[/subscriptions — no page]
    Hist[/history]
    Liked[/liked]
    WL[/watch-later]
    Chan["/channel/:id or Create Channel dialog"]
  end
  Avatar --> Hist
  Avatar --> Liked
  Avatar --> WL
  Avatar --> Chan
```

**Auth UX.** Signed-out users see Sign in (Google popup). Signed-in users see avatar menu: channel or Create Channel, History, Liked, Watch later, Sign out (`firebase` `signOut` + `localStorage` clear). Personal sidebar links render only when `user` is set. There is no responsive collapse: Menu does not toggle the sidebar, and there is no bottom nav.

**Create channel** opens `channeldialogue` and `PATCH /user/update/:id` with `{ channelname, description }`.

---

## 5. Backend shape

```mermaid
flowchart TB
  IDX[index.js]
  IDX --> U[/user]
  IDX --> V[/video]
  IDX --> L[/like]
  IDX --> W[/watch]
  IDX --> H[/history]
  IDX --> C[/comment]
  IDX --> S["GET / and static /uploads"]
  U --> authC[controllers/auth.js]
  V --> videoC[controllers/video.js]
  V --> multer[filehelper multer]
  L --> likeC[controllers/like.js]
  W --> wlC[controllers/watchlater.js]
  H --> histC[controllers/history.js]
  C --> comC[controllers/comment.js]
  authC --> User[(user)]
  videoC --> Vid[(videofiles)]
  likeC --> Like[(like)]
  wlC --> WL[(watchlater)]
  histC --> Hist[(history)]
  comC --> Com[(comment)]
  Like --> Vid
  WL --> Vid
  Hist --> Vid
  Com --> Vid
  Com --> User
```

Controllers are plain async `(req, res)` handlers. No service layer, no auth middleware, no validation library. JSON body limit is 30mb. CORS is open.

### Data models (`server/Modals`)

| Model | Collection | Fields |
| --- | --- | --- |
| `user` | users | `email` required, `name`, `channelname`, `description`, `image`, `joinedon` |
| `videofiles` | videofiles | `videotitle`, `filename` (declared twice), `filetype`, `filepath`, `filesize`, `videochanel`, `Like` default 0, `views` default 0, `uploader`, timestamps |
| `like` | likes | `viewer` → user, `videoid` → videofiles, `likedon`, timestamps |
| `watchlater` | watchlaters | same shape as like |
| `history` | histories | same shape as like; each POST inserts a new row and increments views |
| `comment` | comments | `userid`, `videoid`, `commentbody`, `usercommented`, `commentedon`, timestamps |

`DB_URL` comes from `server/.env`. Files are stored under `server/uploads` and exposed at `/uploads/<filename>`.

---

## 6. Endpoint catalog

Base URL: `process.env.BACKEND_URL` (client) and `http://localhost:5000` by default (server). **Every route is unauthenticated.** The client sends Mongo `_id` values in the body or path; the server does not check a session or bearer token.

Errors are usually `500 { message: "Something went wrong" }`.

### Health and files

| Method | Path | Body / query | Success | Auth |
| --- | --- | --- | --- | --- |
| GET | `/` | — | text `You tube backend is working` | none |
| GET | `/uploads/:filename` | — | static file | none |

### Users — `routes/auth.js` → `controllers/auth.js`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/user/login` | JSON `{ email, name, image }` | `201 { result: user }` if created, else `200 { result: existingUser }` | none (Firebase already verified on the client only) |
| PATCH | `/user/update/:id` | JSON `{ channelname, description }`. `:id` must be a Mongo ObjectId | `201` updated user document. Invalid id → `500 { message: "User unavailable..." }` | none |

### Videos — `routes/video.js` → `controllers/video.js`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/video/upload` | `multipart/form-data`: file field `file` (mp4), fields `videotitle`, `videochanel`, `uploader` | `201` string `"file uploaded successfully"`. Missing/non-mp4 → `404 { message: "plz upload a mp4 video file only" }` | none |
| GET | `/video/getall` | — | `200` array of videofiles documents | none |

Search, channel lists, and related videos are filtered in the browser from `getall`. There is no query API.

### Likes — `routes/like.js`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/like/:videoId` | JSON `{ userId }`. Toggle: delete row and `Like -= 1`, or create and `Like += 1` | `200 { liked: true \| false }` | none |
| GET | `/like/:userId` | — | `200` array of like docs with `videoid` populated | none |

### Watch later — mounted at `/watch`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/watch/:videoId` | JSON `{ userId }`. Toggle | `200 { watchlater: true \| false }` | none |
| GET | `/watch/:userId` | — | `200` array with `videoid` populated | none |

### History and views — `routes/history.js`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/history/:videoId` | JSON `{ userId }`. Always inserts a history row and `views += 1` | `200 { history: true }` | none |
| POST | `/history/views/:videoId` | no body. `views += 1`. **No success response is sent** on the happy path | `500` only on throw | none |
| GET | `/history/:userId` | — | `200` array with `videoid` populated (duplicates possible) | none |

Route order: `POST /history/views/:videoId` is registered before `POST /history/:videoId`, so `views` is not captured as a video id.

### Comments — `routes/comment.js`

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| GET | `/comment/:videoid` | — | `200` comment array for that video | none |
| POST | `/comment/postcomment` | JSON body saved as a comment (`videoid`, `userid`, `commentbody`, `usercommented`) | `200 { comment: true }` | none |
| DELETE | `/comment/deletecomment/:id` | — | `200 { comment: true }`. Bad id → `404` text `comment unavailable` | none |
| POST | `/comment/editcomment/:id` | JSON `{ commentbody }` | `200` pre-update document (`findByIdAndUpdate` without `{ new: true }`). Bad id → `404` text | none |

`GET /comment/:videoid` is registered first. Paths `postcomment` and `deletecomment` still match the other verbs, so they are not swallowed by that GET.

---

## 7. Request data flow

```mermaid
flowchart LR
  subgraph read [Read path]
    P[Page mount] --> G[GET /video/getall]
    G --> Grid[Video grid / search / channel filter]
    Grid --> Wpage["/watch/:id"]
    Wpage --> GC[GET /comment/:id]
  end
  subgraph write [Write path — needs user._id in body]
    SI[Google sign-in] --> UL[POST /user/login]
    UL --> LS[localStorage]
    UP[Upload dialog] --> VU[POST /video/upload]
    LK[Like button] --> PL[POST /like/:videoId]
    HM[Watch page] --> PH[POST /history/:videoId]
    CM[Comment form] --> PC[POST /comment/postcomment]
  end
```

Playback URL is the stored `filepath` (Multer path such as `uploads/<file>`), requested from the API origin, not from Next `public/`.

---

## 8. What this architecture is not

- **Not App Router.** Routing is `src/pages`. Adding `app/` later would duplicate the shell unless `_app` is retired.
- **Not authorized.** `jsonwebtoken` is unused. Any caller who knows an id can like, comment, delete a comment, or edit a channel.
- **Not a split BaaS.** MongoDB is the only database. Firebase is identity only (no Firestore, no Storage in code).
- **Sidebar links `/explore` and `/subscriptions` have no pages.** Header Menu, Mic, Bell, and upload icon have no behavior. Upload lives in the video uploader component.

---

## 9. Local environment

Two files. Nothing else in this tree is read from the environment. Firebase web config is hardcoded in `yourtube/src/lib/firebase.js` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`), so Google sign-in does not need env vars.

Start MongoDB, then the API (`server/`, `npm start`, nodemon), then the client (`yourtube/`, `npm run dev`, Next on port `3000`).

### `server/.env`

Loaded by `dotenv.config()` in `server/index.js`. `DB_URL` is required. `PORT` falls back to `5000`.

```bash
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/yourtube
```

Atlas example (same variable, replace user, password, and cluster):

```bash
DB_URL=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/yourtube?retryWrites=true&w=majority
```

### `yourtube/.env.local`

Next loads this file. `next.config.ts` copies `BACKEND_URL` into `process.env.BACKEND_URL` for the browser (axios base URL and `/uploads` video `src`). It must be the API origin, with no trailing slash. Restart `next dev` after changing it.

```bash
BACKEND_URL=http://localhost:5000
```

If `PORT` on the API is not `5000`, set `BACKEND_URL` to that same origin.
