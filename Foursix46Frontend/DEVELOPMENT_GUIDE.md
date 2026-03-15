# Development Guide - Foursix46 Courier Application

## Project Structure

This application now uses a clean, page-based routing architecture that's easy to extend and maintain.

### Directory Structure

src/
├── pages/                    # All application pages
│   ├── HomePage.tsx         # Main landing page (/)
│   ├── SendParcelPage.tsx   # Send parcel form (/send-parcel)
│   ├── BecomeDriverPage.tsx # Driver registration (/become-driver)
│   ├── ForBusinessesPage.tsx # Business registration (/for-businesses)
│   ├── ServicesPage.tsx     # Services info (/services)
│   ├── AboutPage.tsx        # About us (/about)
│   ├── ContactPage.tsx      # Contact form (/contact)
│   ├── PrivacyPolicyPage.tsx # Privacy policy (/privacy)
│   ├── TermsPage.tsx        # Terms (/terms)
│   ├── CookiesPage.tsx      # Cookies policy (/cookies)
│   └── NotFound.tsx         # 404 page
├── components/
│   ├── shared/              # Shared components
│   │   └── FormProgress.tsx # Multi-step form progress indicator
│   ├── ui/                  # shadcn UI components
│   └── Navigation.tsx       # Main navigation component
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── App.tsx                  # Main app with routing