/* ------------------------------------------------------------------
   Surya Sports Media — WhatsApp Landing Page configuration
   This is the ONLY file you normally need to edit.
   ------------------------------------------------------------------ */
window.LP_CONFIG = {

  /* ============ BUSINESS ============ */

  brandName: "Surya Sports Media",

  // Square logo mark shown in the header (SVG or PNG, in /assets).
  // Leave "" to fall back to the letter mark.
  logoMark: "assets/surya-mark.svg",

  // Full international format, digits only. NO "+", no spaces, no dashes.
  // India example: 91 + 9876543210  ->  "919876543210"
  // Add 2-5 numbers to spread traffic across them (see `rotation` below).
  whatsappNumbers: [
    "919423576797"
  ],

  // How to pick a number when more than one is listed:
  //   "random"     - pick at random on every visit (best for spreading load)
  //   "sequential" - round-robin per browser
  //   "off"        - always use the first number
  rotation: "off",

  // Text pre-filled in the user's WhatsApp compose box.
  prefillMessage: "Hi Surya Sports Media! I saw your ad and I'm interested. Please share the details.",

  /* ============ REDIRECT BEHAVIOUR ============ */

  // Send the visitor to WhatsApp automatically, without them tapping.
  // Set to false if you want a pure click-through page (safer for ad review).
  autoRedirect: false,

  // How long the landing page is visible before the auto-redirect fires (ms).
  // 2500 = 2.5 seconds. Keep this >= 1200 so the page is genuinely seen —
  // instant redirects can be flagged as a "bridge page" during Meta ad review.
  redirectDelayMs: 2500,

  // On desktop, open web.whatsapp.com instead of the wa.me interstitial.
  desktopUsesWebWhatsApp: false,

  /* ============ TRACKING ============ */

  // Google Analytics 4 measurement ID (e.g. "G-XXXXXXX") — leave "" to disable.
  ga4Id: "",

  // Grace period (ms) given to the pixel before an automatic redirect.
  // Button taps always navigate immediately (see app.js).
  trackingFlushMs: 300,

  /* ============ URL OVERRIDES ============ */

  // Lets one page serve many ads:
  //   ?n=919999999999   -> override the number
  //   ?m=Hello%20there  -> override the pre-filled message
  //   ?ref=summer_sale  -> campaign reference
  //   ?noredirect=1     -> disable auto-redirect (use this link for ad review)
  allowUrlOverrides: true,

  // Append the campaign reference to the WhatsApp message so you can tell
  // which ad each lead came from. Reads ?ref= then ?utm_campaign=.
  appendRefToMessage: false,
  refMessageFormat: "\n\n(Ref: {ref})",

  /* ============ COPY ============ */

  badge: "Replies in minutes",
  headline: "Get more customers from your ads",
  // Word(s) in the headline shown in orange. "" for none.
  headlineHighlight: "more customers",
  subheadline: "Tap the button below to chat with us directly. No forms, no waiting — just a quick message and we'll take it from there.",
  buttonLabel: "Chat with us on WhatsApp",
  reassurance: "Free consultation · No spam, ever",
  onlineLabel: "Online now",

  redirectingText: "Opening WhatsApp…",
  fallbackText: "Didn't open automatically? Tap the green button above.",

  /* ============ TRUST ROW ============ */

  showTrust: true,
  stats: [
    { value: "AI-powered", label: "Ads" },
    { value: "< 5 min",    label: "Avg. reply" },
    { value: "100%",       label: "Client focus" }
  ],

  /* ============ FOOTER / LEGAL ============ */

  footerNote: "Chat with us on WhatsApp",
  privacyUrl: "privacy.html",
  termsUrl: "terms.html",

  // Shown on privacy.html / terms.html. Meta's ad review looks for a real,
  // reachable contact — use an address you actually monitor.
  contactEmail: "hello@suryaads.com",
  // Leave "" to show today's date automatically.
  legalUpdated: "",

  /* ============ SEO / SHARING ============ */

  pageTitle: "Surya Sports Media — Chat on WhatsApp",
  pageDescription: "Message Surya Sports Media on WhatsApp for a free consultation. No forms, no waiting.",
  // Absolute URL of a 1200x630 preview image, or "" for none.
  shareImage: "assets/og-image.png"
};
