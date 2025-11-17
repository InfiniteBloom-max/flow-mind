import { Mistral } from '@mistralai/mistralai';

// Function to get API key from environment
function getApiKey(): string {
  return process.env.MISTRAL_API_KEY || 'GtJJSeLN4KB2ZSHRiFW4mPwjeIIOUfG2';
}

// Function to create Mistral client with custom API key
function createMistralClient(customApiKey?: string): Mistral {
  return new Mistral({
    apiKey: customApiKey || getApiKey(),
  });
}

const client = createMistralClient();

export interface Node {
  id: string;
  title: string;
  description: string;
  children: string[];
  parent?: string;
  level: number;
  type: 'topic' | 'concept' | 'detail';
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'default';
}

export async function generateKnowledgeGraph(content: string, topics: string[]): Promise<{ nodes: Node[], edges: Edge[] }> {
  try {
    const prompt = `
Analyze the following content and create a hierarchical knowledge graph structure.

Content: ${content.substring(0, 3000)}
Topics: ${topics.join(', ')}

Create a JSON response with nodes and edges for a knowledge tree. Each node should have:
- id: unique identifier
- title: short descriptive title
- description: brief explanation
- children: array of child node ids
- parent: parent node id (if any)
- level: depth level (0 for root, 1 for main topics, 2+ for subtopics)
- type: 'topic', 'concept', or 'detail'

Create edges connecting parent-child relationships.

Return only valid JSON in this format:
{
  "nodes": [
    {
      "id": "root",
      "title": "Main Topic",
      "description": "Overview of the content",
      "children": ["node1", "node2"],
      "level": 0,
      "type": "topic"
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "source": "root",
      "target": "node1",
      "type": "default"
    }
  ]
}`;

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const content_text = response.choices?.[0]?.message?.content || '{}';
    
    try {
      const parsed = JSON.parse(content_text);
      return parsed;
    } catch (parseError) {
      // Fallback: create a simple structure
      const nodes: Node[] = [
        {
          id: 'root',
          title: 'Document Overview',
          description: 'Main content structure',
          children: topics.slice(0, 5).map((_, i) => `topic-${i}`),
          level: 0,
          type: 'topic'
        },
        ...topics.slice(0, 5).map((topic, i) => ({
          id: `topic-${i}`,
          title: topic,
          description: `Details about ${topic}`,
          children: [],
          parent: 'root',
          level: 1,
          type: 'concept' as const
        }))
      ];

      const edges: Edge[] = topics.slice(0, 5).map((_, i) => ({
        id: `edge-${i}`,
        source: 'root',
        target: `topic-${i}`,
        type: 'default' as const
      }));

      return { nodes, edges };
    }
  } catch (error) {
    console.error('Mistral API error:', error);
    throw new Error('Failed to generate knowledge graph');
  }
}

export async function generateSummary(content: string, type: 'one_page' | 'five_page' | 'chapters'): Promise<any> {
  try {
    let prompt = '';
    
    switch (type) {
      case 'one_page':
        prompt = `Summarize the following content in exactly one page (about 300-400 words). Focus on the key points and main ideas:\n\n${content.substring(0, 4000)}`;
        break;
      case 'five_page':
        prompt = `Create a detailed 5-page summary of the following content. Structure it with clear sections and comprehensive coverage:\n\n${content.substring(0, 4000)}`;
        break;
      case 'chapters':
        prompt = `Break down the following content into chapter summaries. Identify main sections and provide a summary for each:\n\n${content.substring(0, 4000)}`;
        break;
    }

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const summary = response.choices?.[0]?.message?.content || 'Summary generation failed';
    
    if (type === 'chapters') {
      // Try to parse chapters
      const chapters = summary.split(/Chapter \d+|Section \d+/i).filter(ch => ch.trim());
      return { chapters: chapters.map((ch, i) => ({ title: `Chapter ${i + 1}`, content: ch.trim() })) };
    }
    
    return type === 'one_page' ? { one_page: summary } : { five_page: summary };
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate summary');
  }
}

export async function generateFlashcards(content: string, concepts: string[]): Promise<any[]> {
  try {
    const prompt = `
Create flashcards from the following content and concepts. Generate 10-15 question-answer pairs.

Content: ${content.substring(0, 3000)}
Key Concepts: ${concepts.slice(0, 20).join(', ')}

Return a JSON array of flashcards in this format:
[
  {
    "question": "What is...",
    "answer": "The answer is...",
    "difficulty": "easy|medium|hard",
    "tag": "concept-category"
  }
]

Focus on important concepts, definitions, and key relationships.`;

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const content_text = response.choices?.[0]?.message?.content || '[]';
    
    try {
      return JSON.parse(content_text);
    } catch (parseError) {
      // Fallback flashcards
      return concepts.slice(0, 10).map((concept, i) => ({
        question: `What is ${concept}?`,
        answer: `${concept} is an important concept from the document.`,
        difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
        tag: 'general'
      }));
    }
  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw new Error('Failed to generate flashcards');
  }
}

export async function generateNodeDetails(nodeTitle: string, content: string): Promise<any> {
  try {
    const prompt = `
Provide detailed information about "${nodeTitle}" based on this content:

${content.substring(0, 3000)}

Return a JSON object with:
{
  "theory": "Theoretical explanation",
  "simplified": "Simple, easy-to-understand explanation with analogies",
  "examples": ["Example 1", "Example 2", "Example 3"],
  "flashcards": [
    {"question": "Q1", "answer": "A1"},
    {"question": "Q2", "answer": "A2"}
  ],
  "references": ["Related concept 1", "Related concept 2"]
}`;

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const content_text = response.choices?.[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content_text);
    } catch (parseError) {
      return {
        theory: `Theoretical explanation of ${nodeTitle}`,
        simplified: `${nodeTitle} is a key concept that can be understood as...`,
        examples: [`Example of ${nodeTitle}`, `Another example`, `Third example`],
        flashcards: [
          { question: `What is ${nodeTitle}?`, answer: `${nodeTitle} is...` },
          { question: `How does ${nodeTitle} work?`, answer: `It works by...` }
        ],
        references: ['Related concept 1', 'Related concept 2']
      };
    }
  } catch (error) {
    console.error('Node details generation error:', error);
    throw new Error('Failed to generate node details');
  }
}

export async function generateTutorResponse(question: string, content: string): Promise<any> {
  try {
    const prompt = `
You are an AI tutor. Answer the following question based on the provided content. 
Provide a comprehensive response with explanation, simplified version, and practice questions.

Question: ${question}
Content: ${content.substring(0, 3000)}

Return a JSON object with:
{
  "explanation": "Detailed explanation",
  "simplified": "Simple explanation with analogies",
  "diagram_desc": "Description of a helpful diagram or visual",
  "practice": [
    {"question": "Practice question 1", "answer": "Answer 1"},
    {"question": "Practice question 2", "answer": "Answer 2"}
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const content_text = response.choices?.[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content_text);
    } catch (parseError) {
      return {
        explanation: `Here's an explanation of your question about: ${question}`,
        simplified: `In simple terms: ${question} can be understood as...`,
        diagram_desc: 'A flowchart showing the relationship between concepts would be helpful here.',
        practice: [
          { question: 'Practice question 1', answer: 'Answer 1' },
          { question: 'Practice question 2', answer: 'Answer 2' }
        ],
        tips: ['Remember the key concepts', 'Practice regularly', 'Connect to real examples']
      };
    }
  } catch (error) {
    console.error('Tutor response generation error:', error);
    throw new Error('Failed to generate tutor response');
  }
}