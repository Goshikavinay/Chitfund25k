"use client";

import { useState } from "react";
import { Bell, Search, User, ChevronDown, Check, LogOut, Settings } from "lucide-react";
import { useChitContext } from "@/context/ChitContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
    const { currentUser, notifications, markNotificationAsRead, logout } = useChitContext();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const router = useRouter();

    const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
    const unreadCount = userNotifications.filter(n => !n.read).length;

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className={styles.header}>
            <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search schemes, members, auctions..."
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.rightSection}>
                <div style={{ position: 'relative' }}>
                    <button
                        className={styles.iconButton}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div className={styles.notificationDropdown}>
                            <div className={styles.notificationHeader}>
                                <h4>Notifications</h4>
                                {unreadCount > 0 && (
                                    <button
                                        style={{ fontSize: '0.75rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        onClick={() => {
                                            userNotifications.forEach(n => !n.read && markNotificationAsRead(n.id));
                                        }}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className={styles.notificationList}>
                                {userNotifications.length === 0 ? (
                                    <div className={styles.emptyNotif}>No notifications yet</div>
                                ) : (
                                    userNotifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`${styles.notificationItem} ${!notif.read ? styles.unread : ""}`}
                                            onClick={() => markNotificationAsRead(notif.id)}
                                        >
                                            <div className={styles.notifTitle}>{notif.title}</div>
                                            <div className={styles.notifMessage}>{notif.message}</div>
                                            <div className={styles.notifDate}>
                                                {new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        className={styles.profile}
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                    >
                        <div className={styles.avatar}>
                            <User size={20} />
                        </div>
                        <div className={styles.profileInfo}>
                            <span className={styles.name}>{currentUser?.name || "Guest"}</span>
                            <span className={styles.role}>
                                {currentUser?.role === "owner" ? "Owner" : currentUser?.role === "member" ? "User" : "Manager"}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`${styles.chevron} ${showProfile ? styles.active : ""}`} />
                    </div>

                    {showProfile && (
                        <div className={styles.profileDropdown}>
                            <div className={styles.dropdownHeader}>
                                <p className={styles.userEmail}>{currentUser?.email}</p>
                                <p className={styles.userPhone}>{currentUser?.phone}</p>
                            </div>
                            <div className={styles.dropdownMenu}>
                                <Link href="/profile" className={styles.dropdownItem} onClick={() => setShowProfile(false)}>
                                    <User size={16} />
                                    <span>My Profile</span>
                                </Link>
                                <Link href="/settings" className={styles.dropdownItem} onClick={() => setShowProfile(false)}>
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </Link>
                                <hr className={styles.divider} />
                                <button className={styles.dropdownItem} onClick={handleLogout} style={{ color: '#ef4444' }}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
