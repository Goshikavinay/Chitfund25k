"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useChitContext } from "@/context/ChitContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "./layout.module.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentUser, isInitialized, pageAnimation } = useChitContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isInitialized && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, isInitialized, router]);

    if (!isInitialized || !currentUser) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header />
                <main className={`${styles.contentArea} animate-${pageAnimation}`} key={pathname}>
                    {children}
                </main>
            </div>
        </div>
    );
}
