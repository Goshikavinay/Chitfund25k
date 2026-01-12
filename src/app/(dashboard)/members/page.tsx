"use client";

import Link from "next/link";
import { Plus, User, Phone, MapPin, Calendar, Trash2, Edit } from "lucide-react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";

export default function MembersPage() {
    const { members, deleteMember } = useChitContext();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Members</h1>
                    <p className={styles.subheading}>Manage your chit subscribers</p>
                </div>
                <Link href="/members/create" className={styles.createButton}>
                    <Plus size={20} />
                    <span>New Member</span>
                </Link>
            </div>

            {members.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👥</div>
                    <h3 className={styles.emptyTitle}>No members found</h3>
                    <p className={styles.emptyText}>Add your first member to get started.</p>
                    <Link href="/members/create" className={styles.createButton}>
                        Add Member
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {members.map((member) => (
                        <Card key={member.id} className={styles.memberCard}>
                            <div className={styles.memberHeader}>
                                <div className={styles.avatar}>
                                    {member.name.charAt(0)}
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3 className={styles.memberName}>{member.name}</h3>
                                    <div className={styles.memberContact}>
                                        <Phone size={14} />
                                        <span>{member.phone}</span>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <Link href={`/members/edit/${member.id}`} className={styles.iconAction} title="Edit">
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteMember(member.id)}
                                        className={`${styles.iconAction} ${styles.delete}`}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.memberDetails}>
                                <div className={styles.detailRow}>
                                    <MapPin size={16} className={styles.detailIcon} />
                                    <span className={styles.detailText}>{member.address}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <Calendar size={16} className={styles.detailIcon} />
                                    <span className={styles.detailText}>Joined: {member.joinedDate}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
