"use client";

import { useState } from "react";
import Link from "next/link";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { Gavel, History, Check, User, Info, TrendingDown } from "lucide-react";

export default function AuctionsPage() {
    const { groups, getMembersInGroup, recordAuction, getAuctionsByGroup } = useChitContext();
    const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || "");
    const [winnerId, setWinnerId] = useState<string>("");
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [month, setMonth] = useState<number>(1);

    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    const groupMembers = selectedGroup ? getMembersInGroup(selectedGroup.id) : [];
    const groupAuctions = selectedGroup ? getAuctionsByGroup(selectedGroup.id) : [];

    const handleRecordAuction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroupId || !winnerId || bidAmount <= 0) return;

        recordAuction({
            groupId: selectedGroupId,
            winnerMemberId: winnerId,
            bidAmount: bidAmount,
            month: month,
        });

        // Reset status
        setWinnerId("");
        setBidAmount(0);
        setMonth(prev => Math.min(prev + 1, selectedGroup?.totalMembers || 12));
        alert("Auction recorded successfully!");
    };

    if (groups.length === 0) {
        return (
            <div className={styles.container}>
                <h1>Auctions</h1>
                <p>You need to create at least one group before you can conduct auctions.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Auctions & Bidding</h1>
                <p className={styles.subtitle}>Conduct live auctions and distribute dividends</p>
            </header>

            <div className={styles.mainGrid}>
                <div className={styles.leftCol}>
                    <Card title="Select Group" className={styles.groupCard}>
                        <div className={styles.groupList}>
                            {groups.map((group) => (
                                <button
                                    key={group.id}
                                    className={`${styles.groupItem} ${selectedGroupId === group.id ? styles.active : ""}`}
                                    onClick={() => setSelectedGroupId(group.id)}
                                >
                                    <div className={styles.groupIcon}>G</div>
                                    <div className={styles.groupInfo}>
                                        <span className={styles.groupName}>{group.name}</span>
                                        <span className={styles.groupSubtitle}>₹ {group.chitAmount.toLocaleString()}</span>
                                    </div>
                                    {selectedGroupId === group.id && <Check size={18} className={styles.checkIcon} />}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card title="Auction History" className={styles.historyCard}>
                        {groupAuctions.length === 0 ? (
                            <div className={styles.emptyHistory}>
                                <History size={32} className={styles.historyIcon} />
                                <p>No auctions conducted for this group yet.</p>
                            </div>
                        ) : (
                            <div className={styles.historyList}>
                                {groupAuctions.map((auction) => (
                                    <div key={auction.id} className={styles.historyItem}>
                                        <div className={styles.historyHeader}>
                                            <span className={styles.historyDate}>{auction.date} • <strong style={{ color: 'var(--primary-color)' }}>Month {auction.month}</strong></span>
                                            <span className={styles.historyBid}>₹ {auction.bidAmount.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.historyDetail}>
                                            <span className={styles.historyWinner}>Winner: {groupMembers.find(m => m.id === auction.winnerMemberId)?.name || 'Unknown'}</span>
                                            <span className={styles.historyDividend}>Dividend: ₹ {auction.dividendPerMember.toFixed(2)} / member</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className={styles.rightCol}>
                    <Card title="Record New Auction" className={styles.auctionFormCard}>
                        {groupMembers.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Info size={40} className={styles.infoIcon} />
                                <p>Please link members to this group before conducting auctions.</p>
                                <Link href="/linking" className={styles.linkAction}>Link Members</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleRecordAuction} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="month">Auction Month</label>
                                    <select
                                        id="month"
                                        value={month}
                                        onChange={(e) => setMonth(Number(e.target.value))}
                                        required
                                        className={styles.select}
                                    >
                                        {Array.from({ length: selectedGroup?.totalMembers || 12 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>Month {num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="winner">Winnder Member</label>
                                    <select
                                        id="winner"
                                        value={winnerId}
                                        onChange={(e) => setWinnerId(e.target.value)}
                                        required
                                        className={styles.select}
                                    >
                                        <option value="">Select Winner</option>
                                        {groupMembers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="bid">Auction Bid Amount (₹)</label>
                                    <div className={styles.inputContainer}>
                                        <TrendingDown size={18} className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            id="bid"
                                            value={bidAmount || ""}
                                            onChange={(e) => setBidAmount(Number(e.target.value))}
                                            placeholder="Enter bid amount"
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <p className={styles.helperText}>
                                        This amount will be evenly divided as dividend among all {selectedGroup?.totalMembers} members.
                                    </p>
                                </div>

                                {bidAmount > 0 && (
                                    <div className={styles.summaryBox}>
                                        <div className={styles.summaryItem}>
                                            <span>Estimated Dividend:</span>
                                            <span className={styles.summaryValue}>₹ {(bidAmount / (selectedGroup?.totalMembers || 1)).toFixed(2)} / member</span>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className={styles.submitButton}>
                                    <Gavel size={20} />
                                    <span>Record Auction</span>
                                </button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
