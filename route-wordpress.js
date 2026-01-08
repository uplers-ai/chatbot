// app/api/chat-log/route.js
// Sends chat logs to WordPress backend

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()

    const {
      sessionId,
      userMessage,
      botResponse,
      wasAnswered,
      category,
      timestamp,
      page,
      userAgent,
      currency,
    } = body

    // Validate required fields
    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const chatLog = {
      sessionId,
      userMessage,
      botResponse,
      wasAnswered,
      category,
      timestamp,
      page,
      userAgent,
      currency,
    }

    // Send to WordPress REST API
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL

    if (wpUrl) {
      try {
        const wpResponse = await fetch(`${wpUrl}/wp-json/chatbot/v1/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add API key if you've set one in WordPress
            // 'X-API-Key': process.env.CHATBOT_API_KEY || '',
          },
          body: JSON.stringify(chatLog),
        })

        if (!wpResponse.ok) {
          console.error('WordPress API error:', await wpResponse.text())
        }
      } catch (wpError) {
        // Log but don't fail the request
        console.error('Failed to send to WordPress:', wpError)
      }
    } else {
      // If no WordPress URL configured, just log to console
      console.log('📝 Chat Log (no WordPress URL configured):', JSON.stringify(chatLog, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: 'Chat logged successfully',
    })

  } catch (error) {
    console.error('Error logging chat:', error)
    return NextResponse.json(
      { error: 'Failed to log chat' },
      { status: 500 }
    )
  }
}
