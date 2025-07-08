# SL Radio Middle East

A simple, clean, and modern web-based radio player for listening to SL Radio Middle East, built with Next.js and Firebase Studio.

## Features

- **Live Radio Stream:** Play and pause the live audio stream.
- **Power Toggle:** Turn the stream connection on or off.
- **Volume Control:** Adjust the playback volume with a slider.
- **Live News Bar:** Displays the latest updates directly from the news source.
- **Contact Button:** Easily get in touch via WhatsApp.
- **Responsive Design:** Works beautifully on desktop and mobile devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Deployment:** [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is configured for easy deployment with Firebase Hosting.

1.  **Install the Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Deploy the app:**
    ```bash
    npm run deploy
    ```

## Troubleshooting

### "Site Not Found" after deploying

If you see a "Site Not Found" page after a successful deployment, it is often due to caching. Please try the following:

- **Hard Refresh:** Clear your browser's cache for the site. (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows).
- **Incognito Window:** Open your site URL in a private or incognito window.
- **Wait:** It can sometimes take a few minutes for a new deployment to be available everywhere.
