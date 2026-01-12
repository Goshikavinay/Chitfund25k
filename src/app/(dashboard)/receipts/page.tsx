"use client";

import { useState } from "react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { Printer, Search, FileCheck, User } from "lucide-react";

export default function ReceiptsPage() {
    const { groups, members, auctions, getPaymentsByAuction, currentUser } = useChitContext();
    const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || "");
    const [selectedAuctionId, setSelectedAuctionId] = useState<string>("");

    const groupAuctions = auctions.filter(a => a.groupId === selectedGroupId);
    const currentAuction = selectedAuctionId
        ? auctions.find(a => a.id === selectedAuctionId)
        : groupAuctions[groupAuctions.length - 1];

    let auctionPayments = currentAuction ? getPaymentsByAuction(currentAuction.id).filter(p => p.status === "Paid") : [];

    // Personalization: If member, only show their own paid receipts
    if (currentUser?.role === "member") {
        auctionPayments = auctionPayments.filter(p => p.memberId === currentUser.memberId);
    }

    const handlePrint = () => {
        window.print();
    };

    if (groups.length === 0) {
        return (
            <div className={styles.container}>
                <h1>Receipts</h1>
                <p>No groups available to generate receipts.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1 className={styles.title}>Payment Receipts</h1>
                    <p className={styles.subtitle}>Generate and print receipts for paid installments</p>
                </div>
                {auctionPayments.length > 0 && currentUser?.role === "owner" && (
                    <button className={styles.printAllButton} onClick={handlePrint}>
                        <Printer size={18} />
                        <span>Print All Paid</span>
                    </button>
                )}
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
                        <label>Auction</label>
                        <select
                            value={selectedAuctionId || currentAuction?.id || ""}
                            onChange={(e) => setSelectedAuctionId(e.target.value)}
                            className={styles.select}
                            disabled={groupAuctions.length === 0}
                        >
                            {groupAuctions.length === 0 ? (
                                <option>No auctions found</option>
                            ) : (
                                groupAuctions.map(a => <option key={a.id} value={a.id}>Month {a.month} ({a.date})</option>)
                            )}
                        </select>
                    </div>
                </div>
            </Card>

            <div className={styles.receiptList}>
                {auctionPayments.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FileCheck size={48} className={styles.emptyIcon} />
                        <p>No paid installments found for this auction.</p>
                    </div>
                ) : (
                    auctionPayments.map((payment) => {
                        const member = members.find(m => m.id === payment.memberId);
                        const group = groups.find(g => g.id === selectedGroupId);
                        return (
                            <div key={payment.id} className={styles.receiptCard}>
                                <div className={styles.receiptHeader}>
                                    <div className={styles.companyInfo}>
                                        <h3 className={styles.companyName}>Vinnu's Chit</h3>
                                        <p className={styles.receiptType}>Official Payment Receipt</p>
                                    </div>
                                    <div className={styles.receiptNo}>
                                        <span>Receipt #: {payment.id.substring(0, 8).toUpperCase()}</span>
                                        <span>Date: {payment.date}</span>
                                    </div>
                                </div>

                                <div className={styles.receiptBody}>
                                    <div className={styles.receiptRow}>
                                        <span className={styles.receiptLabel}>Member Name:</span>
                                        <span className={styles.receiptValue}>{member?.name}</span>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span className={styles.receiptLabel}>Chit Group:</span>
                                        <span className={styles.receiptValue}>{group?.name}</span>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span className={styles.receiptLabel}>Auction:</span>
                                        <span className={styles.receiptValue}>Month {currentAuction?.month} ({currentAuction?.date})</span>
                                    </div>
                                    <hr className={styles.divider} />
                                    <div className={`${styles.receiptRow} ${styles.totalRow}`}>
                                        <span className={styles.receiptLabel}>Amount Received:</span>
                                        <span className={styles.amountValue}>₹ {payment.amount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className={styles.receiptFooter}>
                                    <div className={styles.signature}>
                                        <div className={styles.sigLine}></div>
                                        <span>Authorized Signature</span>
                                    </div>
                                    <button className={`${styles.printButton} no-print`} onClick={() => window.print()}>
                                        <Printer size={16} />
                                        <span>Print Receipt</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          .${styles.receiptList}, .${styles.receiptList} * { visibility: visible; }
          .${styles.receiptCard} { 
            page-break-after: always;
            border: 2px solid #000 !important;
            margin-bottom: 2rem;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
        </div>
    );
}
