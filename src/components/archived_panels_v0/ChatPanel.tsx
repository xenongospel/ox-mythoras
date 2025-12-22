import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  type: 'system' | 'guild' | 'trade' | 'local' | 'whisper';
  timestamp: Date;
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'System',
    message: 'Welcome to Mythoras!',
    type: 'system',
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: '2',
    sender: 'DragonSlayer99',
    message: 'LF group for Mystic Dungeon',
    type: 'local',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '3',
    sender: 'GuildMaster',
    message: 'Guild raid tonight at 8 PM!',
    type: 'guild',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '4',
    sender: 'TraderJoe',
    message: 'WTS Legendary Dragon Scale - 500g',
    type: 'trade',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '5',
    sender: 'MysticMage',
    message: 'Anyone know where to find Crystal Flowers?',
    type: 'local',
    timestamp: new Date(Date.now() - 30000)
  }
];

const CHAT_COLORS = {
  system: 'text-yellow-300',
  guild: 'text-green-300',
  trade: 'text-cyan-300',
  local: 'text-white',
  whisper: 'text-purple-300',
};

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<string>('local');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: currentMessage,
      type: activeChannel as any,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const channels = [
    { id: 'local', name: 'Local', color: 'text-white' },
    { id: 'guild', name: 'Guild', color: 'text-green-300' },
    { id: 'trade', name: 'Trade', color: 'text-cyan-300' },
    { id: 'whisper', name: 'Whisper', color: 'text-purple-300' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800/40 to-gray-900/40">
      {/* Channel Tabs */}
      <div className="flex border-b border-purple-600/30 bg-purple-800/30">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`
              px-3 py-2 text-xs font-medium transition-colors border-b-2
              ${activeChannel === channel.id
                ? 'border-yellow-400 bg-purple-700/50 text-yellow-200'
                : 'border-transparent hover:bg-purple-800/50 text-purple-300'
              }
            `}
          >
            {channel.name}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {messages
          .filter(msg => activeChannel === 'local' || msg.type === activeChannel)
          .map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-purple-400">
                  [{formatTime(message.timestamp)}]
                </span>
                <span className={`text-xs font-medium ${CHAT_COLORS[message.type]}`}>
                  [{message.type.toUpperCase()}]
                </span>
                <span className="text-sm font-medium text-yellow-200">
                  {message.sender}:
                </span>
              </div>
              <span className={`text-sm pl-4 ${CHAT_COLORS[message.type]}`}>
                {message.message}
              </span>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-purple-600/30 bg-purple-800/30">
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Type in ${activeChannel}...`}
            className="flex-1 bg-purple-800/50 border-purple-600/50 text-purple-100 placeholder:text-purple-400 text-sm"
          />
          <Button
            onClick={sendMessage}
            size="sm"
            className="bg-purple-700 hover:bg-purple-600 px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};



