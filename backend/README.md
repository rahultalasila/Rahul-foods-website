# Backend — Supabase

Rahul Foods uses [Supabase](https://supabase.com) as its backend (auth + database). No custom server is needed.

## Project

- **URL:** `https://nfwdwzqzygbvxysnkmwq.supabase.co`
- **Dashboard:** https://app.supabase.com/project/nfwdwzqzygbvxysnkmwq

## Database Tables

### `orders`
Stores every placed order.

| Column       | Type      | Notes                          |
|--------------|-----------|-------------------------------|
| id           | uuid (PK) | auto-generated                |
| user_id      | uuid      | references auth.users          |
| items        | jsonb     | array of `{name, qty, price}` |
| total        | numeric   | order total in ₹              |
| pay_label    | text      | e.g. "Cash on Delivery"       |
| address      | text      | delivery address               |
| status       | text      | "placed" → "delivered"        |
| created_at   | timestamptz | auto                         |

### `menu_items`
Admin-managed dishes that appear in the menu alongside the static `menuData`.

| Column      | Type    | Notes                        |
|-------------|---------|------------------------------|
| id          | uuid    | auto-generated               |
| name        | text    | dish name                    |
| category    | text    | matches menuData categories  |
| description | text    | short description            |
| price       | numeric | price in ₹                  |
| image_url   | text    | optional external image URL  |
| tag         | text    | e.g. "Chef's Pick"           |
| is_veg      | boolean |                              |
| active      | boolean | hide/show without deleting   |
| created_at  | timestamptz | auto                     |

### `reviews`
Per-dish user reviews.

| Column     | Type        | Notes               |
|------------|-------------|---------------------|
| id         | uuid        | auto-generated      |
| dish_name  | text        |                     |
| user_name  | text        |                     |
| rating     | int2        | 1–5                 |
| body       | text        | review text         |
| created_at | timestamptz | auto                |

## Authentication

Supabase Email/Password auth is used. The client is initialised in `frontend/utils/supabase.js`.

The admin account is identified by email: `rahultalasila9@gmail.com` (checked client-side in `AdminPage`).

## Row Level Security

Enable RLS on all tables. Suggested policies:

- **orders**: users can `INSERT` and `SELECT` their own rows (`user_id = auth.uid()`). Service role bypasses RLS for the admin dashboard.
- **menu_items**: public `SELECT` (for active items). Admin-only `INSERT/UPDATE/DELETE`.
- **reviews**: public `SELECT`. Authenticated `INSERT`.
