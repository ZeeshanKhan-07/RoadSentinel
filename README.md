## RoadSentinel- AI Traffic Violation Reporting System

RoadSentinel is a crowdsourced traffic rule enforcement and reward platform designed to promote road safety. It empowers responsible citizens to act as community watchdogs — reporting infractions like red-light jumping or reckless driving when traffic police aren't physically present. The platform incentivizes civic participation by rewarding users with monetary credits for valid reports, which can be redeemed for road safety gear and vehicle maintenance products.

## Application Preview

Images will be here.

---

🌐 **Live Demo**  
Frontend: https://roadsentinel.vercel.app


This project was built to understand real-world full-stack system design combined with computer vision, including secure JWT-driven role-based authentication, asynchronous AI microservice integration, and end-to-end incident lifecycle management. It features a robust Spring Boot backend handling business logic, complaint workflows, and rewards, paired with a dedicated FastAPI microservice running YOLOv11 and PaddleOCR for automated number plate detection and recognition.

---
 
## 🚦 Complete End-to-End Workflow
 
1. **Evidence Capture & Upload** — A citizen witnesses a traffic violation, captures a photo of the offending vehicle, and uploads it as evidence through the web portal.
2. **Automated Number Plate Extraction (AI Pipeline)** — The backend triggers the FastAPI service powered by **YOLOv11** to detect and crop the vehicle's number plate, then **PaddleOCR** reads the text from the cropped image.
3. **User Review & Editing** — The extracted number plate is auto-populated into the report form; users can manually correct any AI misreads before proceeding.
4. **Incident Details & Submission** — The user fills in location, timestamp, and violation description, then submits the challan request.
5. **Officer Review & Challan Issuance** — Traffic police access the Officers Panel to review complaints and evidence, and approve valid ones to officially issue a challan.
6. **Reward & Redemption System** — Approved complaints credit the reporting citizen with a cash reward (e.g. ₹15, ₹20, ₹30), trackable on the User Dashboard and redeemable for road safety gear (helmets, reflective vests, goggles) or vehicle essentials (fuel, engine oil, tires).
---

## 🚀 Features

### 👤 For Citizens (User Panel)
- Upload violation evidence with AI-assisted number plate extraction
- Manual correction of AI-misread plate numbers
- Track complaint status and reward balance on a dashboard
- Redeem earned credits in an in-app product store
### 👮 For Officers (Officers Panel)
- Review submitted complaints and evidence
- Approve or reject reports
- Issue challans and assign rewards to valid reports
### 🛒 For Admins (Product Admin Panel)
- Manage road safety gear and vehicle product inventory
- Handle order fulfillment for reward redemptions

---

## 🧠 Key Engineering Highlights
 
- Designed a **microservice architecture** separating core business logic (Spring Boot) from the AI vision pipeline (FastAPI), communicating asynchronously
- Built an automated **number plate detection & OCR pipeline** using **YOLOv11** for detection/cropping and **PaddleOCR** for text extraction
- Implemented **role-based access control** across three distinct panels (User, Officer, Product Admin) using **Spring Security & JWT**
- Modeled a full **incident lifecycle**: report submission → officer review → challan issuance → reward crediting → redemption
- Followed a modular backend architecture leveraging **Java, Spring Boot**, and **Python, FastAPI** for clean extensibility across services

---

## 🛠 Tech Stack
 
### Core Backend
- **Framework & Security:** Spring Boot, Spring Security
- **Persistence:** Hibernate JPA
- **Authentication & Authorization:** JWT (JSON Web Tokens), OAuth
- **Email Services:** Java Mail Sender (OTP verification for admin login & user signup)
- **Build Tools & Utilities:** Lombok, Maven/Gradle
### AI Vision Microservice
- **Framework:** FastAPI
- **Computer Vision:** YOLOv11 (number plate detection), OpenCV
- **OCR:** PaddleOCR (plate text recognition)
### Frontend
- **Core Library:** ReactJS
- **Styling & Animations:** Tailwind CSS, GSAP (for animations)
- **State Management:** Zustand (persists user state to local storage)
### Tools & DevOps
- **API Testing:** Postman
- **Version Control:** Git, GitHub

---


## 🔧 Installation
 
1. **Clone the repository**
```bash
   git clone https://github.com/ZeeshanKhan-07/RoadSentinel.git
```
 
2. **Frontend Setup (React + Tailwind CSS + GSAP)**
```bash
   cd roadsentinel_frontend
   npm run dev
```

3. **Backend Setup (Spring Boot & Security)**
```bash
   cd roadsentinel_backend-api
   Run the main application file via your IDE or wrapper.
```
 
4. **AI Vision Microservice Setup (FastAPI)**
```bash
   cd Vehicle-Plate-Detection
   pip install -r requirements.txt
   uvicorn main:app --reload
```


## 📁 Project Structure

