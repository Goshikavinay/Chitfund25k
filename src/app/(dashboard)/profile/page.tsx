"use client";

import { useChitContext } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { User, Phone, Mail, Shield, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { currentUser } = useChitContext();

    if (!currentUser) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={18} />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className={styles.title}>My Profile</h1>
                <p className={styles.subtitle}>Manage your personal information and account security</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <Card title="Account Information" className={styles.card}>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <div className={styles.iconContainer}>
                                    <User size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <label>Full Name</label>
                                    <p>{currentUser.name}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconContainer}>
                                    <Mail size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <label>Email Address</label>
                                    <p>{currentUser.email}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconContainer}>
                                    <Phone size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <label>Phone Number</label>
                                    <p>{currentUser.phone}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconContainer}>
                                    <Shield size={20} />
                                </div>
                                <div className={styles.infoText}>
                                    <label>Account Role</label>
                                    <p className={styles.roleBadge}>
                                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className={styles.sidebar}>
                    <Card title="Security Status" className={styles.card}>
                        <div className={styles.securityItem}>
                            <div className={styles.statusDot + " " + styles.active}></div>
                            <span>Account Verified</span>
                        </div>
                        <div className={styles.securityItem}>
                            <div className={styles.statusDot + " " + styles.active}></div>
                            <span>2FA Enabled</span>
                        </div>
                        <button className={styles.changePasswordButton}>
                            Change Password
                        </button>
                    </Card>

                    <Card title="Activity Summary" className={styles.card}>
                        <div className={styles.summaryItem}>
                            <Calendar size={16} />
                            <span>Last Login: Today, 09:12 AM</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
