import React from "react";
// src/components/chat/ChatWindow.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { getMessagesAPI } from '../../api/chat.api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

function MessageBubble({ message, isOwn }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
    >
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 mt-auto">
          {message.sender?.name?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div className="max-w-[72%]">
        {!isOwn && (
          <p className="text-xs text-slate-400 mb-1 ml-1">{message.sender?.name}</p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
            ${isOwn
              ? 'bg-amber-500 text-white rounded-br-sm'
              : 'bg-slate-700 text-slate-100 rounded-bl-sm'}`}
        >
          {message.text}
        </div>
        <p className={`text-xs text-slate-500 mt-1 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ typers }) {
  if (!typers.length) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-xs text-slate-400">{typers[0]} is typing...</span>
    </motion.div>
  );
}

export default function ChatWindow({ roomId, bookingId }) {
  const { user }   = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [typers, setTypers]       = useState([]);
  const typingTimer               = useRef(null);
  const bottomRef                 = useRef(null);

  // Load history
  useEffect(() => {
    if (!roomId) return;
    getMessagesAPI(roomId).then((res) => {
      setMessages(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [roomId]);

  // Socket events
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('chat:join', { roomId });
    socket.emit('chat:read', { roomId });

    const onMessage  = (msg) => setMessages((prev) => [...prev, msg]);
    const onTyping   = ({ name }) => setTypers((prev) => prev.includes(name) ? prev : [...prev, name]);
    const onStopType = ({ userId }) => setTypers([]);
    const onRead     = () => {};

    socket.on('chat:message',   onMessage);
    socket.on('chat:typing',    onTyping);
    socket.on('chat:stopTyping',onStopType);
    socket.on('chat:read',      onRead);

    return () => {
      socket.emit('chat:leave', { roomId });
      socket.off('chat:message',    onMessage);
      socket.off('chat:typing',     onTyping);
      socket.off('chat:stopTyping', onStopType);
      socket.off('chat:read',       onRead);
    };
  }, [socket, roomId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typers]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending || !socket) return;
    setSending(true);
    clearTimeout(typingTimer.current);
    socket.emit('chat:stopTyping', { roomId });
    socket.emit('chat:send', { roomId, text: input.trim() });
    setInput('');
    setSending(false);
  }, [input, sending, socket, roomId]);

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    socket.emit('chat:typing', { roomId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit('chat:stopTyping', { roomId }), 1500);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-amber-400" size={28} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#1e293b]">
        <h3 className="font-semibold text-white text-sm">💬 Job Chat</h3>
        <p className="text-xs text-slate-400">Booking #{bookingId?.slice(-6)}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-sm mt-10">
            No messages yet. Say hello! 👋
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} isOwn={msg.sender?._id === user?._id} />
        ))}
        <TypingIndicator typers={typers} />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-800 bg-[#1e293b]">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={handleTyping}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500 max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
