# Smokey Barbers — Staff Brain

A full-stack web app for barber shop staff management powered by Claude AI.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file with:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Run Locally
```bash
npm run dev
```

This starts both the React dev server and Netlify Functions locally.

### 4. Build for Production
```bash
npm run build
```

## Deploying to Netlify

### Option 1: Git-based Deploy (Recommended)
1. Push to GitHub
2. Connect your repo on [Netlify](https://app.netlify.com)
3. Set environment variables in Netlify dashboard
4. Netlify will auto-deploy on every push

### Option 2: Manual Deploy
```bash
npm run build
npx netlify deploy --prod
```

## Features

- **Secure API Integration**: Anthropic API key stored on backend
- **Chat Interface**: Talk to the Staff Brain AI assistant
- **Staff Management**: Track schedules, availability, and barber details
- **Authentication**: Demo login with multiple user roles
- **Responsive Design**: Works on desktop and mobile

## Demo Credentials

- Email: `demo@smokey.com` | Password: `demo123`
- Email: `manager@smokey.com` | Password: `manager123`
- Email: `barber@smokey.com` | Password: `barber123`

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Netlify Functions (Node.js)
- **AI**: Anthropic Claude API
- **Hosting**: Netlify

## Next Steps

1. **Add Database** (Netlify DB): Store chat history and staff data
   - Add Netlify DB in your site settings
   - Create a schema for users, schedules, and chat logs

2. **Upgrade Authentication**: Use Netlify Identity instead of demo creds
   - Enable Identity in site settings
   - Update `/api/login` to use `@netlify/identity`

3. **Add More Features**:
   - Schedule management view
   - Staff profiles
   - Appointment booking
   - Analytics dashboard

## Support

For issues or feature requests, check the GitHub repo or contact the team.
