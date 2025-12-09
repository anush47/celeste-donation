# Celeste Donation Platform

## ❤️ Extending a Helping Hand in Crisis

**Celeste Donation Platform** is a dedicated initiative developed in collaboration with the **Red Cross** to provide immediate relief and support to communities in **Sri Lanka** affected by the recent **Ditwah** crisis (Cyclone Fengal and severe floods).

Our mission is to streamline the donation process, ensuring that help reaches those who need it most, effectively and transparently. This platform connects generous donors with on-the-ground relief efforts, facilitating the collection of essential funds and care packages.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root directory and add your database connection string:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/celeste_db?schema=public"
    ```

3.  **Database Setup:**
    Push the schema to your database:
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server:**
    Start the application locally:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Build & Deployment

### Production Build
To create an optimized production build locally:
```bash
npm run build
```

### Docker Build
To build the Docker image for containerized deployment:
```bash
docker build -t celeste-donation .
```

---

## 👮 Admin & Management

The platform includes a secured `/admin` dashboard for managing donations, viewing statistics, and approving help requests.

### Creating an Admin User
To access the admin panel, you need to create an initial administrative user. We have provided a script to handle this easily.

**Run the administration script:**
```bash
# Usage:
npx tsx scripts/create-admin.ts <username> <password>

# Example:
npx tsx scripts/create-admin.ts admin mySecurePassword123
```

Once created, you can log in to the admin dashboard to manage the platform operations.

---

*Built with ❤️ for Sri Lanka.*