```
Roadsentinel/
├── roadsentinel_backend-api/                 # Spring Boot REST API backend service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/roadsentinel/roadsentinel_backend_api/  # Core application source code
│   │   │   │   ├── config/                   # Security, database, and app configuration classes
│   │   │   │   ├── controllers/              # REST API endpoint controllers
│   │   │   │   │   ├── Officer/              # Traffic officer-specific controllers
│   │   │   │   │   └── ProductAdmin/         # Store administration controllers
│   │   │   │   ├── dtos/                     # Data Transfer Objects for requests and responses
│   │   │   │   │   ├── ComplaintsOfficer/    # DTOs for officer reporting and metrics
│   │   │   │   │   └── order/                # Order processing and address DTOs
│   │   │   │   ├── entities/                 # JPA database models and entities
│   │   │   │   ├── enums/                    # System enumeration classes (roles, categories)
│   │   │   │   ├── exceptions/               # Global exception handlers and error classes
│   │   │   │   ├── helpers/                  # Application helper and utility classes
│   │   │   │   ├── mapper/                   # Object mapping utilities
│   │   │   │   ├── repositories/             # Spring Data JPA persistence interfaces
│   │   │   │   │   └── projections/          # Custom database query projections
│   │   │   │   ├── security/                 # JWT authentication, filters, and OAuth2 handlers
│   │   │   │   └── services/                 # Business logic service layer interfaces
│   │   │   │       └── impl/                 # Concrete service implementations
│   │   │   └── resources/                    # YAML configuration files (dev, QA, prod)
│   │   └── test/                             # Backend unit and integration test files
│   └── .mvn/                                 # Maven wrapper utilities
├── roadsentinel_frontend/                    # React (Vite & Tailwind CSS & GSAP) frontend application
│   └── src/
│       ├── api/                              # Axios network client configurations
│       ├── assets/                           # Custom fonts and static resources
│       ├── auth/                             # Authentication state stores and handlers
│       ├── components/                       # Modular UI components
│       │   ├── complaints/                   # Grievance cards and lightbox viewers
│       │   ├── ComplaintsForm/               # Multi-step violation reporting wizard
│       │   ├── Navbar/                       # Navigation components
│       │   ├── Officer/                      # Traffic officer dashboard UI elements
│       │   ├── ProductAdmin/                 # Store administration components
│       │   ├── sections/                     # Landing page sections (Hero, About, Reviews, Footer)
│       │   └── UserDashboard/                # User profile and stats dashboard tiles
│       ├── config/                           # Frontend application configuration files
│       ├── constants/                        # Global options and static constants
│       ├── data/                             # Static mock datasets and step configurations
│       ├── hooks/                            # Custom React hooks (geolocation, animations)
│       ├── layout/                           # Layout wrappers
│       ├── pages/                            # Main view entry points for users and admins
│       ├── routes/                           # Protected and role-based route wrappers
│       └── services/                         # API service modules for backend communication
│           ├── Officer/                      # Officer service hooks
│           └── ProductAdmin/                 # Product admin service integrations
└── Vehicle-Plate-Detection/                  # Python based computer vision and license plate recognition module
```

## 🔐 Authentication & Authorization

- **Role-Based Access:** Separate access levels for Citizens, Officers, and Product Admins.
- Authentication is handled through JWT tokens issued at login and validated on every protected request.

## 📊 API Endpoints

### Authentication & Admin Access
- `POST /api/v1/auth/register` - Registers a new user account with a name, email, and password.
- `POST /api/v1/auth/login` - Authenticates a user using email and password, returning a JWT access token.
- `POST /admin/auth/login` - Authenticates an administrator via email and password, initiating an OTP workflow.
- `POST /admin/auth/verify-login` - Verifies the administrator's login OTP code to issue secure admin access.

### User & Profile Management
- `GET /users/me` - Retrieves the profile details of the currently authenticated user.
- `GET /api/v1/users/checkUserAccess` - Validates current user authorization access and assigned roles.
- `GET /api/wallet/balance` - Fetches the current reward/wallet balance for the authenticated user.
- `POST /api/wallet/balance` - Alternative query method to check the wallet balance specifying a user ID.

### Complaints & Grievances
- `POST /complaint/register` - Submits a new traffic violation complaint with vehicle details, description, location, and media evidence.
- `GET /complaint/{userId}/complaints` - Retrieves all complaints filed by a specific user.
- `GET /complaint/{userId}/totalComplaints` - Fetches the total count of complaints filed by a specific user.
- `GET /api/admin/officer/admin/dashboard-summary` - Retrieves summary metrics for the traffic officer dashboard
- `GET /api/admin/officer/{complaintId}/user` - Fetches user details associated with a specific complaint ID
- `PATCH /api/admin/officer/{complaintId}/status` - Updates the status of a specific complaint (e.g., APPROVED)
- `PATCH /api/admin/officer/{complaintId}/reward` - Assigns or updates the reward monetary amount for a verified violation report

### Store & Products
- `GET /api/products/allProducts` - Retrieves the complete catalog of available store items for users.
- `POST /api/products/addProduct` - Adds a new product to the store inventory with images, pricing, and category specs.
- `PUT /api/admin/product/{productId}` - Updates product information and details (such as price adjustments) by an administrator.

### Orders & Logistics
- `POST /api/order/placeOrder` - Places a new product store order with items, quantities, and delivery shipping address.
- `GET /api/admin/product/orders/all` - Retrieves a complete list of customer store orders for administrative review.
- `PATCH /api/admin/product/orders/{orderId}/status` - Updates fulfillment status for a store order (e.g., set to DELIVERED)[cite: 1].

### Product Administration & Analytics
- `GET /api/admin/product/dashboard-metrics` - Retrieves high-level business metrics for the product admin dashboard.
- `GET /api/admin/product/charts/bar-metrics` - Fetches bar chart datasets for visualization of store analytics.
- `GET /api/admin/product/charts/circular-metrics` - Fetches distribution data for circular chart analytics.

### Media & Computer Vision Services
- `POST /api/upload/imageUpload` - Uploads an image file to Cloudinary cloud storage and returns the secure URL.
- `POST http://127.0.0.1:8000/api/v1/extract-plate` - Sends an uploaded vehicle image to the Python CV microservice to extract the license plate text.

## 📞 Contact 

- To contact, email **zeeshankhanbca26@gmail.com**.
