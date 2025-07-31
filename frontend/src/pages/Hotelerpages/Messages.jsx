import React, { useState } from 'react';
import { Send, User, Clock, Search } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';

const Messages = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      guestName: 'Sarah Johnson',
      hotel: 'Grand Paradise Resort',
      lastMessage: 'Thank you for the quick response!',
      timestamp: '2 minutes ago',
      unread: true,
      messages: [
        { id: 1, sender: 'guest', content: 'Hello! I have a question about my upcoming reservation.', timestamp: '10:30 AM' },
        { id: 2, sender: 'hotel', content: 'Hello Sarah! I\'d be happy to help. What would you like to know?', timestamp: '10:32 AM' },
        { id: 3, sender: 'guest', content: 'Can I request a room with an ocean view?', timestamp: '10:35 AM' },
        { id: 4, sender: 'hotel', content: 'Absolutely! I\'ve updated your reservation to include an ocean view room at no extra charge.', timestamp: '10:37 AM' },
        { id: 5, sender: 'guest', content: 'Thank you for the quick response!', timestamp: '10:40 AM' },
      ]
    },
    {
      id: 2,
      guestName: 'Michael Chen',
      hotel: 'Ocean View Hotel',
      lastMessage: 'What time is checkout?',
      timestamp: '1 hour ago',
      unread: false,
      messages: [
        { id: 1, sender: 'guest', content: 'Hi there! What time is checkout?', timestamp: '9:15 AM' },
        { id: 2, sender: 'hotel', content: 'Hello Michael! Checkout is at 11:00 AM, but we can arrange a late checkout if needed.', timestamp: '9:20 AM' },
      ]
    },
    {
      id: 3,
      guestName: 'Emma Wilson',
      hotel: 'Mountain Lodge',
      lastMessage: 'The room service was excellent!',
      timestamp: '3 hours ago',
      unread: false,
      messages: [
        { id: 1, sender: 'guest', content: 'Just wanted to say the room service was excellent!', timestamp: '7:45 AM' },
        { id: 2, sender: 'hotel', content: 'Thank you so much for the feedback, Emma! We\'re delighted to hear you enjoyed your stay.', timestamp: '7:50 AM' },
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: selectedConversation.messages.length + 1,
        sender: 'hotel',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, message], lastMessage: newMessage }
          : conv
      ));

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, message]
      });

      setNewMessage('');
    }
  };

  const markAsRead = (conversationId) => {
    setConversations(conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unread: false } : conv
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-gray-600">Communicate with your guests</p>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-96 lg:h-[600px]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    markAsRead(conversation.id);
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{conversation.guestName}</h4>
                        <p className="text-xs text-gray-500">{conversation.hotel}</p>
                      </div>
                    </div>
                    {conversation.unread && (
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden lg:flex flex-col flex-1">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{selectedConversation.guestName}</h4>
                  <p className="text-xs text-gray-500">{selectedConversation.hotel}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'hotel' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'hotel'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'hotel' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;