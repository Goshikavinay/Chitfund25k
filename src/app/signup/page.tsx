"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChitContext } from "@/context/ChitContext";
import styles from "../login/page.module.css"; // Reuse login styles
import { User, Mail, Phone, Lock, UserPlus, ArrowLeft } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useChitContext();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"owner" | "member">("member");
    const [secretCode, setSecretCode] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (role === "owner" && !secretCode) {
            setError("Secret code is required for Owner account.");
            setLoading(false);
            return;
        }

        if (formData.phone.replace(/\D/g, "").length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            setLoading(false);
            return;
        }

        setTimeout(() => {
            try {
                const success = signUp(formData, role, secretCode);
                if (success) {
                    if (role === 'owner') {
                        alert("Owner account created successfully! You can login now.");
                    } else {
                        alert("Account created successfully! It is currently pending owner approval. You will be able to login once approved.");
                    }
                    router.push("/login");
                } else {
                    setError("Invalid Secret Code for Owner registration.");
                    setLoading(false);
                }
            } catch (err) {
                setError("Registration failed. Please try again.");
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.loginCard} ${styles.signupCard}`}>
                <div className={styles.header}>
                    <div className={styles.logoIcon}>VC</div>
                    <h1 className={styles.title}>Create <span className={styles.accent}>Account</span></h1>
                    <p className={styles.subtitle}>Join Vinnu's Chit Fund Management</p>
                </div>

                <form onSubmit={handleSignup} className={styles.form}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.roleSelection}>
                        <button
                            type="button"
                            className={`${styles.roleButton} ${role === 'member' ? styles.activeRole : ''}`}
                            onClick={() => setRole('member')}
                        >
                            <User size={16} />
                            <span>Chit User</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.roleButton} ${role === 'owner' ? styles.activeRole : ''}`}
                            onClick={() => setRole('owner')}
                        >
                            <UserPlus size={16} />
                            <span>Owner / Manager</span>
                        </button>
                    </div>

                    {role === 'owner' && (
                        <div className={styles.formGroup}>
                            <label>Owner Secret Code *</label>
                            <div className={styles.inputContainer}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    required
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    placeholder="Enter owner secret code"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Full Name *</label>
                        <div className={styles.inputContainer}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gmail Address *</label>
                        <div className={styles.inputContainer}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number * (10 Digits)</label>
                        <div className={styles.inputContainer}>
                            <Phone size={18} className={styles.inputIcon} />
                            <input
                                name="phone"
                                type="tel"
                                required
                                maxLength={10}
                                pattern="[0-9]{10}"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    if (val.length <= 10) {
                                        setFormData(prev => ({ ...prev, phone: val }));
                                    }
                                }}
                                placeholder="Enter 10 digit number"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Username *</label>
                        <div className={styles.inputContainer}>
                            <UserPlus size={18} className={styles.inputIcon} />
                            <input
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password *</label>
                        <div className={styles.inputContainer}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? <div className={styles.loader}></div> : (
                            <>
                                <span>Create Account</span>
                                <UserPlus size={20} />
                            </>
                        )}
                    </button>
                </form>

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
