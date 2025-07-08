# SL Radio Middle East

A simple, clean, and modern web-based radio player for listening to SL Radio Middle East, built with Next.js and Firebase Studio.

## Features

- **Live Radio Stream:** Play and pause the live audio stream.
- **Power Toggle:** Turn the radio stream connection on or off.
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
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

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

This application is configured for easy deployment with Firebase App Hosting.

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
    firebase deploy --only apphosting
    ```
