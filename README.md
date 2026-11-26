# unknownchat

**unknownchat** is a one-page, anonymous, text-only question-and-answer experience. Visitors can ask a question or volunteer to answer. Human matches are prioritized; if no human match is available after about seven seconds, a clearly identified local rule-based bot can take part.

> **Release status: public testing / release candidate.** GitHub Pages deployment and static checks are automated. This release adds client-side bot conversations, but the static architecture does not provide globally shared bot workers, authoritative global online counts, server-enforced moderation, or guaranteed WebRTC connectivity.

## Product features

- Responsive one-page Asker and Answerer flows
- Temporary peer presence and targeted human match offers
- Direct human-to-human text messages, typing indicator, end-chat and disconnect handling
- 40 rule-based bot profiles: 20 Answerers and 20 Questioners
- Exactly 100 JSON messages per bot profile (4,000 total messages)
- Human matching is prioritized; a local bot fallback starts after about seven seconds when no human match is available
- Automated participants are explicitly identified in the chat
- Illustrative activity pulse cycles through 500 JSON samples every 2.5 seconds; it is not a verified live-user count
- In-memory chat state only; no app accounts, database, or chat-history feature
- Client-side message length and rate limits

## Technology

- Static HTML, CSS, and JavaScript modules
- JSON bot library: `bots/bot-library.json`
- JSON illustrative activity samples: `bots/activity-pulse.json`
- Local rule-based selection engine: `bots/bot-engine.js`
- [Trystero 0.27.0](https://trystero.dev/) Torrent strategy, pinned via ESM CDN
- WebRTC data channels for human-to-human messaging
- GitHub Pages with GitHub Actions deployment

There is no application server and no AI API in this version. Trystero's public Nostr signaling relays are used for peer discovery and connection setup. Bot profiles and replies are fetched as static JSON and selected in the visitor's browser.

## Bot behavior and architecture limits

- An Asker first waits for a human Answerer. If no human match is available after about seven seconds, a local Answerer bot can join.
- An Answerer first waits for a human Asker. If no human match is available after about seven seconds, a local Questioner bot can start a conversation.
- A human match cancels a pending bot fallback and takes priority.
- Bots are local browser-side simulations. They are not 40 continuously running agents on a central server and do not create cross-browser bot matchmaking. Each visitor's browser runs its own fallback behavior using the shared static JSON library.
- The activity number is an illustrative pulse, not a real global online count. It includes automated activity and is disclosed as illustrative in the UI. Do not describe it as verified human users online.
- Bot chat messages remain in memory and are cleared when the chat ends or the page is closed.

## Local development

Serve the repository over HTTP because the app imports ES modules and fetches JSON:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in two separate browser profiles. Use a normal browser window as the Asker and a private/incognito window as the Answerer. Because this prototype sets Trystero identity to `none`, separate tabs receive independent temporary identities.

To test bot fallbacks, open one browser profile, choose Asker or Answerer, and leave it waiting. A local bot should join after roughly seven seconds if no human match is found. The bot name and "Automated participant" disclosure should be visible in the chat. Try sending several messages and then ending the chat.

Also test from two devices on different networks. A successful same-device test does not prove that restrictive NATs and firewalls will work.

## Deployment

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Every push to `main` starts the `Deploy unknownchat to GitHub Pages` workflow.
4. Check the **Actions** tab for the deployment result and published URL.

No build command or secret is required for the static site.

## Matching and privacy behavior

- Lobby presence broadcasts role and availability only. The question is sent in a targeted offer to the selected human Answerer.
- Human chat messages and typing events are sent only to the selected peer.
- Messages are held in page memory and are not intentionally written to an application database or browser storage.
- Ending a chat clears local in-memory conversation state. The other participant can still copy, screenshot, or otherwise retain content.
- WebRTC encrypts data-channel traffic in transit. This does **not** provide absolute anonymity: peers may learn network information such as IP addresses, and signaling relays, the static host, and the CDN process connection metadata.
- The site does not include analytics, advertising scripts, or an application database.

Do not share passwords, payment details, precise location, phone numbers, or other sensitive information. Do not use the service for emergencies or professional advice.

## Connectivity behavior

- The app uses Trystero 0.27.0's default Nostr strategy for signaling. Both clients must use the same app ID, room ID, strategy, and compatible protocol version.
- The app uses the Trystero 0.27.0 two-argument `joinRoom(config, roomId)` API and handles signaling/WebRTC failures through `room.onError()`; the older third-argument `onJoinError` callback is not supported in 0.27.0.
- The UI distinguishes signaling readiness, peer discovery, and a failed WebRTC connection. A `peer-connect-failed` event means discovery may have succeeded but the network path could not be established.
- Trystero's default STUN configuration may be enough for most networks, but some mobile, carrier-grade NAT, campus, VPN, or corporate networks require a TURN relay. This static build does not include private TURN credentials.

## Production launch blockers

This static architecture is suitable for testing the bot interaction design, not for claiming a fully production-ready public chat service:

1. **No authoritative matchmaking service.** Human matching is cooperative and client-side. A modified client can ignore local restrictions or send unsolicited traffic.
2. **No globally shared bot workers.** Bot replies are generated by each visitor's browser from static JSON; they are not centrally deployed agents.
3. **No server-enforced moderation or abuse reporting.** Client-side throttles are only a usability guard and can be bypassed. There is no durable report queue, review console, or reliable ban enforcement across all visitors.
4. **No authoritative online counter.** The activity pulse is illustrative and must not be treated as a verified live count.
5. **No managed TURN service.** Some networks block direct WebRTC connections. A production deployment should provision a TURN service and issue short-lived credentials from a secure backend; never publish TURN secrets in this repository.
6. **No operational monitoring or support process.** There are no uptime, relay-health, abuse, or incident-response dashboards.
7. **Legal/privacy review is still required.** Add a real operator contact, jurisdiction-specific privacy notice, terms, age/safety policy, retention disclosures, and an abuse-response process before inviting the general public.

For a genuine production launch, add a small trusted backend for queue ownership, bot orchestration, rate limiting, reports, moderation, TURN credential issuance, and observability. Keep message payloads peer-to-peer if privacy is a core product requirement.

## Testing checklist

- [ ] GitHub Pages workflow succeeds and the deployed page loads over HTTPS
- [ ] Bot JSON validates: 40 profiles, 20 per role, 100 messages per profile
- [ ] Activity pulse JSON validates: 500 samples
- [ ] Asker falls back to a disclosed Answerer bot after the wait
- [ ] Answerer falls back to a disclosed Questioner bot after the wait
- [ ] A human match takes priority over a pending bot fallback
- [ ] Bot conversations accept multiple user messages and end cleanly
- [ ] Two independent browser profiles discover each other
- [ ] Asker question is delivered to exactly one Answerer
- [ ] Two-way human messages work and are not shown to other lobby peers
- [ ] Typing indicator works
- [ ] Cancel while waiting and end chat both clean up correctly
- [ ] Reload, tab close, and peer disconnect return the other participant to a safe state
- [ ] Test on Android Chrome, desktop Chrome/Firefox/Safari, and different networks
- [ ] Test relay failure, blocked WebRTC, repeated messages, and malformed peer payloads

## License

No license has been added yet. Add an explicit license before accepting external contributions or allowing reuse.
