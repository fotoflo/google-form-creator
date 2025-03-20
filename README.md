# Google Forms Creator

A web application that allows users to create Google Forms from JSON data. Built with Next.js and the Google Forms API.

## Features

- Sign in with Google OAuth
- Create Google Forms from JSON data
- AI-assisted form creation with ChatGPT prompts
- Validation of form data
- Detailed error messages

## Technologies Used

- Next.js
- NextAuth.js for authentication
- Google Forms API
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 14.x or later
- A Google Cloud Platform account with the Google Forms API enabled
- OAuth 2.0 credentials for Google authentication

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/fotoflo/google-form-creator.git
   cd google-form-creator
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Enter a name for your form
3. Paste your JSON data or use the "Load Sample JSON" button
4. Click "Create Google Form"
5. Access your newly created form via the provided link

## JSON Format

The application expects JSON data in the following format:

```json
[
  {
    "title": "Question text here",
    "type": "text", // Options: text, paragraph, multipleChoice, checkboxes, dropdown
    "description": "Optional description text",
    "required": true, // or false
    "options": ["Option 1", "Option 2", "Option 3"] // Only for multipleChoice, checkboxes, dropdown
  }
]
```

## AI-Assisted Form Creation

Use the provided ChatGPT prompt to generate form JSON. The prompt will guide you through:

1. Defining your form's purpose
2. Determining the appropriate length
3. Generating relevant questions
4. Converting to the required JSON format

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
