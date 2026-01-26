# 🎉 Eventify

<div align="center">

**A modern, feature-rich event management platform built with Next.js**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-e10098?style=for-the-badge&logo=graphql)](https://www.apollographql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Internationalization](#-internationalization)
- [Docker Deployment](#-docker-deployment)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

Eventify is a comprehensive event management platform that enables users to discover, create, and manage events. The platform supports event organizers, groups, user profiles, and includes a powerful admin panel for content management.

### Key Capabilities

- 🎪 **Event Discovery** - Browse and search events by category, date, and location
- 👥 **Group Management** - Create and join groups with moderation features
- 🎫 **Ticket Management** - Handle event tickets and bookings
- 👤 **User Profiles** - Comprehensive user profiles with followers, followings, and activity tracking
- 🏢 **Organizer Profiles** - Dedicated pages for event organizers
- 🔐 **Admin Panel** - Full administrative control over events, groups, and users
- 🌍 **Multi-language** - Support for English, Korean, Russian, and Uzbek

---

## ✨ Features

### For Users

- 🔍 Advanced event search and filtering
- 📅 Calendar view for upcoming events
- 💬 Comments and interactions on events
- ❤️ Like and follow functionality
- 🎟️ Ticket purchasing and management
- 📱 Responsive design for all devices
- 🌙 Dark mode support

### For Organizers

- ➕ Create and manage events
- 📊 Event analytics and insights
- 👥 Group creation and moderation
- 🎨 Custom event pages with rich media
- 📍 Location-based event management

### For Administrators

- 🛡️ Complete admin dashboard
- 📝 Content moderation
- 👤 User management
- 📈 Analytics and reporting
- ⚙️ System configuration

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5.0** - Type safety

### Data & State Management

- **Apollo Client 4.0** - GraphQL client
- **GraphQL** - API query language

### Styling & UI

- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Animate.css** - Animation library

### Internationalization

- **next-i18next** - i18n for Next.js
- **react-i18next** - React i18n framework
- **i18next** - Internationalization framework

### Additional Libraries

- **date-fns** - Date utility library
- **react-cropper** - Image cropping
- **browser-image-compression** - Image optimization
- **react-markdown** - Markdown rendering
- **sonner** - Toast notifications
- **next-themes** - Theme management

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (recommended) or npm/yarn
- **Docker** (optional, for containerized deployment)

---

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_APP_API_URL=your_api_url
   NEXT_PUBLIC_API_GRAPHQL_URL=your_graphql_url
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

| Variable                      | Description          | Required |
| ----------------------------- | -------------------- | -------- |
| `NEXT_APP_API_URL`            | Backend API URL      | Yes      |
| `NEXT_PUBLIC_API_GRAPHQL_URL` | GraphQL endpoint URL | Yes      |

### Image Configuration

The application is configured to accept images from:

- Local development server
- Production domains (eventify.azbek.me)
- External event sources (Meetup, Luma, Eventbrite)
- AWS S3 and CloudFront

---

## 💻 Usage

### Development Mode

```bash
pnpm dev
```

Starts the development server with hot-reload enabled.

### Production Build

```bash
pnpm build
pnpm start
```

Creates an optimized production build and starts the server.

### Linting

```bash
pnpm lint
```

Runs ESLint to check code quality.

---

## 📁 Project Structure

```
frontend/
├── apollo/                 # GraphQL client configuration
│   ├── admin/             # Admin mutations & queries
│   ├── user/              # User mutations & queries
│   └── store.ts           # Apollo store setup
├── libs/                   # Core libraries and utilities
│   ├── components/        # React components
│   │   ├── admin/        # Admin panel components
│   │   ├── common/       # Shared components
│   │   ├── events/       # Event-related components
│   │   ├── group/        # Group components
│   │   ├── homepage/     # Homepage components
│   │   ├── layout/       # Layout components
│   │   ├── organizer/    # Organizer components
│   │   ├── profile/      # Profile components
│   │   └── ui/           # UI primitives (shadcn/ui)
│   ├── enums/            # TypeScript enums
│   ├── i18n/             # Internationalization setup
│   ├── types/            # TypeScript type definitions
│   ├── auth/             # Authentication utilities
│   ├── config.ts          # App configuration
│   ├── utils.ts           # Utility functions
│   └── upload.ts          # File upload utilities
├── public/                # Static assets
│   ├── images/           # Image assets
│   └── locales/          # Translation files
│       ├── en/           # English translations
│       ├── ko/           # Korean translations
│       ├── ru/           # Russian translations
│       └── uz/           # Uzbek translations
├── src/                   # Source code
│   └── app/              # Next.js App Router pages
│       ├── admin/        # Admin pages
│       ├── auth/         # Authentication pages
│       ├── events/       # Event pages
│       ├── groups/       # Group pages
│       ├── organizers/   # Organizer pages
│       ├── profile/      # Profile pages
│       ├── layout.tsx    # Root layout
│       ├── page.tsx      # Homepage
│       └── providers.tsx # Context providers
├── docker-compose.yml     # Docker configuration
├── next.config.ts         # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

---

## 🌍 Internationalization

Eventify supports multiple languages out of the box:

- 🇺🇸 **English** (en)
- 🇰🇷 **Korean** (ko)
- 🇷🇺 **Russian** (ru)
- 🇺🇿 **Uzbek** (uz)

Translation files are located in `public/locales/`. To add a new language:

1. Create a new directory in `public/locales/`
2. Copy translation files from an existing language
3. Update `next-i18next.config.js` to include the new language

---

## 🐳 Docker Deployment

### Production Deployment

1. **Build and run with Docker Compose**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **The application will be available at**
   ```
   http://localhost:4000
   ```

### Development Deployment

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**The development application will be available at**

```
http://localhost:4020
```

### Manual Docker Build

```bash
docker build -t eventify-frontend .
docker run -p 4000:3000 eventify-frontend
```

---

## 📜 Scripts

| Script      | Description              |
| ----------- | ------------------------ |
| `npm dev`   | Start development server |
| `npm build` | Create production build  |
| `npm start` | Start production server  |
| `npm lint`  | Run ESLint               |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- All contributors and open-source libraries used in this project

---

<div align="center">

**Made with ❤️ using Next.js and React**

⭐ Star this repo if you find it helpful!

</div>
