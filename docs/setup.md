# Setup Instructions

## Database Setup

This project uses **Prisma** with **PostgreSQL**.

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` and update the `DATABASE_URL` with your PostgreSQL connection string.
    ```bash
    cp .env.example .env
    ```
    Example `DATABASE_URL`:
    ```
    postgresql://username:password@localhost:5432/celeste_donation?schema=public
    ```

3.  **Initialize Database**:
    Run the following command to push the schema to your database:
    ```bash
    pnpm dlx prisma db push
    ```
    Or if you prefer migrations:
    ```bash
    pnpm dlx prisma migrate dev --name init
    ```

4.  **Generate Prisma Client**:
    ```bash
    pnpm dlx prisma generate
    ```

5.  **Seed Data** (Optional):
    You can create a seed script to populate initial data.

6.  **Create Admin User**:
    Run the following command to create an admin user:
    ```bash
    pnpm dlx tsx scripts/create-admin.ts <username> <password>
    ```
    Example:
    ```bash
    pnpm dlx tsx scripts/create-admin.ts admin password123
    ```

6.  **Create Admin User**:
    Run the following command to create an admin user:
    ```bash
    npx tsx scripts/create-admin.ts <username> <password>
    ```
    Example:
    ```bash
    npx tsx scripts/create-admin.ts admin password123
    ```

## Useful Commands

-   `pnpm dlx prisma studio`: Open Prisma Studio to view and edit data.
-   `pnpm dev`: Run the development server.
