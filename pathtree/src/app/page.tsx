'use client';

import { useState } from 'react';
import { Upload, FileText, Brain, MessageSquare, BookOpen, Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import KnowledgeTree from '@/components/KnowledgeTree';
import Summaries from '@/components/Summaries';
import Flashcards from '@/components/Flashcards';
import Tutor from '@/components/Tutor';
import Settings from '@/components/Settings';

interface UploadedFile {
  file_id: string;
  filename: string;
  topics: string[];
  sections: string[];
  concept_list: string[];
  raw_text: string;
}

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'tree' | 'summaries' | 'flashcards' | 'tutor'>('upload');

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'tree', label: 'Knowledge Tree', icon: Brain },
    { id: 'summaries', label: 'Summaries', icon: FileText },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Settings />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">PathTree</h1>
          </div>
          <p className="text-lg text-gray-600">
            Transform your documents into interactive knowledge trees, summaries, flashcards, and more
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  disabled={tab.id !== 'upload' && !uploadedFile}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : uploadedFile || tab.id === 'upload'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'upload' && (
            <FileUpload onFileUploaded={setUploadedFile} />
          )}
          
          {activeTab === 'tree' && uploadedFile && (
            <KnowledgeTree uploadedFile={uploadedFile} />
          )}
          
          {activeTab === 'summaries' && uploadedFile && (
            <Summaries uploadedFile={uploadedFile} />
          )}
          
          {activeTab === 'flashcards' && uploadedFile && (
            <Flashcards uploadedFile={uploadedFile} />
          )}
          
          {activeTab === 'tutor' && uploadedFile && (
            <Tutor uploadedFile={uploadedFile} />
          )}
        </div>
      </div>
    </div>
  );
}
