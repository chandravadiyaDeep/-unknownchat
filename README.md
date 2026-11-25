# unknownchat

A single-page, anonymous, text-only Q&A chat. Ask a question and get paired with an Answerer, or join as an Answerer and help someone.

## Stack

- One static `index.html` (vanilla HTML, CSS and ES modules)
- [Trystero](https://trystero.dev/) with its Torrent signaling strategy
- Browser-to-browser WebRTC data channels for chat messages
- No app backend, account system, database, or chat-history storage

## Run locally

Because the page uses an ES module import, serve the repository over HTTP instead of opening `index.html` as a `file://` URL. For example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in two separate browser profiles (for example, a normal window and an incognito window). Choose Ask in one and Answer in the other. Test again on two devices and different networks.

## Deploy with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. Wait for the Pages deployment and open the published URL.

The site is static and requires no build command.

## Matching and privacy notes

- The lobby broadcasts role and availability only. The question is sent directly to the selected Answerer in a targeted match offer.
- Chat messages and typing events are sent to the selected peer using targeted Trystero actions.
- Presence is temporary and expires locally when heartbeats stop.
- Ending a chat clears the page's in-memory conversation state. Closing the page also leaves the Trystero room.
- Trystero uses public signaling infrastructure to discover peers and exchange connection setup data. WebRTC encrypts data-channel traffic, but this is **not absolute anonymity**: peers may learn network information such as IP addresses, and hosting/CDN/font providers process ordinary page requests.
- This project does not write chat messages to an application database or browser storage. The other participant can still copy, screenshot, or otherwise retain what they see.

## Important production limitations

This is an early serverless prototype, not a moderated or abuse-resistant production service. Public peer-to-peer lobbies have no authoritative matchmaking server, so availability and matching can vary with peer discovery, relay health, browser lifecycle, and network conditions. A peer can run a modified client. Do not use this for emergencies or share sensitive information.

Before monetization or public launch, review legal requirements, hosting logs, third-party dependencies, accessibility, abuse reporting, and privacy disclosures. Adding analytics or advertising may change the privacy claims.
