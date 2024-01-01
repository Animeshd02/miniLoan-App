This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Mini Loan App

Welcome to the Mini Loan App! This application allows users to manage loan applications, approvals, and repayments.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Creating a Loan](#creating-a-loan)
  - [Loan Dashboard](#loan-dashboard)
  - [Loan Applications (Admin)](#loan-applications-admin)

## Features

- User authentication
- Loan application creation
- Visibility of all loans and loan EMI's as per terms.
- Loan approval workflow
- Repayment tracking
- Admin dashboard for loan approval
- Real-time updates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prerequisites

Before running the app, make sure you have the following installed locally:

- [Node.js](https://nodejs.org/) : Make sure you have Node.js installed locally.
- Next.js: Since it is a Next.js app you must know how to create a next app.
- TailwindCSS: make sure you install tailwind while creating next app. 
- [Firebase](https://firebase.google.com/): install it using "npm install firebase" command on terminal in your project directory

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mini-loan-app.git

2. Or Create you next app by npx create-next-app@latest
   then it will ask you to install dependencies install it by following:
    use TypeScript - Yes
    use ESlint - Yes
    use Tailwind - Yes
    use SRC/Directory - Yes
    use App router - NO
    customize imprt alias - NO.

 ### Usage

1. Run the application: npm run dev
2. Open your browser and go to http://localhost:3000 to view the app.

### Creating a Loan

Log in using your email and password.
Navigate to the "Create Loan" section.
Fill in the loan details and submit the application.
### Loan Dashboard

View your current loans and repayment schedules.
Real-time updates for loan status changes.
### Loan Applications (Admin)

Log in as an admin (Email:"admin@gmail.com", Password: 123456). You can modify admin emails in code base
Approve or reject pending loan applications.
View approved loans and manage repayment statuses.



