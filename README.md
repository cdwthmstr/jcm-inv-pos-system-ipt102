<div align="center">

# <img src="https://api.iconify.design/tabler:cash-register.svg?color=%233fd6c9&width=40" width="34" style="vertical-align:middle" /> JCM Inventory POS System

**A browser-based point-of-sale and inventory dashboard, built for IPT102**

<img src="https://img.shields.io/badge/status-coursework-3fd6c9?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/course-IPT102-1a2440?style=for-the-badge" />

<img src="https://skillicons.dev/icons?i=html,css,js" />

<p>
  <a href="#features">Features</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#running-locally">Running Locally</a> &middot;
  <a href="#structure">Structure</a>
</p>

</div>

<br />

A single-page point-of-sale and inventory dashboard for a small store, dashboard stats, product catalog, a cart-based checkout flow, and delivery tracking, all running client-side with no backend.

## Features

- **Dashboard**, today's/monthly/yearly sales, transaction count, low stock and pending delivery alerts, recent sales and top products tables
- **Point of Sale**, searchable product grid, add-to-cart, quantity controls, and checkout
- **Products**, add, edit, and track stock for inventory items
- **Deliveries**, track incoming supplier deliveries and their status
- Responsive sidebar navigation with a mobile hamburger toggle
- All data (products, sales, deliveries) persists in the browser via `localStorage`, no server or database required

## Tech Stack

Plain HTML5, CSS3, and vanilla JavaScript, no framework or build step. Icons from Font Awesome.

## Structure

```
v1/
  index.html   dashboard, POS, products, and deliveries pages
  style.css    layout and theme
  script.js    navigation, cart logic, localStorage persistence
```

## Running Locally

```
npx serve v1
```

Then open the printed local URL in your browser.

## Course Context

Built as a frontend project for **IPT102**.
