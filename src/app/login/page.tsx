"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChitContext } from "@/context/ChitContext";
import styles from "./page.module.css";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useChitContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            const loginStatus = login(username, password);
            if (loginStatus === "success") {
                router.push("/");
            } else if (loginStatus === "pending") {
                setError("Account pending approval. Please contact the administrator.");
                setLoading(false);
            } else {
                setError("Invalid username (or phone number) and password.");
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.visualSection}>
                <div className={styles.visualContent}>
                    <img
                        src="/money-theme.png"
                        alt="Money Theme"
                        className={styles.visualImage}
                    />
                    <div className={styles.visualOverlay}>
                        <h2>Smart Savings, Better Future</h2>
                        <p>Join thousands of members managing their wealth with Vinnu's Chit Fund.</p>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <div className={styles.logoIcon}>VC</div>
                        <h1 className={styles.title}>Welcome to <span className={styles.accent}>Vinnu Chit</span></h1>
                        <p className={styles.subtitle}>Personal Chit Fund Management</p>
                    </div>

                    <form onSubmit={handleLogin} className={styles.form}>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username / Phone Number</label>
                            <div className={styles.inputContainer}>
                                <User size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Vinay or your Phone Number"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputContainer}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.authLinks}>
                            <Link href="/signup" className={styles.link}>Don't have an account? <strong>Sign Up</strong></Link>
                            <Link href="/forgot-password" className={styles.link}>Forgot Password?</Link>
                        </div>

                        <button type="submit" className={styles.loginButton} disabled={loading}>
                            {loading ? (
                                <div className={styles.loader}></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <footer className={styles.footer}>
                        <p>© 2026 Vinnu's Chit. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
