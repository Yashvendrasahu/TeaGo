import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import TeaIllustration from '../components/TeaIllustration';
import {
  Sparkles,
  Send,
  Plus,
  User,
  Coffee,
  Heart,
  Flame,
  ArrowRight,
  UtensilsCrossed,
  Bot,
  Zap
} from 'lucide-react';

export default function AiAssistantPage() {
  const { products, addToCart, navigate, currentTable, backendStatus } = useApp();

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Arre hello dost! 👋 Kaise ho? Main hoon tumhara TeaGo Cafe Buddy${currentTable ? ` (Table ${currentTable})` : ''}! Batao aaj kya peene ya khane ka man hai — kadak masala chai, cold coffee, crispy snacks ya koi mast budget combo? Bas bolo, apun recommend karega! ☕🥪`,
      suggestedDrinkIds: ['tg-01', 'tg-08', 'tg-04']
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    'Bhai kuch mast recommend karo!',
    'Under ₹100 ka badhiya combo',
    'Ekdum kadak adrak chai',
    'Chai ke sath kya snack lu?',
    'Thandi cold coffee pilao',
    'Low sugar & healthy options'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userQuery = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Call Express Node.js Backend API running Gemini 3.8 Flash
      const res = await api.askAiSommelier(userQuery, currentTable || '01');

      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: res.reply,
            suggestedDrinkIds: res.suggestedDrinkIds || []
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I recommend trying our Special Kulhad Masala Chai paired with Crispy Samosas!',
            suggestedDrinkIds: ['tg-01', 'tg-08']
          }
        ]);
      }
    } catch (err) {
      console.error('AI assistant query error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Here are our top recommended cafe pairings for you!',
          suggestedDrinkIds: ['tg-01', 'tg-08']
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chip) => {
    setChatInput(chip);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>TeaGo Restaurant AI Sommelier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {currentTable ? `Table ${currentTable} Menu Assistant` : 'Digital Menu AI Sommelier'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Powered by Node.js, Express & Gemini AI — real-time menu knowledge & pairing suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {backendStatus?.online && (
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" />
              API Connected
            </span>
          )}
          {currentTable && (
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
              Table {currentTable} Active
            </span>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
        
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-[#2D4739] text-emerald-100'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2.5">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-200'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Embedded Product Suggestion Cards */}
                {msg.suggestedDrinkIds && msg.suggestedDrinkIds.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {msg.suggestedDrinkIds.map(dId => {
                      const item = products.find(p => p.id === dId);
                      if (!item) return null;
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-[#2D4739] transition-all flex items-center justify-between gap-3"
                        >
                          <div className="w-12 h-12 rounded-xl bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center border border-stone-200">
                            <TeaIllustration image={item.image} id={item.id} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-stone-900 truncate">{item.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-bold text-emerald-800">₹{item.price}</span>
                              <span className="text-[10px] text-stone-400 capitalize truncate">{item.categoryName || item.category}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(item, item.defaultOptions || {}, 1)}
                            className="p-2 rounded-xl bg-[#2D4739] text-white hover:bg-[#23382D] transition-all active:scale-95 shadow-2xs shrink-0"
                            title={`Add to order`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-stone-500 text-xs p-3 bg-stone-50 rounded-2xl border border-stone-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
              <span className="text-[11px] font-medium">Gemini AI Sommelier formulating personalized menu advice...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex gap-2 overflow-x-auto scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#2D4739] hover:text-[#2D4739] text-[11px] text-stone-700 font-medium whitespace-nowrap shadow-2xs transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 border-t border-stone-200 bg-white flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI Sommelier (e.g. 'What is the best spicy chai with snacks under ₹100?')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#2D4739] transition-all"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isTyping}
            className="px-5 py-2.5 rounded-xl bg-[#2D4739] text-white hover:bg-[#23382D] text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </form>

      </div>

    </div>
  );
}
