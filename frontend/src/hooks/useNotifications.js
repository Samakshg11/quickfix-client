// src/hooks/useNotifications.js
import { useState, useCallback, useEffect } from 'react';
import { getNotificationsAPI, markAllReadAPI } from '../api/notification.api';
import { useSocket } from '../context/SocketContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const { socket } = useSocket();

  const fetch = useCallback(async () => {
    try {
      const res = await getNotificationsAPI({ limit: 30 });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (_) {}
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [socket]);

  return { notifications, unreadCount, fetch, markAllRead };
};
