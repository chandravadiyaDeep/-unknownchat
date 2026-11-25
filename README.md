# unknownchat

**unknownchat** is a one-page, anonymous, text-only question-and-answer chat. A visitor can submit a question as an Asker or join as an Answerer. The browser pairs participants and sends chat messages directly over WebRTC.

> **Release status: public beta / release candidate.** The static site and deployment checks are in place, but real-world peer-to-peer reliability, abuse handling, and privacy/legal review must be completed before describing this as a fully production-ready public service.

## Product features

- Responsive one-page interface with Asker and Answerer flows
- Temporary peer presence and targeted match offers
- Direct text messages, typing indicator, end-chat and disconnect handling
- In-memory chat state only; no app accounts, database, or chat-history feature
- Client-side message length and rate limits
- Accessible labels, live status regions, and reduced-motion support

## Technology

- Static HTML, CSS, and JavaScript modules
- [Trystero 0.27.0](https://trystero.dev/) Torrent signaling strategy, pinned via ESM CDN
- WebRTC data channels for peer-to-peer messaging
- GitHub Pages with GitHub Actions deployment

There is no application server in this version. Trystero's public signaling infrastructure is used for peer discovery and connection setup.

## Local development

Serve the repository over HTTP because the app imports an ES module:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in two separate browser profiles. Use a normal browser window as the Asker and a private/incognito window as the Answerer. Two tabs in the same browser profile are not a valid independent-user test when browser identity persistence is enabled; this prototype currently uses ephemeral tab identities.

Also test from two devices on different networks. A successful same-device test does not prove that restrictive NATs and firewalls will work.

## Deployment

1. In the repository, open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Every push to `main` starts the `Deploy unknownchat to GitHub Pages` workflow.
4. Check the **Actions** tab for the deployment result and published URL.

No build command or secret is required for the static beta.

## Matching and privacy behavior

- Lobby presence broadcasts role and availability only. The question is sent in a targeted offer to the selected Answerer.
- Chat messages and typing events are sent only to the selected peer.
- Messages are held in page memory and are not intentionally written to an application database or browser storage.
- Ending a chat clears the local in-memory conversation state. The other participant can still copy, screenshot, or otherwise retain content.
- WebRTC encrypts data-channel traffic in transit. This does **not** provide absolute anonymity: peers may learn network information such as IP addresses, and signaling relays, the static host, and the CDN process connection metadata.
- No Google Fonts, analytics, or advertising scripts are included in the current page.

Do not share passwords, payment details, precise location, phone numbers, or other sensitive information. Do not use the service for emergencies or professional advice.

## Production launch blockers

This peer-to-peer static architecture is a prototype and has important limitations:

1. **No authoritative matchmaking service.** Matching is cooperative and client-side. A modified client can ignore local restrictions or send unsolicited traffic.
2. **No server-enforced moderation or abuse reporting.** Client-side throttles are only a usability guard and can be bypassed. There is no durable report queue, review console, or reliable ban enforcement across all visitors.
3. **No managed TURN service.** Some networks block direct WebRTC connections. A production deployment should provision a TURN service and issue short-lived credentials from a secure backend; never publish TURN secrets in this repository.
4. **No operational monitoring or support process.** There are no uptime, relay-health, abuse, or incident-response dashboards.
5. **Legal/privacy review is still required.** Add a real operator contact, jurisdiction-specific privacy notice, terms, age/safety policy, retention disclosures, and an abuse-response process before inviting the general public.

For a genuine production launch, add a small trusted backend for queue ownership, rate limiting, reports, moderation, TURN credential issuance, and operational observability. Keep message payloads peer-to-peer if privacy is a core product requirement.

## Testing checklist

- [ ] GitHub Pages workflow succeeds and the deployed page loads over HTTPS
- [ ] Two independent browser profiles discover each other
- [ ] Asker question is delivered to exactly one Answerer
- [ ] Two-way messages work and are not shown to other lobby peers
- [ ] Typing indicator works
- [ ] Cancel while waiting and end chat both clean up correctly
- [ ] Reload, tab close, and peer disconnect return the other participant to a safe state
- [ ] Test on Android Chrome, desktop Chrome/Firefox/Safari, and different networks
- [ ] Test relay failure, blocked WebRTC, repeated messages, and malformed peer payloads

## License

No license has been added yet. Add an explicit license before accepting external contributions or allowing reuse.
