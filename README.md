# Arrival Sign

A browser version of the MTA Subway & Rail Arrival Sign: a 128x32 LED matrix countdown clock fed by the MTA's live subway data. One HTML file. No build step, no server, no API key.

## Run

Open `index.html` in a browser, or put it on any static host. The MTA feeds allow cross-origin requests, so the page fetches them directly.

For a wall display on a Raspberry Pi (`chromium-browser` on older Raspberry Pi OS):

    chromium --kiosk "file:///home/pi/index.html?s=L08N&m=compact"

On an iPhone: open the hosted page in Safari, set up your stations, then tap Share and Add to Home Screen. It launches full screen with its own icon and remembers changes made inside it.

## Use

- Add stations with the search box. With more than one, the sign rotates every 10 seconds.
- Tap the sign or press D to flip direction. M cycles modes, F toggles fullscreen.
- Modes: compact (next 3 trains), large (next 2), clock, service alerts, sleep.
- The setup lives in the URL, e.g. `?s=L08N,127S&m=compact`: GTFS stop IDs plus N or S for direction.

## How it works

- Polls all eight NYCT GTFS-realtime feeds every 30 seconds (about 95 KB gzipped) and decodes the protobuf with a small hand-written reader.
- Station names and direction labels come from the MTA Subway Stations dataset on data.ny.gov.
- Draws into a 128x32 framebuffer with the public-domain X11 5x8 and 6x13 bitmap fonts, the same ones rpi-rgb-led-matrix ships, so a physical build with two 64x32 HUB75 panels can reuse the layout pixel for pixel.

## Check

`node check.mjs` decodes a live feed with the page's parser and sanity-checks the output.

## Deploy

Cloudflare Pages deploys every push to `main`. There is no build step: the repo root is the site.

Not affiliated with the MTA.
