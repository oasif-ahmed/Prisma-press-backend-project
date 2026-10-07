# Prisma Press Backend

A modern, production-ready **blog publishing backend** built with **Express.js, TypeScript, Prisma ORM, and PostgreSQL**. It includes user authentication, role-based access control, post management, comments, premium content gating, and **Stripe-powered subscription billing**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Project Structure](#architecture--project-structure)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Premium Content & Subscriptions (Stripe)](#premium-content--subscriptions-stripe)
- [Error Handling](#error-handling)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Setup (Prisma)](#database-setup-prisma)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)
- [Scripts](#scripts)
- [Technical Notes & Design Decisions](#technical-notes--design-decisions)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Prisma Press** is a backend API for a content publishing platform. It supports free and premium content, role-based access, secure JWT authentication, Stripe-powered subscriptions, and a clean modular architecture.

---

## Features

- **Authentication & Users**: Registration, login with access/refresh tokens (HTTP-only cookies), profile management, account status (ACTIVE/BLOCKED), roles (USER/AUTHOR/ADMIN)
- **Posts**: CRUD operations, search/filter/sort/pagination, view tracking with transactions, post status (DRAFT/PUBLISHED/ARCHIVED), premium posts
- **Comments**: Create comments, get approved comments by post, moderation (APPROVED/REJECT), ownership/admin checks, cascade deletes
- **Subscriptions**: Stripe Checkout for yearly subscriptions, webhook handling for subscription lifecycle, subscription status tracking
- **Premium Content**: Premium post gating via middleware, access to all premium posts for active subscribers
- **Security**: Bcrypt password hashing, JWT auth with RBAC, global error handling, standardized responses

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5 + TypeScript
- **ORM**: Prisma ORM v7 (split schema, PostgreSQL adapter)
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (JWT)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Security**: bcryptjs
- **Dev Tools**: tsx, TypeScript
- **API Testing**: Postman & Hoppscotch collections included

---

## Architecture & Project Structure

```text
src/
├── app.ts                     # Express app setup & middleware
├── server.ts                  # Server bootstrap
├── config/                   # Environment configuration
├── lib/                      # Prisma & Stripe clients
├── middleware/               # Auth, RBAC, premium guard, error handlers
├── modules/                  # Feature modules (Auth, user, Posts, Commnets, Subscription, Premium)
└── utils/                    # Helpers (catchAsync, sendResponse, jwt, etc.)
```

Prisma schema is split in `prisma/schema/`. Generated client outputs to `generated/prisma/`.

---

## Database Schema

Models: User (1:1 Profile, 1:1 Subscription, 1:N Posts/Comments), Profile, Post (has `isPremium`, view counter), Comment (status APPROVED/REJECT), Subscription (links to Stripe IDs). Enums for roles, statuses.

---

## Authentication & Authorization

- JWT access/refresh tokens stored in HTTP-only cookies
- `auth()` middleware validates token, checks user exists/not blocked, enforces allowed roles
- RBAC supports multiple roles per route

---

## API Endpoints

Key endpoints:
- `POST /api/users/register`, `GET/PUT /api/users/me`, `/my-profile`
- `POST /api/auth/login`, `POST /api/auth/refresh-token`
- `POST/GET/PATCH/DELETE /api/posts/*` (search/filter/sort/paginate; premium posts excluded from public get-by-id)
- `POST /api/comments/v1`, `GET /api/comments/post/:postId` (approved only), moderation/admin routes
- `POST /api/subscription/checkout`, `POST /api/subscription/webhook` (raw body), `GET /api/subscription/status`
- `GET /api/premium/posts` (requires active subscription)

---

## Premium Content & Subscriptions (Stripe)

- Checkout creates/reuses Stripe customer, returns payment URL
- Webhooks sync subscription state from Stripe events (`checkout.session.completed`, `subscription.updated`, `subscription.deleted`)
- `premiumGurd()` middleware validates active subscription with valid `currentPeriodEnd`
- Webhook route registered before JSON parser to preserve raw body for signature verification

---

## Setup & Installation

1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill values
4. Set up PostgreSQL database
5. `npx prisma migrate deploy` (or `npx prisma migrate dev`)
6. `npx prisma generate`
7. `npm run dev`

---

## Environment Variables

```env
PORT=3000
APP_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/prisma_press"
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRODUCT_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## Running the Application

- Development: `npm run dev`
- Production: `npm start` (requires build)
- Stripe webhooks locally: `npm run stripe/webhook`

---

## Testing the API

Postman and Hoppscotch collections included. Auth uses HTTP-only cookies - enable cookie sending in your client.

---

## Scripts

- `dev`: tsx watch
- `start`: node dist/server.js
- `stripe/webhook`: forward Stripe webhooks to local endpoint
- `test`: placeholder

---

## Technical Notes

- Split Prisma schema for modularity
- Atomic view increment via Prisma transaction
- Premium gating on both creation and reading
- Raw body preserved for Stripe webhook signature verification
- Prisma-aware global error handling with consistent responses

---

## License

ISC License
