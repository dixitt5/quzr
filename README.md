# Quzr – A Minimal Q&A Forum Platform

## Problem Statement (Number 2 StackIt)

Modern knowledge sharing platforms are often bloated with unnecessary features that distract from the core learning experience. Developers, students, and professionals need a **focused, minimal Q&A platform** that prioritizes:

- **Simplicity**: Clean, distraction-free interface for asking and answering questions
- **Rich Content**: Proper formatting tools for code, images, and structured text
- **Community Engagement**: Voting, tagging, and notification systems that encourage participation
- **Knowledge Discovery**: Effective tagging and search to find relevant answers quickly

Quzr solves these problems by providing a streamlined forum experience that emphasizes **quality over quantity** in both features and content.

## Overview

Quzr is a minimal question-and-answer platform designed for collaborative learning and structured knowledge sharing. It focuses on the core experience of asking and answering questions within a community, without the complexity of traditional forum platforms.

## Core Features

### 🔍 **Question Management**

- **Rich Text Editor**: Bold, italic, strikethrough, lists, emojis, hyperlinks, images
- **Text Alignment**: Left, center, right alignment options
- **Tagging System**: Multi-select tags for easy categorization and discovery
- **Image Upload**: Direct image embedding in questions and answers

### 💬 **Answering System**

- **Rich Formatting**: Same powerful editor for answers
- **Voting**: Upvote/downvote answers to surface the best content
- **Acceptance**: Question owners can mark the best answer as accepted
- **User Authentication**: Only logged-in users can post answers

### 🔔 **Notification System**

- **Real-time Notifications**: Bell icon with unread count
- **Smart Alerts**: Notified when someone answers your question, comments on your answer, or mentions you with @username
- **Dropdown Interface**: Click to view recent notifications

### 👥 **User Roles**

- **Guest**: View all questions and answers
- **User**: Register, login, post questions/answers, vote
- **Admin**: Moderate content and manage the platform

## Technical Stack

*[To be defined based on implementation decisions]*

## Local Development Setup

Follow these steps to set up and run the backend server locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and Docker Compose
- `npm` (or your preferred package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quzr.git
cd quzr
```

### 2. Set Up the Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a new file named `.env` in the `backend` directory and add the following line:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/quzr_dev?schema=public"
    ```

4.  **Start the PostgreSQL database:**
    Make sure Docker is running, then execute:
    ```bash
    docker compose up -d
    ```

5.  **Apply database migrations:**
    This command will set up the database schema.
    ```bash
    npm run db:migrate
    ```

6.  **Start the development server:**
    ```bash
    npm run dev
    ```

The backend API should now be running on `http://localhost:3000` (or the port specified in your configuration).

**Status**: 🚧 In Development

*Quzr - Where knowledge sharing meets simplicity.*

## **Team Members**

- Dixit Tilaji
- Naviz Khoja
- Uday Gajera
- Aditya Tiwari