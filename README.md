# Telegram Chat Analytics

A web application that provides insightful analytics and visualizations for your Telegram chat history. Upload your Telegram chat export and get detailed statistics, charts, and analysis of your conversations.

## Features

- 📊 Comprehensive chat statistics and visualizations
- 📅 Year-by-year analysis of chat activity
- 🎨 Custom color coding for chat participants
- 📤 Data sharing capabilities
- 🔒 Privacy-focused (all processing happens in your browser)
- 📱 Responsive design for both desktop and mobile
- 💡 Example data visualization available

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:yuloskov/tg-analytics.git
cd tg-analytics
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. Export your Telegram chat history:
   - Open Telegram Desktop
   - Go to the chat you want to analyze
   - Click on the three dots menu (⋮)
   - Select "Export chat history"
   - Choose "JSON" format
   - Download the export

2. Upload the exported JSON file:
   - Go to the application
   - Click on "Upload" tab
   - Drop your JSON file or click to select it
   - Wait for the analysis to complete

3. Explore your chat analytics:
   - View message statistics
   - Check activity patterns
   - Analyze participant engagement
   - Customize user colors
   - Share insights with others

## Privacy & Security

This application prioritizes your data privacy and security:

- 🔒 All data processing happens locally in your browser
- 🔐 When sharing reports, data is protected with end-to-end encryption
- 📱 Only aggregated statistics are stored (never original messages)
- 🔑 Only people with the share link can access the encrypted data
- 💾 No chat data is ever stored unencrypted on any servers

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS

## License

MIT
