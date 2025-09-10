import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Inbox, 
  MessageSquare, 
  Bell, 
  TrendingUp, 
  User, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Share,
  Calendar,
  Newspaper
} from 'lucide-react';

interface Message {
  id: string;
  type: 'direct' | 'notification' | 'system';
  from: string;
  subject?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SocialPost {
  id: string;
  type: 'news' | 'result' | 'interview' | 'social';
  author: string;
  authorRole: 'technician' | 'pundit' | 'journalist' | 'system';
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

const MESSAGES: Message[] = [
  {
    id: '1',
    type: 'system',
    from: 'Tournament System',
    subject: 'Registration Confirmed',
    content: 'Your registration for the Eastern Regional Cup has been confirmed. Tournament begins in 3 days.',
    timestamp: new Date(2024, 7, 15, 10, 30),
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'direct',
    from: 'Kyle Trent',
    subject: 'Great match yesterday!',
    content: 'Hey! That was an incredible battle yesterday. Your Pyraxis really caught me off guard with that flame combo. Want to practice together sometime?',
    timestamp: new Date(2024, 7, 14, 16, 45),
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'notification',
    from: 'Ranking System',
    content: 'You have moved up 3 positions in the regional rankings! Current rank: #47',
    timestamp: new Date(2024, 7, 14, 12, 15),
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'system',
    from: 'Mythoras News',
    subject: 'Weekly Digest',
    content: 'This week in Mythoras: New legendary sightings, tournament updates, and more!',
    timestamp: new Date(2024, 7, 13, 8, 0),
    read: true,
    priority: 'low'
  }
];

const SOCIAL_FEED: SocialPost[] = [
  {
    id: '1',
    type: 'news',
    author: 'Mythoras Daily',
    authorRole: 'journalist',
    content: 'BREAKING: Legendary Void Dragon spotted in Shadow Woods! First confirmed sighting in over 50 years. Technicians are advised to exercise extreme caution.',
    timestamp: new Date(2024, 7, 15, 14, 30),
    likes: 127,
    comments: 45,
    shares: 23,
    tags: ['breaking', 'legendary', 'shadow-woods']
  },
  {
    id: '2',
    type: 'result',
    author: 'Tournament Central',
    authorRole: 'system',
    content: 'UPSET! Young upstart Brett Stunner defeats veteran Kyle Trent 3-1 in Eastern Conference playoffs. "I\'ve been preparing for this moment my whole life," says Stunner.',
    timestamp: new Date(2024, 7, 15, 11, 15),
    likes: 89,
    comments: 32,
    shares: 18,
    tags: ['upset', 'playoffs', 'eastern-conference']
  },
  {
    id: '3',
    type: 'interview',
    author: 'Gary Neville (Pundit)',
    authorRole: 'pundit',
    content: 'I\'ve been saying it for weeks - the current meta favors aggressive fire-type strategies. Traditional defensive play is becoming obsolete. Teams need to adapt or get left behind.',
    timestamp: new Date(2024, 7, 15, 9, 45),
    likes: 156,
    comments: 78,
    shares: 34,
    tags: ['meta', 'strategy', 'fire-types']
  },
  {
    id: '4',
    type: 'social',
    author: 'Champion Elena Voss',
    authorRole: 'technician',
    content: 'Amazing training session today! My team is ready for next week\'s championship defense. Special thanks to my sparring partners 💪 #ChampionMindset',
    timestamp: new Date(2024, 7, 14, 18, 20),
    likes: 234,
    comments: 67,
    shares: 45,
    tags: ['training', 'championship']
  },
  {
    id: '5',
    type: 'interview',
    author: 'Roy Keane (Analyst)',
    authorRole: 'pundit',
    content: 'The level of competition this season has been absolutely phenomenal. We\'re seeing innovation in creature combinations that would have been unthinkable just two years ago.',
    timestamp: new Date(2024, 7, 14, 15, 30),
    likes: 92,
    comments: 28,
    shares: 15,
    tags: ['analysis', 'innovation', 'season-review']
  },
  {
    id: '6',
    type: 'news',
    author: 'Tech Today',
    authorRole: 'journalist',
    content: 'New passive tree mechanics discovered! Players report finding hidden synergies between M.Y.T.H. attributes and creature evolution paths. Full analysis inside.',
    timestamp: new Date(2024, 7, 14, 12, 0),
    likes: 178,
    comments: 89,
    shares: 67,
    tags: ['discovery', 'passive-tree', 'myth-attribute']
  }
];

const PRIORITY_COLORS = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#ef4444'
};

const AUTHOR_COLORS = {
  technician: '#00ff88',
  pundit: '#f59e0b',
  journalist: '#3b82f6',
  system: '#8b5cf6'
};

export const InboxPanel: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('messages');

