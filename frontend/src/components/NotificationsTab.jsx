import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getUserNotifications, markAsRead } from '../services/notificationService';

const NotificationsTab = ({ userId, setUnreadCount, onNotificationClick }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetchNotifications();
    // }, [userId]);

    useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const data = await getUserNotifications(userId);
      if (Array.isArray(data) && data.length > 0 )  {
        const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
            setNotifications(sorted);
            const unreadCount = sorted.filter(n => !n.isRead).length;
            setUnreadCount(unreadCount);
            setLoading(false);
      }else{
        setLoading(false);
      }
    } catch (err) {
      console.log("Polling failed (server not live yet?)", err.message);
    }
  }, 4000);

  return () => clearInterval(interval);
}, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            const unreadCount = notifications.filter(n => n.id !== id && !n.isRead).length;
            setUnreadCount(unreadCount);

        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem]">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6" />
                <p className="font-bold text-gray-400">Loading notifications...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-32 glass rounded-[3rem] border-dashed">
                <Bell size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-900">No Notifications</h3>
                <p className="text-gray-500 mt-2 font-medium">You're all caught up! Updates will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => {
                const isCompleted = notification.message.includes("COMPLETED");
                const isConfirmed = notification.message.includes("CONFIRMED");

                return (
                    <div
                        key={notification.id}
                        className={`glass p-6 rounded-[2rem] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all duration-300 ${!notification.isRead ? 'border-l-4 border-l-indigo-600 bg-indigo-50/20 shadow-lg' : 'opacity-75 hover:opacity-100'}`}
                    >
                        <div className="flex gap-4 items-start flex-1">
                            <div className={`p-3 rounded-2xl shrink-0 ${!notification.isRead ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                {isCompleted ? <CheckCircle size={24} /> : isConfirmed ? <CheckCircle size={24} /> : <Bell size={24} />}
                            </div>
                            <div>
                                <p className="text-gray-800 font-bold text-lg leading-snug mb-2">{notification.message}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <Clock size={12} />
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                            {isCompleted && !notification.isRead && (
                                <button
                                    onClick={() => {
                                        onNotificationClick && onNotificationClick('history')
                                        handleMarkAsRead(notification.id)
                                    }
                                    }
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 whitespace-nowrap"
                                >
                                    Rate Service
                                </button>
                            )}

                            {!notification.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="bg-white/50 hover:bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border border-white/40 whitespace-nowrap"
                                >
                                    Mark as Read
                                </button>
                            )}
                            {notification.isRead && (
                                <div className="text- emerald-600 flex items-center gap-1 text-xs font-black uppercase tracking-widest opacity-50">
                                    <CheckCircle size={14} /> Read
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default NotificationsTab;
