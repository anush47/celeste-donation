# Project Documentation

## File Structure

### Root Directory
-   `api/`: Backend API routes (Next.js Route Handlers).
-   `app/`: Frontend application source code (Next.js App Router).
-   `components/`: Reusable UI components and feature-specific logic.
-   `lib/`: Shared utility functions.
-   `public/`: Static assets (images, icons).

### Key Files & Directories

#### `api/`
-   **`packages/route.ts`**:
    -   **Method**: `GET`
    -   **Purpose**: Returns a list of predefined donation packages (e.g., "Family Food Kit").
-   **`requests/route.ts`**:
    -   **Method**: `GET`
    -   **Purpose**: Returns a list of help requests from those in need.
    -   **Query Params**: `?approved=true` (optional) - Filters for approved requests only.

#### `app/`
-   **`page.tsx`**: The main entry point and landing page. Orchestrates the primary user flow using a tabbed interface for:
    -   Cash Donations
    -   Package Donations
    -   Help Requests
-   **`layout.tsx`**: The root layout file, defining the global HTML structure and fonts.
-   **`globals.css`**: Global styles and Tailwind CSS configuration.

#### `components/`
-   **`ui/`**: Contains reusable, unstyled UI primitives (built with Radix UI).
-   **`cash-donation-tab.tsx`**: Component for handling monetary donations.
-   **`package-donation-tab.tsx`**: Component for selecting and donating specific relief packages.
-   **`request-help-tab.tsx`**: Component for users to submit help requests.
-   **`donation-counter.tsx`**: Displays the total donation amount and donor count.

## Technologies

-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **UI Library**: React 19
-   **Styling**: Tailwind CSS 4
-   **Components**: Radix UI (Headless primitives)
-   **Icons**: Lucide React
-   **Validation**: Zod
-   **Forms**: React Hook Form
-   **Charts**: Recharts
-   **Date Handling**: date-fns

## API Endpoints

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/packages` | `GET` | Retrieve available donation packages. | None |
| `/api/requests` | `GET` | Retrieve help requests. | `approved` (boolean, optional) |
