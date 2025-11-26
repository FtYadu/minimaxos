'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageSquare, Send, Loader2, Trash2, FolderOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MODELS = [
  { id: 'MiniMax-M2', name: 'MiniMax M2', tokens: '204K context', description: 'Advanced reasoning' },
  { id: 'MiniMax-M2-Stable', name: 'MiniMax M2 Stable', tokens: '204K context', description: 'High concurrency' },
];

export default function TextPanel() {
  const { client, addGeneration, generations } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('MiniMax-M2');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [pendingGenId, setPendingGenId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Watch for pending generation completion
  useEffect(() => {
    if (pendingGenId) {
      const gen = generations.find(g => g.id === pendingGenId);
      if (gen && gen.status === 'completed' && gen.result) {
        const content = gen.result?.choices?.[0]?.message?.content || '';
        setMessages(prev => [...prev, { role: 'assistant', content }]);
        setPendingGenId(null);
        scrollToBottom();
      } else if (gen && gen.status === 'failed') {
        alert(`Generation failed: ${gen.error}`);
        setPendingGenId(null);
      }
    }
  }, [generations, pendingGenId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!client || !input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const genId = await addGeneration({
        type: 'text',
        status: 'queued',
        prompt: input.trim(),
        model,
        parameters: {
          temperature,
          max_tokens: maxTokens,
          messages: newMessages // Pass full history
        },
        createdAt: Date.now(),
      });

      setPendingGenId(genId);
      scrollToBottom();
    } catch (error: any) {
      console.error('Queue error:', error);
      alert(`Failed to add to queue: ${error.message}`);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Text Generation</h2>
          <p className="text-muted-foreground">
            Chat with MiniMax M2 - Advanced AI reasoning
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => useAppStore.getState().setActiveTab('media')}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
          >
            <FolderOpen className="w-4 h-4" />
            Gallery
          </button>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 glass-panel rounded-2xl flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div className="text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Start a conversation</p>
                  <p className="text-sm">Ask me anything!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] px-4 py-3 rounded-2xl
                      ${msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                      }
                    `}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-invert max-w-none">
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {pendingGenId && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                disabled={!!pendingGenId || !client}
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!!pendingGenId || !client || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {pendingGenId ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Model Selection */}
          <div className="glass-panel p-4 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Model</label>
            <div className="space-y-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all text-sm
                    ${model === m.id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                    }
                  `}
                >
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs opacity-70 mt-1">{m.tokens}</div>
                  <div className="text-xs opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="glass-panel p-4 rounded-2xl space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                min={1}
                max={128000}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max: 128K tokens
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="glass-panel p-4 rounded-2xl">
            <h4 className="text-sm font-medium mb-2">Context Window</h4>
            <p className="text-xs text-muted-foreground">
              204,800 tokens total (input + output combined)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
