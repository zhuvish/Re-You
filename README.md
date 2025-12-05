DevMemory – AI-Powered Semantic Search for Codebases

DevMemory is an AI-powered tool that helps developers instantly recall past implementations across multiple repositories. It extracts code, commits, and documentation from your projects, converts them into embeddings, and allows natural-language search using a Retrieval-Augmented Generation (RAG) pipeline.

🚀 Key Features

Semantic Search — Find code by meaning, not keywords

Code Snippet Retrieval — Returns relevant functions/classes with file paths

Commit Insight — Retrieve commit messages related to functionality

Contextual Q&A — Ask questions like “How is login implemented?”

Multi-Repo Support (Planned) — Unified memory across all your codebases

🧠 How It Works
1. Ingestion

Extracts Python & JavaScript code using AST/regex

Parses commit history via Git

Chunks code into functions/classes

2. Embeddings & Storage

Generates embeddings using MiniLM

Stores vectors + metadata in ChromaDB

3. Retrieval & Q&A

Vector search retrieves top relevant chunks

Results passed to LLM via Groq API for contextual answers

⚙️ Setup Instructions
Install dependencies
pip install -r requirements.txt

Add your environment variables

Create a .env file:

GROQ_API_KEY=your_api_key_here

Run ingestion + embedding
python embeddings/store_embeddings.py

Run the QA interface
python qa/qa_service.py

📌 Tech Stack

Python, FastAPI (upcoming)

ChromaDB for vector storage

SentenceTransformers (MiniLM) for embeddings

Groq API for LLM inference

Tree-sitter (future multi-language support)

🛣️ Future Enhancements

Tree-sitter multi-language parsing

Hybrid retrieval (semantic + keyword)

Cross-encoder reranking

Knowledge graph of function relationships

Next.js frontend

GitHub OAuth + incremental indexing
