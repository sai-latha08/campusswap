import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Search, ShieldCheck,
  ArrowLeft, Sparkles, User, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { connectSocket, getSocket } from '../../services/socket';
import { selectCurrentUser } from '../../store/authSlice';

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');

  const currentUser = useSelector(selectCurrentUser);
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (currentUser?._id) {
      const socket = connectSocket(currentUser._id);
      socketRef.current = socket;

      socket.on('online_users', (users) => {
        setOnlineUserIds(users);
      });

      socket.on('new_message', (msg) => {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        fetchConversations(false);
      });

      socket.on('user_typing', ({ userId, conversationId }) => {
        if (activePartner && String(activePartner._id) === String(userId)) {
          setIsPartnerTyping(true);
        }
      });

      socket.on('user_stop_typing', ({ userId }) => {
        if (activePartner && String(activePartner._id) === String(userId)) {
          setIsPartnerTyping(false);
        }
      });

      return () => {
        socket.off('online_users');
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('user_stop_typing');
      };
    }
  }, [currentUser, activePartner]);

  // Fetch conversations on load
  useEffect(() => {
    fetchConversations(true);
  }, []);

  // Handle URL query ?user=targetUserId
  useEffect(() => {
    if (targetUserId) {
      loadPartnerFromId(targetUserId);
    }
  }, [targetUserId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setLoadingConv(true);
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.data.conversations);
      }
    } catch (_) {
    } finally {
      if (showLoading) setLoadingConv(false);
    }
  };

  const loadPartnerFromId = async (partnerId) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/messages/${partnerId}`);
      if (res.data.success) {
        setActivePartner(res.data.data.partner);
        setMessages(res.data.data.messages);

        const convId = res.data.data.conversationId;
        socketRef.current?.emit('join_conversation', { conversationId: convId });
      }
    } catch (err) {
      toast.error('Failed to open chat with student');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setActivePartner(conv.partner);
    loadPartnerFromId(conv.partner._id);
  };

  const handleTypingChange = (e) => {
    setMessageText(e.target.value);

    if (activePartner && socketRef.current) {
      const convId = [String(currentUser._id), String(activePartner._id)].sort().join('_');
      socketRef.current.emit('typing', {
        conversationId: convId,
        userId: currentUser._id,
        userName: currentUser.name,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('stop_typing', {
          conversationId: convId,
          userId: currentUser._id,
        });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartner) return;

    const textToSend = messageText.trim();
    setMessageText('');

    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        senderId: currentUser._id,
        receiverId: activePartner._id,
        message: textToSend,
      });
      const convId = [String(currentUser._id), String(activePartner._id)].sort().join('_');
      socketRef.current.emit('stop_typing', {
        conversationId: convId,
        userId: currentUser._id,
      });
    } else {
      try {
        const res = await api.post('/messages', {
          receiverId: activePartner._id,
          message: textToSend,
        });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.data.message]);
        }
      } catch (err) {
        toast.error('Failed to send message');
      }
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.partner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.partner?.college?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPartnerOnline = activePartner && onlineUserIds.includes(String(activePartner._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex overflow-hidden">
        {/* ─── Left Panel: Conversations List ─────────────────────────── */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/60 ${
            activePartner ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 font-display mb-3">Campus Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare size={28} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                <p className="font-semibold text-slate-700">No active conversations</p>
                <p className="mt-1 text-[11px] text-slate-400">Send a message to a peer from their skill or rental listing.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activePartner && String(activePartner._id) === String(conv.partner?._id);
                const isOnline = onlineUserIds.includes(String(conv.partner?._id));

                return (
                  <button
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3.5 text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/80 border-r-3 border-indigo-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    {/* Avatar with Online Dot */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {conv.partner?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{conv.partner?.name}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.latestMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{conv.latestMessage}</p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Right Panel: Chat Stream Window ─────────────────────────── */}
        <div className={`flex-1 flex flex-col bg-white ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
          {activePartner ? (
            <>
              {/* Active Partner Header */}
              <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => setActivePartner(null)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {activePartner.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        isPartnerOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {activePartner.name}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ★ {activePartner.trustScore || 50} PTS
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isPartnerOnline ? (
                        <span className="text-emerald-600 font-semibold">● Online on campus</span>
                      ) : (
                        <span>{activePartner.college}</span>
                      )}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/users/${activePartner._id}`}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  View Profile
                </Link>
              </div>

              {/* Message History Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#fafaf9]">
                {loadingMessages ? (
                  <div className="py-20 text-center text-xs text-slate-400">Loading conversation history...</div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-400">
                    <Sparkles size={24} className="mx-auto mb-2 text-indigo-400 opacity-60" />
                    <p className="font-bold text-slate-800 text-sm">Start your conversation!</p>
                    <p className="text-[11px] text-slate-500 mt-1">Discuss skill exchange hours, item return dates, or lab meetings.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = String(msg.sender?._id || msg.sender) === String(currentUser?._id);
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-indigo-950 text-white rounded-br-xs'
                              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1 font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && (
                            <span className={msg.read ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
                              ✓✓
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isPartnerTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 italic py-1">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>{activePartner.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTypingChange}
                  placeholder={`Message ${activePartner.name}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-2xl transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 border border-indigo-100">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Select a Student to Chat</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Choose an ongoing conversation from the left or contact a student mentor directly from their skill profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
