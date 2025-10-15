<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xyOTsjEcILujmFunCN6IhYxXYLQ8OLaE

## Features

- 🌐 **Multi-language Support**: Switch between English and Chinese (中文) seamlessly
  - Language switcher in the header (top right corner)
  - Persistent language preference (saved in localStorage)
  - Complete translations for all pages and components
  - Stripe payment integration supports both languages
  - Currency display follows language rules (CNY always in Chinese, others follow selected language)
- 🎨 **AI-Powered Image Editing**: Edit images using Gemini API
- 💳 **Secure Payments**: Purchase points using Stripe
- 📜 **Edit History**: Track your editing history
- 🎯 **Template Editor**: Use pre-made templates or create custom edits

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
4. Build the app:
   `npm run build`
5. Deploy the app:
   `npm run deploy`