## RoadSentinel- AI Traffic Violation Reporting System

RoadSentinel is a community-driven platform that makes city roads safer by allowing everyday citizens to report traffic violations—like red-light jumping or reckless driving—when traffic police aren't around. When users submit valid reports with photo evidence, they earn cash rewards. These rewards can then be used in the app's store to buy road safety gear or vehicle maintenance essentials like helmets, vests, and engine oil.

## Application Preview

Images will be here.

---

🌐 **Live Demo**  
Frontend: https://roadsentinel.vercel.app


This project was built to understand real-world full-stack system design combined with computer vision, including secure JWT-driven role-based authentication, asynchronous AI microservice integration, and end-to-end incident lifecycle management. It features a robust Spring Boot backend handling business logic, complaint workflows, and rewards, paired with a dedicated FastAPI microservice running YOLOv11 and PaddleOCR for automated number plate detection and recognition.

---
  
## 🚦 How It Works (End-to-End Workflow)

1. **Capture & Upload** — You see a traffic violation, take a photo of the vehicle, and upload it through the app.
2. **AI Plate Detection** — The system uses a Python AI tool (**YOLOv11** and **PaddleOCR**) to automatically find and read the vehicle's license plate number from the photo.
3. **Review & Edit** — The recognized license plate number automatically fills into the form. You can double-check it and manually fix any errors if needed.
4. **Submit Report** — Add the location, time, and description, then submit your report.
5. **Police Verification** — Traffic officers review the submitted complaint and evidence. If it is valid, they approve it and issue a formal ticket (challan).
6. **Earn & Redeem** — Once approved, you receive a cash reward (e.g., ₹15, ₹20, ₹30) credited to your wallet dashboard, which you can spend on safety gear or vehicle products in the store.

## 🚀 Features

### 👤 For Citizens (User Panel)
- Upload violation photos with automated AI license plate reading
- Manually correct any mistakes made by the AI
- Track your submitted reports and wallet reward balance
- Spend your earnings in the built-in product store

### 👮 For Officers (Officer Panel)
- Review incoming citizen reports and attached photo proof
- Approve or reject individual complaints
- Issue challans and assign cash rewards for valid reports

### 🛒 For Admins (Product Admin Panel)
- Manage the store inventory (safety gear and vehicle products)
- Track and fulfill customer product orders

---

## 🧠 Key Engineering Highlights

- **Microservice Architecture** — Separates the core Java backend from the Python AI vision service so they run independently.
- **Automated License Plate Reader** — Uses **YOLOv11** to detect vehicle plates and **PaddleOCR** to read the text characters.
- **Secure Access Control** — Protects user, officer, and admin panels using **Spring Security & JWT tokens**.
- **Complete Lifecycle Management** — Handles everything from initial report submission and police review to reward payouts and store purchases.

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
