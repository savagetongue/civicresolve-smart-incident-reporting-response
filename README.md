# CivicResolve: Smart Incident Reporting & Response

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/savagetongue/civicresolve-smart-incident-reporting-response)

CivicResolve is a modern, citizen-centric platform designed to bridge the gap between the public and local authorities. It empowers individuals to report public incidents—such as potholes, broken streetlights, or public safety concerns—through a simple, intuitive web interface. Each report can include a title, detailed description, category, photos, and precise location data. Upon submission, the system generates a unique trackable ID and notifies the relevant authorities. Authorities are equipped with a powerful dashboard to view, manage, assign, and resolve these incidents. The platform maintains a complete, immutable audit trail for every action and status change, ensuring transparency and accountability.

## Key Features

-   **Citizen Incident Reporting**: Simple, intuitive form for submitting incidents with details, photos, and location.
-   **Authority Dashboard**: A comprehensive interface for authorities to manage, track, and resolve incidents.
-   **Transparent Workflow**: Public-facing incident pages with a complete timeline of status updates and official responses.
-   **Interactive Map View**: Visualize incidents geographically to understand hotspots and patterns.
-   **Advanced Search & Filtering**: Easily find incidents by status, category, date, or location.
-   **Analytics & Insights**: A dedicated dashboard for authorities to view key metrics like resolution times and report volumes.
-   **Secure & Scalable**: Built on a modern, serverless architecture using Cloudflare Workers for high performance and reliability.
-   **Accountability**: Immutable audit logs for every status change and official action.

## Technology Stack

-   **Frontend**: React, Vite, React Router, Tailwind CSS
-   **UI Components**: shadcn/ui, Framer Motion, Lucide Icons
-   **State Management**: Zustand
-   **Backend**: Hono on Cloudflare Workers
-   **Storage**: Cloudflare Durable Objects
-   **Language**: TypeScript
-   **Validation**: Zod
-   **Forms**: React Hook Form

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes and Durable Object entity definitions.
-   `shared/`: Contains shared TypeScript types used by both the frontend and backend to ensure type safety across the stack.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform. You'll need to be logged in (`wrangler login`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/civic-resolve.git
    cd civic-resolve
    ```

2.  **Install dependencies:**
    The project uses Bun for package management.
    ```bash
    bun install
    ```

### Running the Development Server

To start the development server, which includes both the Vite frontend and the Wrangler backend, run:

```bash
bun dev
```

The application will be available at `http://localhost:3000` (or the next available port). The frontend will automatically proxy API requests to the local Wrangler server.

## Development

-   **Frontend Development**: All frontend code is located in the `src` directory. Changes will trigger a hot-reload in the browser.
-   **Backend Development**: API endpoints are defined in `worker/user-routes.ts` using the Hono framework. The backend logic interacts with Cloudflare Durable Objects via the entity patterns defined in `worker/entities.ts`.
-   **Shared Types**: To maintain consistency, define any data structures shared between the client and server in `shared/types.ts`.

## Deployment

This project is designed for seamless deployment to Cloudflare.

1.  **Build the application:**
    This command bundles the frontend and backend assets for production.
    ```bash
    bun build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy command using Wrangler. This will publish your worker and static assets to your Cloudflare account.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/savagetongue/civicresolve-smart-incident-reporting-response)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.