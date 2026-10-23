# BloodDonorAppointment Frontend

React single-page application for the `BloodDonorAppointment` Spring Boot service.

## Run locally

1. Start the backend on `http://localhost:8081`.
2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

The frontend is available at `http://localhost:5173`.

## API configuration

The local `.env` file contains the backend URL and is intentionally ignored by
Git. To use another backend URL, update `.env` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8081
```

The dashboard uses these backend endpoints:

- `GET /DisplayAll`
- `POST /Add`
- `PUT /Update/{id}`
- `DELETE /Delete/{id}`

The backend allows requests from the Vite development origin
(`http://localhost:5173`) through its controller CORS configuration.
