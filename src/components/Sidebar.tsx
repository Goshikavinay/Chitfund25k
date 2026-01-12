"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChitContext } from "@/context/ChitContext";
import {
    LayoutDashboard,
    Users,
    User,
    UserCheck,
    Link2,
    Gavel,
    FileText,
    Printer
} from "lucide-react";
import styles from "./Sidebar.module.css";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Schemes", href: "/groups", icon: Users },
    { name: "Members", href: "/members", icon: User },
    { name: "Owners", href: "/owners", icon: UserCheck },
    { name: "Linking", href: "/linking", icon: Link2 },
    { name: "Auctions", href: "/auctions", icon: Gavel },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Receipts", href: "/receipts", icon: Printer },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { currentUser, logout } = useChitContext();

    const isAdmin = currentUser?.role === "owner";

    const filteredItems = navItems.filter(item => {
        if (isAdmin) return true;
        // Users only see these
        return ["Dashboard", "Schemes", "Reports", "Receipts"].includes(item.name);
    });

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>VC</div>
                <span className={styles.logoText}>Vinnu's <span className={styles.accent}>Chit</span></span>
            </div>

            <div className={styles.userProfile}>
                <div className={styles.userAvatar}>{currentUser?.name.charAt(0)}</div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{currentUser?.name}</span>
                    <span className={styles.userRole}>{currentUser?.role === "owner" ? "Owner" : "User"}</span>
                </div>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                                >
                                    <Icon size={20} className={styles.icon} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.footer}>
                <button onClick={logout} className={styles.logoutButton}>Logout</button>
                <p>© 2026 Vinnu's Chit</p>
            </div>
        </aside>
    );
}
