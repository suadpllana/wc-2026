# WC2026.live

React/Vite World Cup 2026 dashboard with fixtures, groups, team pages, news, match predictions, estimated 1X2 odds, AdSense slots, and sponsored betting links.

## Development

```bash
npm install
npm run dev
```

## Monetization

Create a local `.env` file with your real publisher and affiliate values:

```bash
VITE_ADSENSE_CLIENT=ca-pub-your-google-publisher-id
VITE_ADSENSE_SLOT_TOP_BANNER=your-slot-id
VITE_ADSENSE_SLOT_HOME_MID_RECTANGLE=your-slot-id
VITE_ADSENSE_SLOT_HOME_BOTTOM_RECTANGLE=your-slot-id
VITE_ADSENSE_SLOT_TAB_TOP_BANNER=your-slot-id
VITE_ADSENSE_SLOT_TAB_BOTTOM_RECTANGLE=your-slot-id
VITE_ADSENSE_SLOT_PREDICTIONS_IN_ARTICLE=your-slot-id
VITE_STAKE_AFFILIATE_URL=https://stake.com/?c=your-code
VITE_1XBET_AFFILIATE_URL=https://1xbet.com/?tag=your-code
```

Ad links must comply with Google AdSense policies, sportsbook affiliate terms, and local gambling laws. The app labels betting links as sponsored and includes 18+ responsible gambling messaging.
