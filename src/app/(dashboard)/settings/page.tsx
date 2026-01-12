"use client";

import { useState } from "react";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { Bell, Moon, Shield, Globe, ArrowLeft, ChevronRight, Play, Check } from "lucide-react";
import Link from "next/link";
import { useChitContext } from "@/context/ChitContext";
import Modal from "@/components/Modal";

interface SettingItem {
    id: string;
    icon: any;
    label: string;
    type: "toggle" | "link" | "action" | "select";
    value?: boolean | string;
    setter?: (val: any) => void;
    options?: { label: string; value: string }[];
}

interface SettingGroup {
    title: string;
    items: SettingItem[];
}

export default function SettingsPage() {
    const {
        pageAnimation,
        setPageAnimation,
        darkModeEnabled,
        setDarkModeEnabled,
        notificationsEnabled,
        setNotificationsEnabled
    } = useChitContext();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const [selectedLang, setSelectedLang] = useState("English");

    const handleAction = (id: string, label: string) => {
        if (id === "deactivate") {
            if (confirm("Are you sure you want to deactivate your account? This action will archive your data.")) {
                alert("Account deactivated. You will be logged out.");
            }
            return;
        }
        if (id === "password" || id === "language" || id === "privacy") {
            setActiveModal(id);
            return;
        }
        alert(`Action triggered: ${label}. This feature will be implemented in the next update.`);
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password updated successfully!");
        setActiveModal(null);
        setPasswordData({ current: "", new: "", confirm: "" });
    };

    const settingsGroups: SettingGroup[] = [
        {
            title: "App Preferences",
            items: [
                { id: "dark-mode", icon: Moon, label: "Dark Mode", type: "toggle", value: darkModeEnabled, setter: setDarkModeEnabled },
                { id: "notifications", icon: Bell, label: "Enable Notifications", type: "toggle", value: notificationsEnabled, setter: setNotificationsEnabled },
            ]
        },
        {
            title: "UI Customization",
            items: [
                {
                    id: "animation",
                    icon: Play,
                    label: "Page Animation",
                    type: "select",
                    value: pageAnimation,
                    setter: setPageAnimation,
                    options: [
                        { label: "Fade In", value: "fade-in" },
                        { label: "Slide Up", value: "slide-up" },
                        { label: "Slide Down", value: "slide-down" },
                        { label: "Slide Left", value: "slide-left" },
                        { label: "Slide Right", value: "slide-right" },
                        { label: "Zoom In", value: "zoom-in" },
                        { label: "Zoom Out", value: "zoom-out" },
                        { label: "Flip X", value: "flip-x" },
                        { label: "Flip Y", value: "flip-y" },
                        { label: "Bounce In", value: "bounce-in" },
                    ]
                },
                { id: "language", icon: Globe, label: "Language", type: "link", value: selectedLang },
            ]
        },
        {
            title: "Security",
            items: [
                { id: "password", icon: Shield, label: "Update Password", type: "action" },
                { id: "privacy", icon: Shield, label: "Privacy Policy", type: "action" },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={18} />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Configure your application experience and security preferences</p>
            </div>

            <div className={styles.content}>
                {settingsGroups.map((group, gIdx) => (
                    <div key={gIdx} className={styles.group}>
                        <h3 className={styles.groupTitle}>{group.title}</h3>
                        <div className={styles.itemList}>
                            {group.items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemLeft}>
                                        <div className={styles.itemIcon}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className={styles.itemLabel}>{item.label}</span>
                                    </div>
                                    <div className={styles.itemRight} onClick={() => {
                                        if (item.type === "action" || item.type === "link") {
                                            handleAction(item.id, item.label);
                                        }
                                    }}>
                                        {item.type === "toggle" ? (
                                            <button
                                                type="button"
                                                className={`${styles.toggle} ${item.value ? styles.active : ""}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    item.setter && item.setter(!item.value);
                                                }}
                                            >
                                                <div className={styles.toggleKnob}></div>
                                            </button>
                                        ) : item.type === "select" ? (
                                            <select
                                                className={styles.select}
                                                value={item.value as string}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    item.setter && item.setter(e.target.value);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {item.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        ) : item.type === "link" ? (
                                            <div className={styles.linkValue}>
                                                <span>{item.value as string}</span>
                                                <ChevronRight size={18} />
                                            </div>
                                        ) : (
                                            <ChevronRight size={18} className={styles.chevron} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <Card className={styles.dangerCard}>
                    <h3 className={styles.dangerTitle}>Deactivate Account</h3>
                    <p className={styles.dangerText}>Once you deactivate your account, your data will be archived. This action can be reversed by contacting support.</p>
                    <button
                        className={styles.dangerButton}
                        onClick={() => handleAction("deactivate", "Deactivate Account")}
                    >
                        Deactivate Account
                    </button>
                </Card>
            </div>

            {/* Modals */}
            <Modal
                isOpen={activeModal === "password"}
                onClose={() => setActiveModal(null)}
                title="Update Password"
            >
                <form onSubmit={handlePasswordUpdate} className={styles.modalForm}>
                    <div className={styles.modalField}>
                        <label>Current Password</label>
                        <input
                            type="password"
                            className={styles.modalInput}
                            value={passwordData.current}
                            onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.modalField}>
                        <label>New Password</label>
                        <input
                            type="password"
                            className={styles.modalInput}
                            value={passwordData.new}
                            onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.modalField}>
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            className={styles.modalInput}
                            value={passwordData.confirm}
                            onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.modalSubmit}>Update Password</button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === "language"}
                onClose={() => setActiveModal(null)}
                title="Select Language"
            >
                <div className={styles.langList}>
                    {["English", "Hindi", "Telugu", "Tamil", "Kannada"].map(lang => (
                        <div
                            key={lang}
                            className={`${styles.langItem} ${selectedLang === lang ? styles.langActive : ""}`}
                            onClick={() => {
                                setSelectedLang(lang);
                                setActiveModal(null);
                            }}
                        >
                            <span>{lang}</span>
                            {selectedLang === lang && <Check size={18} />}
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === "privacy"}
                onClose={() => setActiveModal(null)}
                title="Privacy Policy"
            >
                <div className={styles.privacyContent}>
                    <h4>1. Data Collection</h4>
                    <p>We collect minimal data required to manage your chit fund activities, including your name, contact information, and transaction history.</p>
                    <h4>2. Data Security</h4>
                    <p>Your data is stored securely and encrypted. We do not share your personal information with third parties without your explicit consent.</p>
                    <h4>3. Your Rights</h4>
                    <p>You have the right to access, correct, or delete your personal data at any time through the settings panel.</p>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>Last updated: January 2026</p>
                </div>
            </Modal>
        </div>
    );
}
