<div align="center">

<img src="https://snapcart-gamma-henna.vercel.app/favicon.ico" width="64" height="64" alt="SnapCart Logo" />

# SnapCart

### A full-stack grocery delivery web application built with Next.js

[![Live Demo](https://img.shields.io/badge/Live%20Demo-snapcart--gamma--henna.vercel.app-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://snapcart-gamma-henna.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Overview

**SnapCart** is a production-ready, full-stack grocery delivery platform developed. It provides customers with a seamless end-to-end shopping experience — from browsing and searching products to secure checkout, delivery slot selection, and real-time order tracking — while giving administrators full control through a dedicated management dashboard.

The project is built entirely with the Next.js App Router, making use of server-side rendering, server actions, and API routes to deliver a fast, scalable, and maintainable architecture.

---

## Live Demo

🔗 **[snapcart-gamma-henna.vercel.app](https://snapcart-gamma-henna.vercel.app)**

> You can sign up with your Google account or register with an email and password to explore the full customer experience.

---

## Features

### Customer-Facing
- **Authentication** — Secure sign-in via Google OAuth and email/password credentials, powered by NextAuth.js
- **Product Browsing & Search** — Browse products by category with a responsive search interface
- **Cart & Checkout** — Add items to cart and complete purchases via Stripe or Razorpay payment gateway integration
- **Delivery Slot Selection** — Choose a preferred delivery date and time slot at checkout
- **Order Tracking** — Track order status in real-time from confirmation through delivery

### Admin Dashboard
- Manage products (create, update, delete) with image uploads via Cloudinary
- View and manage all customer orders with status controls
- Monitor platform activity

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) with TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with Mongoose ODM |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) — Google OAuth & Credentials |
| **Payments** | [Stripe](https://stripe.com/) / [Razorpay](https://razorpay.com/) |
| **Media Storage** | [Cloudinary](https://cloudinary.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---


## Getting Started

### Prerequisites

- Node.js `v18` or higher
- A MongoDB Atlas cluster (or local MongoDB instance)
- Accounts for: Google Cloud Console, Stripe or Razorpay, Cloudinary

### 1. Clone the Repository

```bash
git clone https://github.com/skmdJeesan/SnapCart.git
cd SnapCart
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and populate it with the following:

```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Razorpay (if applicable)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

SnapCart is deployed on **Vercel**. To deploy your own instance:

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy — Vercel will handle the build and hosting automatically.

---

## Roadmap

- [ ] Push notifications for order status updates
- [ ] Wishlist / saved items functionality
- [ ] Product reviews and ratings
- [ ] Coupon and discount code support
- [ ] Multi-vendor / seller support

---

## Contributing

Contributions, issues, and feature requests are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## Author

**Sk Md Jeesan**
- GitHub: [@skmdJeesan](https://github.com/skmdJeesan)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with dedication 🛒</sub>
</div>
