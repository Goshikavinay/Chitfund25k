"use client";

import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { Users, LayoutGrid, Calendar, Wallet } from "lucide-react";

export default function DashboardHome() {
    const { groups, members, auctions, payments, currentUser, linkages } = useChitContext();

    const totalCollection = payments
        .filter(p => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0);

    const isAdmin = currentUser?.role === "owner";

    // User specific stats
    const userPayments = payments.filter(p => p.memberId === currentUser?.id);
    const userPaidCount = userPayments.filter(p => p.status === "Paid").length;
    const userPendingCount = userPayments.filter(p => p.status === "Pending").length;

    // Find how many unique groups the user is enrolled in using linkages
    const userJoinedGroups = groups.filter(group => {
        const linkage = linkages.find(l => l.groupId === group.id);
        return linkage?.memberIds.includes(currentUser?.id || "");
    });

    const stats = isAdmin ? [
        { title: "Total Schemes", value: groups.length, icon: LayoutGrid, color: "var(--primary-color)" },
        { title: "Active Members", value: members.length, icon: Users, color: "var(--secondary-color)" },
        { title: "Auctions Held", value: auctions.length, icon: Calendar, color: "#10b981" },
        { title: "Total Collection", value: `₹ ${totalCollection.toLocaleString()}`, icon: Wallet, color: "#8b5cf6" },
    ] : [
        { title: "My Schemes", value: userJoinedGroups.length, icon: LayoutGrid, color: "var(--primary-color)" },
        { title: "Paid Payments", value: userPaidCount, icon: Wallet, color: "#10b981" },
        { title: "Pending Payments", value: userPendingCount, icon: Calendar, color: "#f59e0b" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Welcome back, {currentUser?.name}</h1>
                <p className={styles.subtitle}>
                    {isAdmin
                        ? "Here's what's happening with your chit funds today."
                        : "Track your chit schemes and payment status."}
                </p>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{stat.title}</span>
                                <span className={styles.statValue}>{stat.value}</span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {isAdmin && (
                <div className={styles.recentActivity}>
                    <Card title="Recent Auctions">
                        {auctions.length === 0 ? (
                            <p className={styles.emptyText}>No auctions conducted yet.</p>
                        ) : (
                            <div className={styles.activityList}>
                                {auctions.slice(-5).reverse().map((auction) => {
                                    const group = groups.find(g => g.id === auction.groupId);
                                    const winner = members.find(m => m.id === auction.winnerMemberId);
                                    return (
                                        <div key={auction.id} className={styles.activityItem}>
                                            <div className={styles.activityDot}></div>
                                            <div className={styles.activityContent}>
                                                <span className={styles.activityText}>
                                                    <strong>{winner?.name}</strong> won the auction for <strong>{group?.name}</strong>
                                                </span>
                                                <span className={styles.activityDate}>{auction.date} • Bid: ₹{auction.bidAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
