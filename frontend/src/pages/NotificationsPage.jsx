import React from "react";
// src/pages/NotificationsPage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks';
import { Button, EmptyState } from '../components/common';
import { timeAgo } from '../utils';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell size={22} className="text-amber-400" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-slate-400 text-sm mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck size={15} /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
      ) : (
        <AnimatePresence>
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors
                ${n.isRead ? 'bg-[#1e293b] border-slate-800' : 'bg-amber-500/5 border-amber-500/20'}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.isRead ? 'bg-slate-600' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{n.title}</p>
                <p className="text-slate-400 text-sm mt-0.5">{n.body}</p>
                <p className="text-slate-500 text-xs mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
