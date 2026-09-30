# INIYO Experience Store

Full-stack INIYO MVP: React + Vite frontend and Java 17 + Spring Boot backend.

## Current frontend
- Mobile-first premium ecommerce UI
- No “Art of Sweet Moments” tagline on the website
- Realistic couple lifestyle hero image
- Couple experience box at ₹799
- Product image carousel with thumbnails
- Quick Add to Bag and mobile sticky CTA
- Detailed “How the experience flows” section
- Siblings — Coming Soon section
- Cart and order flow
- Email/password login and signup
- Google OAuth button UI placeholder (real Google OAuth requires your Google OAuth credentials and backend callback configuration)

## Backend
- Spring Boot 3.3.5
- Java 17
- Spring Data JPA
- H2 database for local development
- Spring Security + JWT for email/password authentication
- Product API
- Order API
- Seeded INIYO Couple Experience Box at ₹799

## Run backend
```bash
cd backend
mvn clean package
java -jar target/iniyo-store-1.0.jar
```

Or during development:
```bash
mvn spring-boot:run
```

Backend: http://localhost:8080

## Run frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Important
The frontend currently shows a Google sign-in option, but Google OAuth is not activated until a Google OAuth client is created and the backend callback/security configuration is added. Do not use the placeholder JWT secret in production.

For production, use MySQL/PostgreSQL, environment variables for secrets, a real UPI payment gateway, verified Google OAuth/OIDC, shipping integration, address/order DTOs, admin APIs, image storage, HTTPS and stronger security controls.
