"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChitContext } from "@/context/ChitContext";
import styles from "../login/page.module.css";
import { Phone, Lock, RefreshCcw, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { resetPassword } = useChitContext();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            const ok = resetPassword(phone, newPassword);
            if (ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError("No account found with this phone number.");
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logoIcon}>VC</div>
                    <h1 className={styles.title}>Reset <span className={styles.accent}>Password</span></h1>
                    <p className={styles.subtitle}>Securely recover your account</p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <p>Password reset successful! Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className={styles.form}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label>Phone Number</label>
                            <div className={styles.inputContainer}>
                                <Phone size={18} className={styles.inputIcon} />
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your registered phone"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <div className={styles.inputContainer}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.loginButton} disabled={loading}>
                            {loading ? <div className={styles.loader}></div> : (
                                <>
                                    <span>Reset Password</span>
                                    <RefreshCcw size={20} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className={styles.authLinks}>
                    <Link href="/login" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
