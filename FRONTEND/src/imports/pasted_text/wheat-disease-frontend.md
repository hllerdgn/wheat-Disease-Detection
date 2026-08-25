# Wheat Disease Detection — Frontend Redesign & Modernization Prompt

## Project Context

I have an existing AI-powered wheat disease detection project:

**GitHub Repository:**
https://github.com/hllerdgn/wheat-Disease-Detection

The project is an end-to-end agricultural AI application that analyzes wheat leaf/head images and detects diseases using a deep learning model.

The current architecture includes:

* Python / PyTorch
* EfficientNet-B3 transfer learning
* FastAPI backend
* REST API
* Image-based disease classification
* Disease knowledge base / recommendation engine
* Docker
* Production-oriented API architecture

The backend exposes a prediction endpoint:

`POST /predict/`

The API accepts a wheat image and returns prediction information similar to:

```json
{
  "success": true,
  "latency_seconds": 0.125,
  "prediction": {
    "class": "yellow_rust",
    "confidence": 0.9821
  },
  "disease_details": {
    "name_tr": "Sarı Pas (Yellow Rust)",
    "description": "...",
    "action": "...",
    "solution": "..."
  }
}
```

The frontend should be redesigned around this existing backend architecture.

---

# PRIMARY OBJECTIVE

Completely redesign and modernize the frontend of the Wheat Disease Detection project.

The new interface should feel like a **real AI-powered AgriTech product**, not a student ML demo.

The design should communicate:

* Artificial Intelligence
* Computer Vision
* Precision Agriculture
* Wheat Health Monitoring
* Fast image analysis
* Trustworthy prediction results
* Practical agricultural recommendations

The frontend must visually demonstrate that this is an actual AI product built by a Software Engineering / AI-focused developer.

Do NOT create a generic SaaS dashboard.

Do NOT make the interface unnecessarily complicated.

The primary user journey should remain extremely clear:

**Upload Wheat Image → Analyze with AI → View Prediction → Understand Disease → Take Recommended Action**

---

# DESIGN DIRECTION

Create a modern, premium, minimal AgriTech interface.

Visual inspiration should come from modern:

* AI products
* Computer vision applications
* Precision agriculture platforms
* Scientific dashboards
* Modern SaaS interfaces

However, avoid copying any existing website.

The design should have its own identity.

## Visual personality

The interface should feel:

* Modern
* Clean
* Professional
* Scientific
* Trustworthy
* Intelligent
* Agricultural
* Minimal
* Premium

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Neon colors
* Gaming aesthetics
* Generic AI chatbot aesthetics
* Excessive cards
* Huge amounts of text
* Crowded dashboards
* Stock-photo-heavy layouts

---

# COLOR SYSTEM

Use agriculture-inspired colors while maintaining a modern software-product appearance.

Primary palette:

* Deep forest green
* Natural green
* Soft sage
* Warm off-white
* Charcoal
* Muted gray

Use green primarily for:

* Primary actions
* Successful predictions
* Healthy status
* Important highlights

Disease states should have their own semantic colors.

For example:

* Healthy → green
* Warning → amber
* Disease detected → red/orange

Do not make the entire website green.

The color system should remain restrained and professional.

---

# TYPOGRAPHY

Use a modern sans-serif font such as:

* Inter
* Geist
* Manrope

Use strong typography hierarchy.

Large headings should be confident but not oversized.

Body text should be comfortable to read.

Do NOT create dense blocks of text.

Use generous whitespace.

The spacing between sections should be significantly larger than the spacing currently used in the application.

The website should breathe.

---

# RESPONSIVE DESIGN

The application must be fully responsive.

Design specifically for:

* Desktop
* Laptop
* Tablet
* Mobile

Do not simply shrink the desktop layout.

On mobile:

* Stack sections vertically
* Make upload area easy to use
* Make prediction results readable
* Keep primary actions accessible
* Avoid horizontal scrolling

---

# APPLICATION STRUCTURE

Create the following frontend structure.

## 1. Landing / Detection Page

