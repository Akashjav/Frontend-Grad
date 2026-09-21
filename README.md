
  # Professional Web App Design

  This is a code bundle for Professional Web App Design. The original project is available at https://www.figma.com/design/8CLGUJSVXI9lKuOcSsvLw8/Professional-Web-App-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Backend-connected workspace

After signing in, choose **Workspace** from the top navigation or **All workspace pages** from the sidebar. The workspace exposes assessments, learning, opportunities, collaboration, messaging, institution reports and administration according to the authenticated role.

See [Frontend implementation](FRONTEND_IMPLEMENTATION.md) for setup and workflows and [API integration coverage](API_INTEGRATION_COVERAGE.md) for the endpoint-to-page inventory. New registration includes domain/discipline selection and email verification.

On Windows PowerShell use `npm.cmd run dev`, `npm.cmd test`, and `npm.cmd run build`. Configure `VITE_API_URL` in `.env` to point to the running backend. The backend must allow the frontend origin through CORS.
  
