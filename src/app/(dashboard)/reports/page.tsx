"use client";

import { useState } from "react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { FileText, CheckCircle, Clock, Search, Filter } from "lucide-react";

export default function ReportsPage() {
    const { groups, members, auctions, getPaymentsByAuction, togglePaymentStatus, currentUser } = useChitContext();
    const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || "");
    const [selectedAuctionId, setSelectedAuctionId] = useState<string>("");

    const groupAuctions = auctions.filter(a => a.groupId === selectedGroupId);
    const currentAuction = selectedAuctionId
        ? auctions.find(a => a.id === selectedAuctionId)
        : groupAuctions[groupAuctions.length - 1];

    let auctionPayments = currentAuction ? getPaymentsByAuction(currentAuction.id) : [];

    // Personalization: If member, only show their own payment
    if (currentUser?.role === "member") {
        auctionPayments = auctionPayments.filter(p => p.memberId === currentUser.memberId);
    }

    const totalPaid = auctionPayments.filter(p => p.status === "Paid").length;
    const totalPending = auctionPayments.length - totalPaid;

    if (groups.length === 0) {
        return (
            <div className={styles.container}>
                <h1>Reports</h1>
                <p>No groups available to generate reports.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Payment Reports</h1>
                <p className={styles.subtitle}>Track collection status for each auction</p>
            </header>

            <Card className={styles.filterCard}>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Group</label>
                        <select
                            value={selectedGroupId}
                            onChange={(e) => {
                                setSelectedGroupId(e.target.value);
                                setSelectedAuctionId("");
                            }}
                            className={styles.select}
                        >
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Auction Date</label>
                        <select
                            value={selectedAuctionId || currentAuction?.id || ""}
                            onChange={(e) => setSelectedAuctionId(e.target.value)}
                            className={styles.select}
                            disabled={groupAuctions.length === 0}
                        >
                            {groupAuctions.length === 0 ? (
                                <option>No auctions yet</option>
                            ) : (
                                groupAuctions.map(a => <option key={a.id} value={a.id}>Month {a.month} ({a.date})</option>)
                            )}
                        </select>
                    </div>
                </div>
            </Card>

            {currentAuction ? (
                <>
                    <div className={styles.statsSummary}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Total Members</span>
                            <span className={styles.statValue}>{auctionPayments.length}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Paid</span>
                            <span className={`${styles.statValue} ${styles.paid}`}>{totalPaid}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Pending</span>
                            <span className={`${styles.statValue} ${styles.pending}`}>{totalPending}</span>
                        </div>
                    </div>

                    <Card title="Member Payment Status">
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Member Name</th>
                                        <th>Installment Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auctionPayments.map((payment) => {
                                        const member = members.find(m => m.id === payment.memberId);
                                        return (
                                            <tr key={payment.id}>
                                                <td className={styles.memberName}>{member?.name || 'Unknown'}</td>
                                                <td>₹ {payment.amount.toFixed(2)}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${payment.status === "Paid" ? styles.paidBadge : styles.pendingBadge}`}>
                                                        {payment.status === "Paid" ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {currentUser?.role === "owner" ? (
                                                        <button
                                                            className={styles.toggleButton}
                                                            onClick={() => togglePaymentStatus(currentAuction.id, payment.memberId)}
                                                        >
                                                            Mark as {payment.status === "Paid" ? "Pending" : "Paid"}
                                                        </button>
                                                    ) : (
                                                        <span className={styles.viewOnly}>Verified by Admin</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            ) : (
                <div className={styles.emptyState}>
                    <FileText size={48} className={styles.emptyIcon} />
                    <p>No auction data found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
}
