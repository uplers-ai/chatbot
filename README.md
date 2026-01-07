# Salary Guide Chatbot - Setup Guide

## Overview

This chatbot answers questions about the Uplers India Salary Guide 2026 and logs all conversations for analysis.

## Files Included

```
components/
  └── SalaryGuideChatbot.jsx    # Main chatbot component (Next.js 15 compatible)

app/
  └── api/
      └── chat-log/
          ├── route.js           # Basic API route with multiple storage options
          └── route-wordpress.js # WordPress-specific API route

wordpress/
  └── salary-guide-chatbot-logs.php  # WordPress plugin to store logs
```

---

## Setup Instructions

### Step 1: Add the Chatbot Component

1. Copy `components/SalaryGuideChatbot.jsx` to your Next.js project's components folder

2. Import and use it in your salary guide page:

```jsx
// app/salary-guide/page.js

import SalaryGuideChatbot from '@/components/SalaryGuideChatbot'

export default function SalaryGuidePage() {
  return (
    <>
      {/* Your existing page content */}
      <SalaryGuideChatbot />
    </>
  )
}
```

### Step 2: Set Up the API Route

1. Create the folder structure: `app/api/chat-log/`

2. Copy `route-wordpress.js` to `app/api/chat-log/route.js`

3. Add your WordPress URL to `.env.local`:

```env
WORDPRESS_URL=https://your-wordpress-site.com
```

### Step 3: Install the WordPress Plugin

1. Copy `wordpress/salary-guide-chatbot-logs.php` to your WordPress plugins folder:
   `wp-content/plugins/salary-guide-chatbot-logs.php`

2. Activate the plugin in WordPress Admin → Plugins

3. The plugin will:
   - Create a database table for storing logs
   - Add REST API endpoints for receiving data
   - Add an admin page to view logs and analytics

### Step 4: View Chat Analytics

Go to **WordPress Admin → Chatbot Logs** to see:

- Total messages
- Unanswered questions (questions the bot couldn't answer)
- Category breakdown
- Recent unanswered questions

---

## Data Being Logged

Each chat interaction logs:

| Field | Description |
|-------|-------------|
| `sessionId` | Unique ID for the chat session |
| `userMessage` | What the user asked |
| `botResponse` | What the bot replied |
| `wasAnswered` | `true` if bot had an answer, `false` if fallback |
| `category` | Topic category (salary_query, interview, etc.) |
| `page` | Which page the user was on |
| `timestamp` | When the message was sent |

---

## Categories Tracked

- `greeting` - Hi, hello, etc.
- `salary_aiml` - AI/ML salary questions
- `salary_query` - General salary questions
- `salary_role` - Specific role salary lookups
- `interview` - Interview process questions
- `blind_spots` - Hiring mistakes/tips
- `backouts` - Notice period questions
- `ecosystem` - Service vs Product
- `gic` - Global Innovation Centers
- `india_stats` - India startup statistics
- `top_roles` - Most hired roles
- `top_tier` - IIT/BITS/IIM questions
- `about_uplers` - Company info
- `role_list` - List of all roles
- `help` - What can you do
- `unanswered` - **Bot couldn't answer** ← Focus on these!

---

## Improving the Chatbot

The `unanswered` category is your goldmine. Check WordPress Admin → Chatbot Logs regularly to see:

1. **What questions users are asking that the bot can't answer**
2. **Common patterns in unanswered questions**
3. **Topics you should add to the next salary guide**

To add new Q&A patterns, edit the `generateResponse()` function in `SalaryGuideChatbot.jsx`.

---

## API Endpoints (WordPress)

### POST `/wp-json/chatbot/v1/logs`
Save a chat log entry.

### GET `/wp-json/chatbot/v1/logs`
Retrieve logs (admin only). Supports filters:
- `category` - Filter by category
- `wasAnswered` - `true` or `false`
- `startDate` / `endDate` - Date range
- `search` - Search in messages
- `page` / `per_page` - Pagination

### GET `/wp-json/chatbot/v1/analytics`
Get summary analytics (admin only):
- `days` - Number of days to analyze (default: 30)

---

## Troubleshooting

**Logs not appearing in WordPress:**
- Check that `WORDPRESS_URL` is set correctly in `.env.local`
- Verify the WordPress plugin is activated
- Check browser console and server logs for errors

**CORS errors:**
- The Next.js API route acts as a proxy, so CORS shouldn't be an issue
- If calling WordPress directly from frontend, add CORS headers to WordPress

**Database table not created:**
- Deactivate and reactivate the WordPress plugin
- Check WordPress error logs

---

## Questions?

The chatbot component is self-contained. All knowledge is in the `KNOWLEDGE_BASE` object - no external API calls needed for answering questions. Only the logging feature requires the WordPress backend.