  const unreadCount = MESSAGES.filter(m => !m.read).length;

  const renderMessage = (message: Message) => {
    const isSelected = selectedMessage === message.id;
    
    return (
      <div
        key={message.id}
        onClick={() => setSelectedMessage(isSelected ? null : message.id)}
        className={`
          p-3 border-b border-gray-700 cursor-pointer transition-colors
          ${isSelected ? 'bg-gray-750' : 'hover:bg-gray-800'}
          ${!message.read ? 'border-l-4 border-l-green-400' : ''}
        `}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${!message.read ? 'text-white font-semibold' : 'text-gray-300'}`}>
                  {message.from}
                </span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PRIORITY_COLORS[message.priority] }}
                />
              </div>
              {message.subject && (
                <h4 className={`text-xs mt-1 ${!message.read ? 'text-gray-200' : 'text-gray-400'}`}>
                  {message.subject}
                </h4>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleDateString()}
            </span>
          </div>

          <p className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-400'} ${isSelected ? '' : 'truncate'}`}>
            {message.content}
          </p>

          {isSelected && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-xs">
                Reply
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-xs">
                Mark Read
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSocialPost = (post: SocialPost) => {
    const getPostIcon = () => {
      switch (post.type) {
        case 'news': return <Newspaper className="w-4 h-4" />;
        case 'result': return <Trophy className="w-4 h-4" />;
        case 'interview': return <MessageSquare className="w-4 h-4" />;
        case 'social': return <User className="w-4 h-4" />;
        default: return <MessageSquare className="w-4 h-4" />;
      }
    };

    return (
      <div key={post.id} className="p-4 border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: `${AUTHOR_COLORS[post.authorRole]}20`, color: AUTHOR_COLORS[post.authorRole] }}
            >
              {getPostIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-semibold"
                  style={{ color: AUTHOR_COLORS[post.authorRole] }}
                >
                  {post.author}
                </span>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                  {post.authorRole}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {post.timestamp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-300 leading-relaxed">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {post.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/10"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Engagement */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
              <Heart className="w-3 h-3" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-3 h-3" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <Share className="w-3 h-3" />
              <span>{post.shares}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="border-b border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-green-400" />
            <h3 className="text-green-400 uppercase">Inbox</h3>
            {unreadCount > 0 && (
              <Badge variant="outline" className="border-red-500 text-red-400 bg-red-500/10">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Live Feed
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-b border-gray-700">
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-gray-700 text-gray-300 relative"
            >
              Messages
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{unreadCount}</span>
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-gray-700 text-gray-300"
            >
              Social Feed
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-gray-700 text-gray-300"
            >
              Alerts
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="messages" className="m-0 h-full">
              <div className="divide-y divide-gray-700">
                {MESSAGES.map(renderMessage)}
              </div>
            </TabsContent>

            <TabsContent value="social" className="m-0 h-full">
              <div className="divide-y divide-gray-700">
                {SOCIAL_FEED.map(renderSocialPost)}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-4 m-0">
              <div className="text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new notifications</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-gray-700 p-2">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            Compose
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Button>
        </div>
      </div>
    </div>
  );
};