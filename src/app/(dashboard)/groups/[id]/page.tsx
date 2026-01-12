"use client";

import { useParams } from "next/navigation";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { ArrowLeft, Users, Calendar, TrendingUp, Info } from "lucide-react";
import Link from "next/link";

export default function GroupDetailsPage() {
    const params = useParams();
    const { groups, enrollMember, isMemberInGroup, currentUser, getMembersInGroup } = useChitContext();
    const isAdmin = currentUser?.role === "owner";

    const group = groups.find((g) => g.id === params.id);
    const isEnrolled = group && currentUser ? isMemberInGroup(group.id, currentUser.id) : false;
    const allMembers = group ? getMembersInGroup(group.id) : [];
    const linkedMembers = isAdmin ? allMembers : [];
    const remainingSlots = group ? Math.max(0, group.totalMembers - allMembers.length) : 0;

    if (!group) {
        return (
            <div className={styles.container}>
                <Link href="/groups" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    <span>Back to Schemes</span>
                </Link>
                <div className={styles.notFound}>
                    <h1>Scheme Not Found</h1>
                    <p>The chit scheme you are looking for does not exist or has been deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/groups" className={styles.backLink}>
                        <ArrowLeft size={20} />
                        <span>Back to Schemes</span>
                    </Link>
                    <h1 className={styles.title}>{group.name}</h1>
                    <div className={styles.badge}>{group.frequency} Scheme</div>
                </div>
                <div className={styles.headerActions}>
                    {isAdmin ? (
                        <div className={styles.buttonGroup}>
                            <Link href="/linking" className={styles.addMembersButton}>
                                <Users size={18} />
                                <span>Add Members</span>
                            </Link>
                            <Link href={`/groups/edit/${group.id}`} className={styles.editButton}>
                                Edit Scheme
                            </Link>
                        </div>
                    ) : (
                        !isEnrolled && (
                            <button
                                onClick={() => {
                                    const error = enrollMember(group.id, currentUser!.id);
                                    if (error) {
                                        alert(error);
                                    } else {
                                        alert("Successfully enrolled in the scheme!");
                                        // The context update will re-trigger the isEnrolled check
                                    }
                                }}
                                className={styles.enrollButton}
                            >
                                Enroll into Scheme
                            </button>
                        )
                    )}
                </div>
            </header>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Chit Value</span>
                        <span className={styles.statValue}>₹ {group.chitAmount.toLocaleString()}</span>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--secondary-color)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Members</span>
                        <span className={styles.statValue}>{group.totalMembers}</span>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <Calendar size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Installment</span>
                        <span className={styles.statValue}>₹ {group.installmentAmount.toLocaleString()}</span>
                    </div>
                </Card>
            </div>

            <div className={styles.detailsGrid}>
                <section className={styles.mainSection}>
                    <Card title="Scheme Overview" className={styles.summaryCard}>
                        <div className={styles.overviewContent}>
                            <div className={styles.overviewItem}>
                                <div className={styles.overviewIcon}><Info size={20} /></div>
                                <div className={styles.overviewText}>
                                    <p>This is a <strong>{group.frequency}</strong> chit fund for <strong>₹{group.chitAmount.toLocaleString()}</strong>.</p>
                                    <p>The dividend will be distributed among <strong>{group.totalMembers}</strong> participants after each successful auction.</p>
                                </div>
                            </div>

                            {!isEnrolled && remainingSlots > 0 && (
                                <div className={styles.slotsBanner}>
                                    <div className={styles.slotsIcon}>🕒</div>
                                    <div className={styles.slotsText}>
                                        <strong>{remainingSlots} slots remaining</strong>
                                        <span>Join now! {remainingSlots} more members required to start this chit.</span>
                                    </div>
                                </div>
                            )}

                            {isEnrolled && (
                                <div className={styles.enrolledBanner}>
                                    <div className={styles.bannerIcon}>✓</div>
                                    <div className={styles.bannerText}>
                                        <strong>You are enrolled in this scheme</strong>
                                        <span>Track your statuses in the Reports section.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {isAdmin && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <Card title="Participant List" action={<span className={styles.countBadge}>{linkedMembers.length} Members</span>}>
                                {linkedMembers.length === 0 ? (
                                    <div className={styles.emptyMembers}>
                                        <Info size={40} className={styles.infoIcon} />
                                        <p>No members have enrolled into this scheme yet.</p>
                                    </div>
                                ) : (
                                    <div className={styles.memberList}>
                                        {linkedMembers.map((member) => (
                                            <div key={member.id} className={styles.memberItem}>
                                                <div className={styles.memberAvatar}>{member.name.charAt(0)}</div>
                                                <div className={styles.memberInfo}>
                                                    <span className={styles.memberName}>{member.name}</span>
                                                    <span className={styles.memberPhone}>{member.phone}</span>
                                                </div>
                                                <Link href={`/members/edit/${member.id}`} className={styles.viewMemberLink}>View Profille</Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}
                </section>

                <aside className={styles.sidebarSection}>
                    <Card title="Scheme Information">
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Start Date</span>
                            <span className={styles.infoValue}>{group.startDate}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Status</span>
                            <span className={`${styles.statusBadge} ${styles.active}`}>Active</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Chit Lift Pay</span>
                            <span className={styles.infoValue}>₹ {group.liftedInstallmentAmount?.toLocaleString() || '0'}</span>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
