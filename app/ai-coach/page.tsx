'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AiCoach = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Simple but effective trading responses
    if (input.includes('risk') || input.includes('loss')) {
      return `🛡️ **Risk Management**

• **Position Sizing**: Risk only 1-2% of your total trading capital per trade
• **Stop Loss**: Always set stop-loss orders
• **Risk/Reward**: Aim for 1:3 ratio or better
• **Portfolio**: Never risk more than 10% total capital`;
    }
    
    if (input.includes('technical') || input.includes('chart') || input.includes('analysis')) {
      return `📊 **Technical Analysis**

• **Support & Resistance**: Key price levels for entries/exits
• **Trend Analysis**: Identify market direction (up/down/sideways)
• **Indicators**: Use RSI, Moving Averages, Volume
• **Chart Patterns**: Candlesticks, Head & Shoulders`;
    }
    
    if (input.includes('beginner') || input.includes('start') || input.includes('learn')) {
      return `🚀 **Trading for Beginners**

**Step 1**: Learn market basics
**Step 2**: Practice with paper trading
**Step 3**: Start small, learn risk management
• **Golden Rule**: Education first, profits second`;
    }
    
    if (input.includes('strategy') || input.includes('plan')) {
      return `📋 **Trading Strategy**

• **Entry Rules**: Clear conditions for entering trades
• **Escape Rules**: Defined profit targets and stop-loss
• **Risk Management**: Position sizing and loss limits
• **Success Factor**: Discipline + risk management = profits`;
    }
    
    if (input.includes('psychology') || input.includes('emotion') || input.includes('fear')) {
      return `🧠 **Trading Psychology**

• **Discipline**: Stick to your trading plan
• **Patience**: Wait for high-probability setups
• **Emotional Control**: Don't let fear/greed drive decisions
• **Growth Mindset**: Learn from every trade`;
    }
    
    // Default response
    return `🤖 **AI Trading Coach**

I can help you with:

📊 Technical Analysis
🛡️ Risk Management
🧠 Trading Psychology
📚 Trading Strategies

Ask me about any trading topic!`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input.trim()),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-purple-100">
      <div className="main-container inner py-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-dark-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <Bot className="w-8 h-8 text-green-500" />
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Trading Coach
              </h1>
              <p className="text-purple-100/80 mt-1">
                Professional trading guidance and education
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Trading Tips */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Quick Trading Tips
              </h3>
              
              <div className="space-y-3">
                <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                  <h4 className="text-sm font-medium text-purple-100 mb-2">💡 Position Sizing</h4>
                  <p className="text-sm text-purple-100/80">Risk only 1-2% of total capital per trade</p>
                </div>
                
                <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                  <h4 className="text-sm font-medium text-purple-100 mb-2">🛡️ Stop Loss</h4>
                  <p className="text-sm text-purple-100/80">Always set stop-loss orders before entering trades</p>
                </div>
                
                <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                  <h4 className="text-sm font-medium text-purple-100 mb-2">📊 Risk/Reward</h4>
                  <p className="text-sm text-purple-100/80">Aim for minimum 1:3 risk-to-reward ratio</p>
                </div>
                
                <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                  <h4 className="text-sm font-medium text-purple-100 mb-2">🧠 Psychology</h4>
                  <p className="text-sm text-purple-100/80">Control emotions, stick to your trading plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold">Trading Assistant</h2>
              </div>
              
              {/* Chat Messages */}
              <div className="bg-dark-900 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-dark-900" />
                        </div>
                      </div>
                    )}
                    <div
                        className={`max-w-xs px-4 py-3 rounded-lg ${
                          message.role === 'user'
                              ? 'bg-purple-600 text-purple-100'
                              : 'bg-dark-700 text-purple-100'
                        }`}
                      >
                      {message.role === 'user' && (
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-purple-300" />
                          <span className="text-xs opacity-70">You</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line break-words">{message.content}</div>
                      <div className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-100" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-dark-900 animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-dark-700 px-4 py-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-dark-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about trading strategies, risk management..."
                    className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-purple-100 placeholder-purple-100/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-purple-100 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  </div>
  );
};

export default AiCoach;
