"use client";

import { useState, useEffect } from "react";
import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { Users, Link2, Check, X } from "lucide-react";

export default function LinkingPage() {
    const { groups, members, linkMemberToGroup, unlinkMemberFromGroup, getMembersInGroup } = useChitContext();
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");

    // Auto-select first group if none selected
    useEffect(() => {
        if (!selectedGroupId && groups.length > 0) {
            setSelectedGroupId(groups[0].id);
        }
    }, [groups, selectedGroupId]);

    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    const linkedMembers = selectedGroup ? getMembersInGroup(selectedGroup.id) : [];
    const linkedMemberIds = linkedMembers.map(m => m.id);

    if (groups.length === 0) {
        return (
            <div className={styles.container}>
                <h1>Group Linking</h1>
                <p>You need to create at least one group before you can link members.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Member Linking</h1>
                <p className={styles.subtitle}>Assign members to their respective chit groups</p>
            </header>

            <div className={styles.mainGrid}>
                <div className={styles.selectionPane}>
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
                                        <span className={styles.groupSubtitle}>{group.frequency} • {group.totalMembers} Slots</span>
                                    </div>
                                    {selectedGroupId === group.id && <Check size={18} className={styles.checkIcon} />}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className={styles.linkingPane}>
                    <Card
                        title={selectedGroup ? `Link Members to ${selectedGroup.name}` : "Select a group"}
                        action={<span className={styles.countBadge}>{linkedMembers.length} Linked</span>}
                    >
                        {members.length === 0 ? (
                            <p className={styles.emptyText}>No members available. Please add members first.</p>
                        ) : (
                            <div className={styles.memberList}>
                                {members.map((member) => {
                                    const isLinked = linkedMemberIds.includes(member.id);
                                    return (
                                        <div key={member.id} className={`${styles.memberItem} ${isLinked ? styles.isLinked : ""}`}>
                                            <div className={styles.memberAvatar}>{member.name.charAt(0)}</div>
                                            <div className={styles.memberDetails}>
                                                <span className={styles.memberName}>{member.name}</span>
                                                <span className={styles.memberPhone}>{member.phone}</span>
                                            </div>
                                            <button
                                                className={`${styles.linkButton} ${isLinked ? styles.unlink : styles.link}`}
                                                onClick={() => isLinked
                                                    ? unlinkMemberFromGroup(selectedGroupId, member.id)
                                                    : linkMemberToGroup(selectedGroupId, member.id)
                                                }
                                            >
                                                {isLinked ? <X size={16} /> : <Link2 size={16} />}
                                                <span>{isLinked ? "Unlink" : "Link"}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
