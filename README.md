# Shubhanan Sharma - Portfolio Website

A modern, responsive portfolio website showcasing my skills, projects, and professional journey as a Full Stack Developer specializing in AI/ML.

## 🌟 Features

- **Modern Design**: Clean, minimalist interface with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Interactive Navigation**: Smooth scrolling with active section highlighting
- **Animated Components**: Framer Motion animations throughout the site
- **Project Showcase**: Paginated project gallery with live demos and GitHub links
- **Functional Contact Form**: EmailJS integration for seamless email delivery
- **Star Background**: Dynamic animated background for visual appeal

## 🚀 Tech Stack

### Frontend Framework

- **React** - Component-based UI library
- **JavaScript (ES6+)** - Modern JavaScript features

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Lucide React** - Beautiful icon library

### Email Service

- **EmailJS** - Client-side email service for contact form functionality

### Build Tools & Development

- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting

## 📱 Sections

### 🏠 Hero Section

- Dynamic title rotation
- Professional introduction
- Social media links
- Call-to-action buttons
- Profile image with hover effects

### 💼 Experience Section

- Timeline-based layout
- Animated entry effects
- Skills and technologies used
- Company details and duration

### 🎓 Education Section

- Academic qualifications
- Institution details
- Grades and achievements
- Animated cards with icons

### 🛠️ Skills Section

- Technical skills showcase
- Categorized skill sets
- Progress indicators
- Interactive hover effects

### 🚀 Projects Section

- Paginated project gallery (3 projects per page)
- Live demo and GitHub links
- Technology stack tags
- Project descriptions and images
- Online/offline status indicators

### 📬 Contact Section

- **Functional Contact Form** with EmailJS integration
- Form validation and error handling
- Toast notifications for user feedback
- Direct social media links (GitHub, LinkedIn, Email, Phone)
- Responsive design with smooth animations

## 🎨 Key Components

- **Navbar**: Responsive navigation with active section tracking
- **StarBackground**: Animated background with floating stars
- **ContactSection**: Full-featured contact form with EmailJS
- **Footer**: Simple footer with scroll-to-top functionality

## 🎯 Key Features Implementation

### Email Integration (EmailJS)

- **Client-side Email Sending**: No backend required
- **Environment Variables**: Secure configuration management
- **Form Validation**: Real-time input validation
- **Loading States**: Visual feedback during email sending
- **Success/Error Handling**: Toast notifications for user feedback
- **Form Reset**: Automatic form clearing after successful submission

### Theme Toggle

- Persistent theme preference using localStorage
- Smooth transition animations
- System preference detection

### Smooth Scrolling Navigation

- Active section detection
- Smooth scroll behavior
- Mobile-responsive hamburger menu

### Animation System

- Framer Motion for complex animations
- Scroll-triggered animations
- Hover and interaction effects
- Staggered children animations

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Optimized for all screen sizes
- Touch-friendly interactions

## ⚙️ Setup & Configuration

### EmailJS Configuration

1. **Create EmailJS Account**:

   - Sign up at [EmailJS.com](https://www.emailjs.com/)
   - Create a new service (Gmail, Outlook, etc.)
   - Create an email template

2. **Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

3. **Email Template Variables**:
   Configure your EmailJS template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
   - `{{to_name}}` - Recipient name

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shubhs27/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your EmailJS credentials
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📧 Contact Form Features

- **Real-time Validation**: Immediate feedback on form inputs
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile Optimized**: Touch-friendly form controls
- **Error Handling**: Graceful error messages and retry options
- **Loading States**: Visual indicators during form submission
- **Success Feedback**: Confirmation messages with toast notifications

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **EmailJS** for seamless email functionality
- **Vite** for fast development experience

---

**Built with ❤️ by Shubhanan Sharma**
