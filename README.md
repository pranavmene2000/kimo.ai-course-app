# Course Application Setup

This README provides instructions for setting up the course application locally and using Docker with Docker Compose.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (for the frontend)
- **Python 3.9+** (for the backend)
- **Docker** and **Docker Compose** (for containerization)

## 1. Local Setup

### Frontend (React with Vite)

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. The frontend should now be running on `http://localhost:5173`.

### Backend (FastAPI)

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:

    - **Windows:**
      ```bash
      venv\Scripts\activate
      ```
    - **macOS/Linux:**
      ```bash
      source venv/bin/activate
      ```

4. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

5. (Optional) Create a `.env` file in the backend directory with the necessary environment variables. Example:
    ```
    DATABASE_URL=mongodb://localhost:27017
    ```

    > **Note:** If you do not want to include environment variables in `.env` file, the application will default to using a MongoDB Atlas URL that is pre-configured for testing purposes.

6. Start the FastAPI server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

7. The backend should now be running on `http://localhost:8000`.

## 2. Spin Docker Container with Docker Compose

### Setup with Docker Compose

1. Ensure Docker is running on your machine.

2. Navigate to the root directory of the project (where the `docker-compose.yml` file is located).

3. Build and start the containers:
    ```bash
    docker-compose up --build
    ```

4. The application should now be accessible:

    - **Frontend:** `http://localhost:3000`
    - **Backend:** `http://localhost:8000`

### Common Docker Commands

- **Stop Containers:**
    ```bash
    docker-compose down
    ```

- **Rebuild Containers:**
    ```bash
    docker-compose up --build
    ```

- **View Logs:**
    ```bash
    docker-compose logs -f
    ```

## Conclusion

You should now have the application running either locally or in Docker containers. If you encounter any issues, please check the logs for errors or refer to the documentation.
