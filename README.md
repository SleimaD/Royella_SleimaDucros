# Royella_SleimaDucros

This hotel management and booking application combines a Django backend with a React frontend to offer a seamless user experience for both customers and hotel administrators. The system allows users to search, filter, and book rooms based on specific criteria such as date, beds, and guest capacity. Administrators can manage room listings, bookings, and customer interactions through an intuitive interface. The application supports dynamic contact forms, automated responses, and integrates MySQL for robust data handling. Designed to enhance operational efficiency and improve customer service, this platform provides a comprehensive solution for modern hotel management.

## Prerequisites

Before you begin, ensure you have installed the following on your system:
- Python 3.x
- pip (Python Package Installer)
- Node.js
- npm (Node Package Manager) or yarn
- MySQL Server


## Installation

### Backend Setup (Django)

1. Clone the repository:  
   `git clone https://github.com/SleimaD/Royella_SleimaDucros.git && cd backend`  

2. Install dependencies:  
   `pip install -r requirements.txt`  
   For macOS users:  
   `pip3 install -r requirements.txt`  

3. Configure environment variables: Create a `.env` file in the root directory of the backend and configure your MySQL database credentials.  
   `python -m venv env && source env/bin/activate`  
   For macOS:  
   `python3 -m venv env && source env/bin/activate`  

4. Install MySQL client:  
   `pip install mysqlclient`  
   For macOS:  
   `pip3 install mysqlclient`  

5. Database Setup: Configure your MySQL database according to the settings in your `.env` file and create the database if it doesn't exist (for example, using DBeaver or MySQL Workbench).

6. Database Migrations: Apply migrations to set up your database schema.  
   `python manage.py makemigrations && python manage.py migrate`  
   For macOS:  
   `python3 manage.py makemigrations && python3 manage.py migrate`  

7. Start the server: Launch your Django application.  
   `python manage.py runserver`  
   For macOS:  
   `python3 manage.py runserver`  

### Frontend Setup (React)

1. Navigate to the frontend directory:  
   `cd frontend`  

2. Install dependencies:  
   `npm install`  

3. Start the application:  
   `npm run dev`  

