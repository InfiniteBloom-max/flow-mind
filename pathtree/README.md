# PathTree ⚡

Transform your documents into interactive knowledge trees, summaries, flashcards, and AI tutor using Mistral AI.

## 🚀 Features

- **📄 Document Upload**: Support for PDF, Word documents, and text files
- **🌳 Interactive Knowledge Tree**: Visualize document concepts as an interactive node-based graph
- **📝 AI-Generated Summaries**: Create 1-page, 5-page, or chapter-based summaries
- **🎯 Smart Flashcards**: Generate flashcards with difficulty levels and filtering
- **🤖 AI Tutor**: Chat with an AI tutor about your document content
- **🎨 Modern UI**: Clean, responsive interface built with Next.js 14 and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Visualization**: React Flow for interactive knowledge trees
- **AI**: Mistral AI for content generation and analysis
- **File Processing**: Support for PDF, DOCX, and text files
- **Deployment**: Vercel-ready configuration

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mistral AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pathtree.git
   cd pathtree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Mistral API Key

You can configure your Mistral API key in two ways:

1. **Environment Variable** (Recommended for production):
   ```env
   MISTRAL_API_KEY=your_api_key_here
   ```

2. **Default Key**: The app includes a default key for demo purposes, but you should replace it with your own for production use.

### Supported File Types

- **PDF**: `.pdf` files (parsing temporarily disabled due to compatibility)
- **Word Documents**: `.docx` files
- **Text Files**: `.txt`, `.md`, and other text formats

## 📱 Usage

1. **Upload Document**: Drag and drop or select a document file
2. **Explore Knowledge Tree**: Click on nodes to see detailed information
3. **Generate Summaries**: Choose from 1-page, 5-page, or chapter summaries
4. **Study with Flashcards**: Review generated flashcards with difficulty filters
5. **Chat with AI Tutor**: Ask questions about your document content

## 🏗️ Project Structure

```
pathtree/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   │   ├── upload/     # File upload endpoint
│   │   │   ├── generate/   # AI generation endpoints
│   │   │   ├── node/       # Node details endpoint
│   │   │   └── tutor/      # AI tutor endpoint
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── KnowledgeTree.tsx # Interactive tree visualization
│   │   ├── Summaries.tsx   # Summary generation
│   │   ├── Flashcards.tsx  # Flashcard system
│   │   ├── Tutor.tsx       # AI tutor chat
│   │   └── NodeDetailsPanel.tsx # Node details panel
│   └── lib/
│       └── mistral.ts      # Mistral AI integration
├── public/                 # Static assets
├── uploads/               # Uploaded files (gitignored)
└── package.json           # Dependencies and scripts
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add your `MISTRAL_API_KEY` environment variable
   - Deploy!

### Environment Variables for Production

```env
MISTRAL_API_KEY=your_production_mistral_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) for the powerful AI capabilities
- [React Flow](https://reactflow.dev/) for the interactive graph visualization
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/pathtree/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about your issue

---

**Made with ❤️ using Next.js 14 and Mistral AI**