The main page should immediately communicate what the application does.

### Hero section

Headline:

**AI-Powered Wheat Disease Detection**

Supporting text:

**Analyze wheat leaf and head images with deep learning and get fast, actionable disease insights.**

Primary CTA:

**Analyze an Image**

Secondary CTA:

**How It Works**

Include a subtle visual representation of:

* Wheat leaf
* AI analysis
* Detection
* Result

Do not use a generic AI robot illustration.

Use agriculture / wheat / computer vision visuals.

---

# 2. IMAGE ANALYSIS SECTION

This is the most important part of the application.

Create a large, premium image upload interface.

The upload area should support:

* Drag & drop
* Click to upload
* Image preview
* Replace image
* Remove image

Accepted formats:

* JPG
* JPEG
* PNG
* WEBP

Display a small helper text:

**Upload a clear image of a wheat leaf or head for best results.**

The upload component should feel like a professional AI analysis interface.

---

# 3. IMAGE PREVIEW

After selecting an image:

Show a large preview.

Display:

* Image
* File name
* File size
* Image dimensions if available

Actions:

**Change Image**

**Analyze Image**

The Analyze button should be the primary CTA.

---

# 4. AI ANALYSIS STATE

When the user clicks Analyze:

Do NOT simply freeze the interface.

Create a polished AI processing state.

Example:

**Analyzing wheat image...**

Show subtle stages:

1. Uploading image
2. Preprocessing image
3. Running computer vision model
4. Identifying disease
5. Preparing recommendations

Use a tasteful animated loader.

Do not use an excessive spinner.

If the API returns latency information, display it after completion.

For example:

**Analysis completed in 125 ms**

---

# 5. PREDICTION RESULT

After receiving the API response, transition smoothly to a dedicated result state.

The result should immediately communicate:

### Disease detected

Example:

**Yellow Rust**

Turkish:

**Sarı Pas**

Display:

* Disease name
* Disease status
* Confidence percentage
* Uploaded image
* Analysis latency

Example:

**98.21% confidence**

Use a visually prominent confidence indicator.

Possible implementation:

* Circular progress
* Horizontal confidence bar
* Large percentage

Keep it elegant.

---

# 6. RESULT IMAGE

Show the analyzed image next to the prediction.

Desktop:

Two-column layout.

Left:

Image

Right:

Prediction result

Mobile:

Stack vertically.

The image should not dominate the entire screen.

---

# 7. DISEASE INFORMATION

Create a dedicated section titled:

**About This Disease**

Display the information returned from the backend.

Possible fields:

* Disease name
* Scientific / English name
* Description
* Symptoms
* Risk level

Do not invent information that the backend does not provide.

Only render fields actually available from the API.

---

# 8. RECOMMENDED ACTION

Create a visually distinct section for the recommendation returned by:

`disease_details.action`

Example:

### Recommended Action

Display the recommended immediate action clearly.

This should be more prominent than ordinary descriptive text.

Use an appropriate icon.

---

# 9. SOLUTION / TREATMENT SECTION

Display:

### Recommended Solution

Use the backend:

`disease_details.solution`

If the response contains multiple steps, render them as:

1. Step one
2. Step two
3. Step three

Do not display a large wall of text.

Break information into readable sections.

---

# 10. HEALTHY RESULT STATE

The application must have a special UI for healthy wheat.

If:

`prediction.class = healthy`

Display:

### Wheat appears healthy

Show:

* High-confidence healthy status
* Uploaded image
* Confidence
* Short explanation
* Preventive recommendations if provided by backend

Use a positive but professional visual language.

Do not make it look like a disease alert.

---

# 11. DISEASE RESULT STATE

For disease detection:

Use a stronger visual hierarchy.

Example:

**Disease Detected**

**Yellow Rust**

**98.21% confidence**

Then:

* Disease description
* Recommended action
* Solution

The user should understand the result within 2–3 seconds.

---

# 12. SUPPORTED DISEASES

Create a lightweight section explaining the supported classification categories.

The backend currently describes 7 classes:

