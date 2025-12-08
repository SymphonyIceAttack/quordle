
<div align="center">
  <img src="public/logo.jpeg" alt="Quordle Daily Logo" width="200">
  
  # Quordle Daily
  
  **Free daily word puzzle games - Challenge your brain with multiple word puzzles**
  
  [🌐 Live Website](https://quordle.top/) • [📖 About](https://quordle.top/about) • [💬 Contact](https://quordle.top/contact) • [🐛 Report Issue](https://github.com/SymphonyIceAttack/quordle/issues)
</div>

---

## 🎮 What is Quordle Daily?

Quordle Daily is a modern web-based word puzzle game that combines the addictive gameplay of Wordle with multiple simultaneous challenges. Built with cutting-edge web technologies and deployed on Cloudflare's global edge network for lightning-fast performance worldwide.

### 🌟 Key Features

- **🎯 Dual Game Modes**: Play both Quordle (4 Wordle puzzles simultaneously) and Squares
- **📅 Daily Challenges**: Fresh puzzles every day with consistent difficulty
- **⚡ Lightning Fast**: Built on Next.js 16 with Cloudflare Workers deployment
- **📱 Mobile Optimized**: Responsive design that works perfectly on all devices
- **🎨 Modern UI**: Beautiful interface with dark/light theme support
- **🏆 Statistics Tracking**: Track your performance and improvement over time
- **🔊 Sound Effects**: Immersive audio feedback for your actions
- **💾 Progress Saving**: Your progress and statistics are automatically saved

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/SymphonyIceAttack/quordle.git
cd quordle

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play locally!

## 🎮 How to Play

### Quordle Mode
- Solve **4 Wordle puzzles simultaneously**
- You have **9 guesses** to solve all puzzles
- Use the same keyboard for all boards
- Green = correct letter in correct position
- Yellow = correct letter in wrong position
- Gray = letter not in any puzzle

### Squares Mode  
- Form words by connecting adjacent letters
- Score points based on word length and difficulty
- Challenge yourself with increasing difficulty levels

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Deployment**: Cloudflare Workers + OpenNext
- **Icons**: Lucide React
- **Fonts**: Next.js font optimization
- **Development**: Biome (Linting & Formatting)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Cloudflare Deployment  
npm run build:worker # Build for Cloudflare Workers
npm run preview      # Preview Cloudflare deployment
npm run deploy       # Deploy to Cloudflare Workers
npm run upload       # Upload to Cloudflare

# Code Quality
npm run lint         # Check for issues with Biome
npm run format       # Format code with Biome
```

## 🎯 Game Features

### Word Generation System
- **Three-tier fallback**: Advanced wordlist → Basic wordlist → Hardcoded words
- **Daily consistency**: Same puzzles for all players worldwide
- **Difficulty levels**: Easy, medium, and hard word pools
- **Smart caching**: Optimized for global performance

### Performance Optimizations
- **Edge deployment**: Deployed on Cloudflare's global network
- **Incremental caching**: Intelligent cache strategies
- **Image optimization**: Efficient asset loading
- **Bundle optimization**: Tree-shaking and code splitting

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript strict mode requirements
- Use Biome for linting and formatting
- Test your changes locally before submitting
- Update documentation for new features

### Bug Reports
- Use [GitHub Issues](https://github.com/SymphonyIceAttack/quordle/issues)
- Include browser version and steps to reproduce
- Provide screenshots if relevant

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Live Game**: [https://quordle.top/](https://quordle.top/)
- **Source Code**: [https://github.com/SymphonyIceAttack/quordle](https://github.com/SymphonyIceAttack/quordle)
- **Report Issues**: [GitHub Issues](https://github.com/SymphonyIceAttack/quordle/issues)
- **About Us**: [https://quordle.top/about](https://quordle.top/about)
- **Contact**: [https://quordle.top/contact](https://quordle.top/contact)

## 🙏 Acknowledgments

- Inspired by the original [Wordle](https://www.powerlanguage.co.uk/wordle/) game
- Built with love for the word puzzle community
- Thanks to all contributors and players

---

<div align="center">
  <p>
    <strong>Made with ❤️ for word puzzle lovers worldwide</strong>
  </p>
  <p>
    <a href="https://quordle.top/">🌐 Website</a> •
    <a href="https://github.com/SymphonyIceAttack/quordle">💻 GitHub</a> •
    <a href="https://quordle.top/contact">📧 Contact</a>
  </p>
</div>
