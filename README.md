# Patient Registration System

## Overview
A frontend-only patient registration application that uses PGlite for data storage, enabling persistent data storage without a backend server.

![App Screenshot](/public/images/dashboard-preview.png)

## Features

- **Patient Registration:** Capture comprehensive patient information, including personal details, medical metrics, and insurance information
- **Patient Records Management:** View, filter, sort, and paginate patient records
- **Raw SQL Queries:** Execute custom SQL queries to retrieve and analyze patient data
- **Data Persistence**: Patient data is stored locally and persists across page refreshes
- **Cross-Tab Synchronization:** Synchronized data reading and writing across multiple browser tabs

## Tech Stack

- React(vite)
- TypeScript
- Tailwind CSS
- Pglite
- React Router for navigation
- React Hot Toast for notifications
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/litikesh/Patient_Record_Management_System.git
   cd Patient_Record_Management_System
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Database Schema

The application uses the following database schema:

# Patients Table

```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  weight REAL,
  height REAL,
  blood_group TEXT NOT NULL,
  blood_pressure TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
# Medical Records Table

```sql
CREATE TABLE medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER,
  medical_notes TEXT,
  insurance_provider TEXT,
  insurance_id TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### Adding a Patient

1. Navigate to the "Patients" section
2. Fill out the three-step form (Personal, Medical, Insurance)
3. Submit to register a new patient

### Viewing Patient Records

1. Navigate to the "Records" section
2. Search for patients by name
3. Click on a patient to view their details and medical history

### Running Raw SQL Queries

1. Navigate to the "SQL Interface" section
2. Write and execute custom SQL queries
3. Click "Execute Query"
4. View results and download as CSV if needed

## Cross-Tab Synchronization

The application uses the Browser's BroadcastChannel API to synchronize data across tabs:

- When a patient is added in one tab, the changes are automatically reflected in all other open tabs.

## Output

A visual walkthrough of the Patient Registration System:

### 📝 Patient Registration Form

![Patient Form](/public/images/new-patients-preview.png)
*Collect personal details including name, date of birth, and contact information.*

---

### 📋 Patient Records

![Patient Dashboard](/public/images/records-preview.png)
*Search, filter, and manage registered patients in a sortable, paginated view.*

---

### 📄 Detailed Patient View

![Patient Detail View](/public/images/output-patient-detail.png)
*Click any record to view detailed patient info and medical history.*

---

### 💻 SQL Interface

![SQL Query Interface](/public/images/sql-preview.png)
*Run raw SQL queries on the local PGlite database and analyze the results.*

## Deployment

The application is deployed at [https://patient-record-management-system-peach.vercel.app](https://patient-record-management-system-peach.vercel.app)

## Challenges Faced

* Getting started with **PGlite** took a bit of time. It was a new tool for me, and understanding how to set up a local database in the browser without a backend was a learning curve. But once it clicked, it worked really well.

* Figuring out **cross-tab data sync** using the BroadcastChannel API was a bit tricky at first, especially making sure updates didn’t cause conflicts or stale states but it was satisfying to see everything stay in sync across tabs.


## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pglite](https://pglite.dev/)
- [Lucide Icons](https://lucide.dev/)
