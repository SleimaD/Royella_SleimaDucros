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
  
    1. **Clone the repository**
    
       ```bash
       git clone https://github.com/SleimaD/Royella_SleimaDucros.git
       cd backend
       ```
       
    2. **Install dependencies**
       ```bash
       pip install -r requirements.txt
       ```
       for macos users:
       ```bash
       pip3 install -r requirements.txt
       ```
    
    3. **Configure environment variables**
        Create a .env file in the root directory of the backend
       ```bash
         python -m venv env
         source env/Scripts/activate
       ```
       MacOs:
       ```bash
         python3 -m venv env
         source env/bin/activate
       ```
    
    4. **Install Mysql
       ```bash
         pip install mysqlclient
       ```
       MacOs:
       ```bash
         pip3 install mysqlclient
       ```
    
      ** Database Setup **
        Configure your MySQL database according to the settings in your .env file, 
        and create the database if it doesn't exist ( in dbeaver for example ).
    
    
    5. **Database Migrations
    
      Apply migrations to set up your database schema:
      ```bash
        python manage.py makemigrations
        python manage.py migrate
      ```
      MacOs:
       ```bash
        python3 manage.py makemigrations
        python3 manage.py migrate
      ```
    
    6. **Start the server
    
      Launch your Django application:
      ```bash
      python manage.py runserver
      ```
      ```bash
      python3 manage.py runserver
      ```
      
  ### Frontend Setup

     1. **Navigate to the frontend directory
        ```bash
           cd frontend
        ``` 
       
      2. **Install dependencies
        ```bash
          npm install
        ```
  
      3. **Launch the vite app:
        ```bash
          npm run dev
        ```
        
        
           
