"use client";

import Link from "next/link";
import { Plus, UserCheck, Phone, Building, Trash2, Edit } from "lucide-react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";

export default function OwnersPage() {
    const { owners, deleteOwner, authAccounts, approveAccount, deleteAuthAccount } = useChitContext();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Owners</h1>
                    <p className={styles.subheading}>Manage chit fund group owners</p>
                </div>
                <Link href="/owners/create" className={styles.createButton}>
                    <Plus size={20} />
                    <span>New Owner</span>
                </Link>
            </div>

            {owners.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏢</div>
                    <h3 className={styles.emptyTitle}>No owners found</h3>
                    <p className={styles.emptyText}>Add your first owner to get started.</p>
                    <Link href="/owners/create" className={styles.createButton}>
                        Add Owner
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {owners.map((owner) => (
                        <Card key={owner.id} className={styles.ownerCard}>
                            <div className={styles.ownerHeader}>
                                <div className={styles.avatar}>
                                    {owner.name.charAt(0)}
                                </div>
                                <div className={styles.ownerInfo}>
                                    <h3 className={styles.ownerName}>{owner.name}</h3>
                                    <div className={styles.ownerCompany}>
                                        <Building size={14} />
                                        <span>{owner.companyName}</span>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <Link href={`/owners/edit/${owner.id}`} className={styles.iconAction} title="Edit">
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteOwner(owner.id)}
                                        className={`${styles.iconAction} ${styles.delete}`}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.ownerDetails}>
                                <div className={styles.detailRow}>
                                    <Phone size={16} className={styles.detailIcon} />
                                    <span className={styles.detailText}>{owner.phone}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className={styles.accountsSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>User Account Management</h2>
                </div>

                {/* Pending Approvals Section */}
                {authAccounts.some(acc => acc.isApproved !== true && acc.role?.toLowerCase() !== 'owner') && (
                    <div className={styles.subSection}>
                        <h3 className={styles.subSectionTitle}>Awaiting Approval</h3>
                        <div className={styles.accountsGrid}>
                            {authAccounts.filter(acc => acc.isApproved !== true && acc.role?.toLowerCase() !== 'owner').map((account) => (
                                <Card key={account.id} className={`${styles.accountCard} ${styles.pendingCard}`}>
                                    <div className={styles.accountTop}>
                                        <div className={`${styles.roleBadge} ${styles.member}`}>
                                            MEMBER
                                        </div>
                                        <div className={styles.pendingStatusBadge}>
                                            PENDING ACTION
                                        </div>
                                        <div className={styles.accountAvatar}>
                                            {account.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className={styles.accountContent}>
                                        <h4 className={styles.accountName}>{account.name}</h4>
                                        <p className={styles.username}>@{account.username}</p>

                                        <div className={styles.accountDetails}>
                                            <div className={styles.detailItem}>
                                                <Phone size={14} />
                                                <span>{account.phone}</span>
                                            </div>
                                        </div>

                                        <div className={styles.approvalActions}>
                                            <button
                                                className={styles.approveActionButton}
                                                onClick={() => approveAccount(account.id)}
                                            >
                                                <UserCheck size={16} />
                                                <span>Approve User</span>
                                            </button>
                                            <button
                                                className={styles.rejectActionButton}
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to reject this registration?`)) {
                                                        deleteAuthAccount(account.id);
                                                    }
                                                }}
                                            >
                                                <span>Reject Registration</span>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Accounts Section */}
                <div className={styles.subSection}>
                    <h3 className={styles.subSectionTitle}>Active Accounts</h3>
                    <div className={styles.accountsGrid}>
                        {authAccounts.filter(acc => acc.isApproved === true || acc.role?.toLowerCase() === 'owner').map((account) => (
                            <Card key={account.id} className={styles.accountCard}>
                                <div className={styles.accountTop}>
                                    <div className={`${styles.roleBadge} ${styles[account.role.toLowerCase()]}`}>
                                        {account.role}
                                    </div>
                                    <div className={styles.approvalStatus}>
                                        {account.role.toLowerCase() === 'owner' ? (
                                            <span className={styles.verifiedLabel}>Verified Owner</span>
                                        ) : (
                                            <span className={styles.approvedLabel}>Approved</span>
                                        )}
                                    </div>
                                    <div className={styles.accountAvatar}>
                                        {account.name.charAt(0)}
                                    </div>
                                </div>
                                <div className={styles.accountContent}>
                                    <h4 className={styles.accountName}>{account.name}</h4>
                                    <p className={styles.username}>@{account.username}</p>

                                    <div className={styles.accountDetails}>
                                        <div className={styles.detailItem}>
                                            <Phone size={14} />
                                            <span>{account.phone}</span>
                                        </div>
                                        {account.email && (
                                            <div className={styles.detailItem}>
                                                <Building size={14} />
                                                <span>{account.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.accountActions}>
                                        <button
                                            className={styles.deleteAuthButton}
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this user account?")) {
                                                    deleteAuthAccount(account.id);
                                                }
                                            }}
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
