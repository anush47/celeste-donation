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

## Cloud Deployment Guide

### 1. Build and Push Docker Image
First, build your container image using Cloud Build. This uses the `cloudbuild.yaml` configuration.

```bash
gcloud builds submit --config cloudbuild.yaml
```

### 2. Database Migration Job
Create a Cloud Run Job to push the Prisma schema to your Cloud SQL database.

```bash
gcloud run jobs create celecte-donation-db-migrate \
  --image gcr.io/celeste-470811/celeste-donation:latest \
  --region asia-south1 \
  --memory 2Gi \
  --cpu 2 \
  --set-cloudsql-instances celeste-470811:asia-south1:sql-primary \
  --set-env-vars DATABASE_URL="YOUR_DATABASE_URL" \
  --command npx \
  --args prisma,db,push
```

**Execute the migration:**
```bash
gcloud run jobs execute celecte-donation-db-migrate --region asia-south1
```

### 3. Admin User Creation Job
Create a Cloud Run Job to seed the initial admin user.

```bash
gcloud run jobs create celeste-donation-create-admin \
  --image gcr.io/celeste-470811/celeste-donation:latest \
  --region asia-south1 \
  --memory 2Gi \
  --cpu 2 \
  --set-cloudsql-instances celeste-470811:asia-south1:sql-primary \
  --set-env-vars DATABASE_URL="YOUR_DATABASE_URL",ADMIN_USERNAME="admin",ADMIN_PASSWORD="secure_password" \
  --command npx \
  --args tsx,scripts/create-admin.ts
```

**Execute the admin creation:**
```bash
gcloud run jobs execute celeste-donation-create-admin --region asia-south1
```