* Healthy
* Yellow Rust
* Brown Rust
* Stem Rust
* Powdery Mildew
* Septoria
* Fusarium

Create a visually elegant grid/list.

Each disease should have:

* Name
* Short description if available
* Semantic status indicator

Do not overload this section.

---

# 13. HOW IT WORKS

Create a simple 3-step explanation:

### 01 — Upload

Upload a wheat leaf or head image.

### 02 — AI Analysis

The image is processed using a deep learning computer vision model.

### 03 — Get Insights

Receive the predicted disease, confidence score and recommended actions.

Use subtle illustrations/icons.

---

# 14. TECHNOLOGY SECTION

Because this is also a developer portfolio project, include a small technical section.

Title:

**Powered by AI & Modern Engineering**

Show technologies such as:

* PyTorch
* EfficientNet-B3
* FastAPI
* Python
* Computer Vision
* REST API
* Docker

This section should NOT dominate the product experience.

It should demonstrate technical credibility without turning the frontend into a developer documentation page.

---

# 15. API STATUS

Add a subtle system status indicator.

Example:

**AI Engine Online**

or

**API Connected**

If the frontend can check backend availability, make this indicator dynamic.

Possible states:

* Online
* Connecting
* Offline

Do not expose unnecessary technical details to ordinary users.

---

# 16. ERROR HANDLING

Design polished error states.

Handle:

### Invalid file

**Please upload a valid image file.**

### File too large

**This image is too large. Please choose a smaller image.**

### API unavailable

**The AI analysis service is currently unavailable. Please try again.**

### Prediction failure

**We couldn't analyze this image. Please try another wheat image.**

### Unsupported image

**Please upload a clear image containing a wheat leaf or wheat head.**

Errors should be visually clear but not alarming.

---

# 17. EMPTY STATE

When no image has been uploaded:

Do not show an empty dashboard.

Instead create a beautiful focused empty state:

**Ready to analyze your wheat**

**Upload an image to start AI-powered disease detection.**

Include:

* Upload icon
* Drag & drop area
* Analyze button disabled until image exists

---

# 18. NAVIGATION

Keep navigation minimal.

Suggested navigation:

**WheatAI**

* Detection
* How It Works
* Supported Diseases
* About

Primary action:

**Analyze Image**

Do not create unnecessary navigation items.

---

# 19. HEADER

Create a modern sticky header.

Left:

WheatAI logo / wheat icon

Center/right:

Navigation

Right:

**Analyze Image**

The logo should be simple.

Avoid generic AI logos.

A minimal wheat + technology symbol would work well.

---

# 20. FOOTER

Create a minimal footer.

Include:

**Wheat Disease Detection**

AI-powered wheat health analysis.

Technology:

PyTorch · EfficientNet-B3 · FastAPI

GitHub link:

https://github.com/hllerdgn/wheat-Disease-Detection

Do not create a huge footer.

---

# UX REQUIREMENTS

The user should be able to complete the entire workflow without confusion.

Ideal flow:

1. Open application
2. Understand the purpose immediately
3. Upload image
4. Preview image
5. Click Analyze
6. See AI processing state
7. Receive prediction
8. See confidence
9. Read disease information
10. See recommended action
11. Start another analysis

Add:

**Analyze Another Image**

button after the result.

This should reset the detection interface without reloading the page.

---

# ANIMATION

Use subtle animations only.

Recommended:

* Fade-in
* Slide-up
* Image preview transition
* Progress animation
* Result reveal
* Button hover
* Card hover

Avoid:

* Excessive bouncing
* Constant movement
* Large animated backgrounds
* Distracting particles
* Overly flashy AI effects

The application should feel fast and professional.

---

# ACCESSIBILITY

Implement:

* Proper semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Accessible upload controls
* Alt text for images
* Good color contrast
* Screen-reader-friendly status messages

Do not rely only on color to communicate disease status.

---

# FRONTEND ARCHITECTURE

Before changing the UI, inspect the existing frontend code.

Do NOT blindly rewrite the entire project.

