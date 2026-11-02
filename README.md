# Commercial Litigation Lawyers Singapore — Silvester Legal LLC

Landing page and lead acquisition portal for **Silvester Legal LLC**, advocates and solicitors specializing in commercial litigation, shareholder disputes, and civil claims in Singapore.

## Features

- **Responsive Landing Page (`index.html`)**: Fully customized UI with high-contrast typography, brand accents (`#B61329`), interactive dispute selection chips, and litigation stages.
- **Dedicated Thank You Page (`thank-you.html`)**: Post-submission confirmation page designed for Google Ads / Tag Manager conversion firing.
- **Google Tag Manager Integration**: Configured with container `GTM-53FVN9W` in both `<head>` and `<body>` (noscript) across all pages.
- **Inquiry Routing**: Form submissions route client details to:
  - `Info@silvesterlegal.com`
  - `Fixen@silvesterlegal.com`
- **Persistent Storage**: All incoming client inquiries are recorded in `queries.json`.
- **Node.js Server (`server.js`)**: Static file serving and `POST /api/query` dispatch handling.

## Getting Started

### Prerequisites
- Node.js (v16+)

### Run Locally
```bash
npm start
```
Open your browser and navigate to `http://localhost:8088/`.
