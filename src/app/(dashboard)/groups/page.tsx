"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";

export default function GroupsPage() {
    const { groups, deleteGroup, currentUser, enrollMember, isMemberInGroup } = useChitContext();
    const isAdmin = currentUser?.role === "owner";

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Schemes</h1>
                    <p className={styles.subheading}>{isAdmin ? "Manage your chit schemes" : "Available chit schemes"}</p>
                </div>
                {isAdmin && (
                    <Link href="/groups/create" className={styles.createButton}>
                        <Plus size={20} />
                        <span>New Group</span>
                    </Link>
                )}
            </div>

            {groups.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📂</div>
                    <h3 className={styles.emptyTitle}>No groups found</h3>
                    <p className={styles.emptyText}>{isAdmin ? "Create your first chit group to get started." : "Check back later for new schemes."}</p>
                    {isAdmin && (
                        <Link href="/groups/create" className={styles.createButton}>
                            Create Group
                        </Link>
                    )}
                </div>
            ) : (
                <div className={styles.grid}>
                    {groups.map((group) => {
                        const isEnrolled = currentUser ? isMemberInGroup(group.id, currentUser.id) : false;
                        const currentEnrolled = useChitContext().getMembersInGroup(group.id).length;
                        const remainingSlots = Math.max(0, group.totalMembers - currentEnrolled);

                        return (
                            <Card key={group.id} title={group.name} className={styles.groupCard}>
                                <div className={styles.cardRow}>
                                    <span className={styles.label}>Chit Amount</span>
                                    <span className={styles.value}>₹ {group.chitAmount.toLocaleString()}</span>
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.label}>Members</span>
                                    <span className={styles.value}>{group.totalMembers}</span>
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.label}>Frequency</span>
                                    <span className={styles.value}>{group.frequency}</span>
                                </div>
                                <div className={styles.slotsIndicator}>
                                    <div className={styles.slotsBar}>
                                        <div
                                            className={styles.slotsProgress}
                                            style={{ width: `${(currentEnrolled / group.totalMembers) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className={styles.slotsLabel}>
                                        {remainingSlots === 0 ? "Full Capacity" : `${remainingSlots} slots left`}
                                    </span>
                                </div>
                                <div className={styles.cardFooter}>
                                    {isAdmin ? (
                                        <div className={styles.cardActions}>
                                            <Link href={`/groups/edit/${group.id}`} className={styles.editAction}>
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteGroup(group.id)}
                                                className={styles.deleteAction}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.cardActions}>
                                            {isEnrolled ? (
                                                <span className={styles.enrolledStatus}>✓ Enrolled</span>
                                            ) : (
                                                <button
                                                    onClick={() => enrollMember(group.id, currentUser!.id)}
                                                    className={styles.enrollButton}
                                                >
                                                    Enroll into Scheme
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <Link href={`/groups/${group.id}`} className={styles.viewLink}>
                                        View Details
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