First determine:

* Existing framework
* Existing components
* Existing API service
* Existing routing
* Existing styling system
* Existing environment variables
* Existing backend URL
* Existing API response handling

Preserve working functionality.

Refactor only where necessary.

Separate responsibilities into reusable components.

Suggested structure:

```text
frontend/
├── components/
│   ├── Header
│   ├── Hero
│   ├── ImageUploader
│   ├── ImagePreview
│   ├── AnalysisLoader
│   ├── PredictionResult
│   ├── ConfidenceScore
│   ├── DiseaseInfo
│   ├── RecommendedAction
│   ├── SolutionCard
│   ├── SupportedDiseases
│   └── Footer
│
├── services/
│   └── api
│
├── hooks/
│   └── usePrediction
│
├── types/
│   └── prediction
│
└── pages/
    └── Detection
```

Adapt this structure to the existing frontend rather than forcing it if the project already has a better architecture.

---

# API INTEGRATION

The frontend must remain compatible with the existing FastAPI backend.

Use the actual backend response structure.

Do not hardcode prediction results.

The frontend should dynamically render:

```text
prediction.class
prediction.confidence
disease_details.name_tr
disease_details.description
disease_details.action
disease_details.solution
latency_seconds
success
```

Use an environment variable for the API URL.

Example:

```env
VITE_API_URL=http://localhost:8000
```

Do not hardcode production URLs inside components.

---

# IMPORTANT BACKEND COMPATIBILITY RULE

Do NOT modify backend behavior just to make the frontend easier.

The primary objective is to improve the frontend while preserving the existing backend contract.

If the current frontend API integration is incorrect:

1. Identify the problem.
2. Fix the frontend request.
3. Preserve the backend endpoint.
4. Handle the actual response schema.

Only modify the backend if absolutely necessary and clearly explain why.

---

# PERFORMANCE

The application should feel fast.

Optimize:

* Image preview
* API requests
* Component rendering
* Image loading
* Animations

Do not unnecessarily load huge images.

Compress or resize images client-side only if this does not interfere with model requirements.

Show meaningful loading states during inference.

---

# SECURITY

Do not expose:

* API keys
* Secrets
* Private credentials
* Server-side environment variables

Use frontend-safe environment variables only.

Validate uploaded files before sending them to the API.

---

# CODE QUALITY

The final implementation should be production-quality.

Requirements:

* Reusable components
* Clean naming
* No duplicated logic
* No unnecessary dependencies
* No dead code
* No console errors
* No broken imports
* No hardcoded prediction data
* Proper TypeScript types if TypeScript is used
* Proper error handling
* Responsive layout

Do not introduce a new framework unless the existing project requires it.

---

# IMPORTANT DESIGN PRINCIPLE

This project is part of a Software Engineering / AI portfolio.

Therefore the frontend should communicate BOTH:

### Product quality

The application looks like a real AgriTech product.

AND

### Engineering quality

The implementation demonstrates:

* API integration
* AI inference workflow
* Async state management
* Error handling
* Responsive UI
* Component architecture
* Clean frontend engineering

The final result should make a recruiter think:

> "This developer didn't just train a model. They built an actual AI-powered application around it."

---

# FINAL IMPLEMENTATION REQUIREMENTS

Before finishing:

1. Inspect the existing frontend.
2. Understand the existing API integration.
3. Preserve working functionality.
4. Redesign the UI.
5. Connect every UI state to real application state.
6. Test image upload.
7. Test API request.
8. Test loading state.
9. Test successful prediction.
10. Test healthy prediction.
11. Test disease prediction.
12. Test API error.
13. Test invalid file.
14. Test mobile layout.
15. Test desktop layout.
16. Remove unnecessary placeholder content.
17. Remove mock prediction data.
18. Remove console errors.
19. Ensure the application builds successfully.
20. Ensure the final frontend communicates a premium AI-powered AgriTech product.

Do not stop after creating a visual mockup.

The result must be a **fully functional frontend connected to the existing Wheat Disease Detection backend.**
