# Directory App

A highly SEO-optimized directory web application that allows admins to create and manage custom directories and tools, which are then displayed to visitors. The app dynamically generates a sitemap including all tools and categories, ensuring excellent discoverability by search engines.

## Features

- **SEO Optimized**: Dynamic sitemap generation for all categories and tools.
- **Admin Panel**: Easily create, update, and delete categories and tools.
- **Custom Directories**: Organize tools under custom categories.
- **Rich Tool Descriptions**: Supports Markdown for tool descriptions.
- **Search Functionality**: Quickly find tools or categories.
- **Responsive UI**: Modern, mobile-friendly design.
- **Authentication**: Admin actions are protected.
- **Dockerized**: Easy deployment with Docker Compose.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/PyPranav/directory-app
cd directory-app
```

### 2. Set up your environment variables
- Copy `.env.example` to `.env` and fill in the required values as described above.

### 3. Start with Docker Compose
This will start both the PostgreSQL database and the Next.js app, run migrations, and seed initial data.

```bash
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
AUTH_SECRET=""

POSTGRES_DB=directory-app
POSTGRES_USER=user
POSTGRES_PASSWORD=password

DATABASE_URL="postgresql://user:password@db:5432/directory-app?schema=public"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
AUTH_TRUST_HOST=true # only for dev set to false in prod

NEXT_PUBLIC_BASE_URL="http://localhost:3000" # set domain for prod
```

> **Note:** You can refer to `.env.example`. Make sure to update the values to match your environment.


## Admin Usage
- Visit `/create` to manage categories (add, edit, delete).
- Click on a category to manage tools within it (add, edit, delete tools).
- All admin actions require authentication.

## SEO & Sitemap
- The app automatically generates a sitemap at `/sitemap.xml` including all categories and tools.
- Update `NEXT_PUBLIC_BASE_URL` in your `.env` for correct sitemap URLs in production.