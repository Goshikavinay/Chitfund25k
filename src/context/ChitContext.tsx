"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface Group {
    id: string;
    name: string;
    totalMembers: number;
    chitAmount: number;
    installmentAmount: number;
    frequency: "Monthly" | "Weekly" | "Daily";
    startDate: string;
    liftedInstallmentAmount: number;
}

export interface Member {
    id: string;
    name: string;
    phone: string;
    address: string;
    joinedDate: string;
}

export interface Owner {
    id: string;
    name: string;
    phone: string;
    companyName: string;
}

export interface Linkage {
    groupId: string;
    memberIds: string[];
}

export interface Auction {
    id: string;
    groupId: string;
    winnerMemberId: string;
    bidAmount: number;
    dividendPerMember: number;
    date: string;
    month: number;
}

export interface Payment {
    id: string;
    auctionId: string;
    memberId: string;
    amount: number;
    status: "Paid" | "Pending";
    date?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    type: "info" | "success" | "warning";
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "owner" | "member";
    memberId?: string; // If role is member
}

export interface AuthAccount {
    id: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    role: "owner" | "member";
    isApproved: boolean;
}

interface ChitContextType {
    groups: Group[];
    members: Member[];
    owners: Owner[];
    linkages: Linkage[];
    auctions: Auction[];
    payments: Payment[];
    addGroup: (group: Omit<Group, "id">) => void;
    updateGroup: (id: string, group: Partial<Group>) => void;
    deleteGroup: (id: string) => void;
    addMember: (member: Omit<Member, "id" | "joinedDate">) => void;
    updateMember: (id: string, member: Partial<Member>) => void;
    deleteMember: (id: string) => void;
    addOwner: (owner: Omit<Owner, "id">) => void;
    updateOwner: (id: string, owner: Partial<Owner>) => void;
    deleteOwner: (id: string) => void;
    linkMemberToGroup: (groupId: string, memberId: string) => void;
    unlinkMemberFromGroup: (groupId: string, memberId: string) => void;
    getMembersInGroup: (groupId: string) => Member[];
    recordAuction: (auction: Omit<Auction, "id" | "date" | "dividendPerMember">) => void;
    getAuctionsByGroup: (groupId: string) => Auction[];
    togglePaymentStatus: (auctionId: string, memberId: string) => void;
    getPaymentsByAuction: (auctionId: string) => Payment[];
    currentUser: User | null;
    isInitialized: boolean;
    authAccounts: AuthAccount[];
    login: (username: string, password?: string) => "success" | "pending" | "invalid";
    logout: () => void;
    signUp: (data: Omit<AuthAccount, "id" | "role" | "isApproved">, requestedRole: "owner" | "member", secretCode?: string) => boolean;
    approveAccount: (id: string) => void;
    deleteAuthAccount: (id: string) => void;
    resetPassword: (phone: string, newPassword: string) => boolean;
    enrollMember: (groupId: string, memberId: string) => string | null;
    isMemberInGroup: (groupId: string, memberId: string) => boolean;
    notifications: Notification[];
    markNotificationAsRead: (id: string) => void;
    pageAnimation: string;
    setPageAnimation: (type: string) => void;
    darkModeEnabled: boolean;
    setDarkModeEnabled: (enabled: boolean) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
}

const ChitContext = createContext<ChitContextType | undefined>(undefined);

export function ChitProvider({ children }: { children: React.ReactNode }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [linkages, setLinkages] = useState<Linkage[]>([]);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authAccounts, setAuthAccounts] = useState<AuthAccount[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pageAnimation, setPageAnimation] = useState<string>("fade");
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const loadData = () => {
            try {
                const savedGroups = localStorage.getItem("chitAvailableGroups");
                const savedMembers = localStorage.getItem("chitAvailableMembers");
                const savedOwners = localStorage.getItem("chitAvailableOwners");
                const savedLinkages = localStorage.getItem("chitAvailableLinkages");
                const savedAuctions = localStorage.getItem("chitAvailableAuctions");
                const savedPayments = localStorage.getItem("chitAvailablePayments");
                const savedUser = localStorage.getItem("chitCurrentUser");
                const savedAccounts = localStorage.getItem("chitAuthAccounts");
                const savedAnimation = localStorage.getItem("chitPageAnimation");
                const savedDarkMode = localStorage.getItem("chitDarkMode");
                const savedNotificationsEnabled = localStorage.getItem("chitNotificationsEnabled");

                if (savedGroups) setGroups(JSON.parse(savedGroups));
                if (savedMembers) setMembers(JSON.parse(savedMembers));
                if (savedOwners) setOwners(JSON.parse(savedOwners));
                if (savedLinkages) setLinkages(JSON.parse(savedLinkages));
                if (savedAuctions) setAuctions(JSON.parse(savedAuctions));
                if (savedPayments) setPayments(JSON.parse(savedPayments));
                if (savedUser) setCurrentUser(JSON.parse(savedUser));
                if (savedAccounts) {
                    const parsedAccounts = JSON.parse(savedAccounts);
                    const migratedAccounts = parsedAccounts.map((acc: any) => ({
                        ...acc,
                        isApproved: acc.isApproved !== undefined ? acc.isApproved : acc.role === "owner"
                    }));
                    setAuthAccounts(migratedAccounts);
                }
                if (savedAnimation) setPageAnimation(savedAnimation);
                if (savedDarkMode !== null) setDarkModeEnabled(savedDarkMode === "true");
                if (savedNotificationsEnabled !== null) setNotificationsEnabled(savedNotificationsEnabled === "true");
                const savedNotifications = localStorage.getItem("chitAvailableNotifications");
                if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
            } catch (error) {
                console.error("Failed to load data from localStorage", error);
            } finally {
                setIsInitialized(true);
            }
        };

        loadData();
    }, []);

    // Save to local storage on change - only after initialization
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableGroups", JSON.stringify(groups));
        }
    }, [groups, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableMembers", JSON.stringify(members));
        }
    }, [members, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableOwners", JSON.stringify(owners));
        }
    }, [owners, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableLinkages", JSON.stringify(linkages));
        }
    }, [linkages, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableAuctions", JSON.stringify(auctions));
        }
    }, [auctions, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailablePayments", JSON.stringify(payments));
        }
    }, [payments, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitCurrentUser", JSON.stringify(currentUser));
        }
    }, [currentUser, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAuthAccounts", JSON.stringify(authAccounts));
        }
    }, [authAccounts, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitAvailableNotifications", JSON.stringify(notifications));
        }
    }, [notifications, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitPageAnimation", pageAnimation);
        }
    }, [pageAnimation, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitDarkMode", darkModeEnabled.toString());
            document.documentElement.setAttribute("data-theme", darkModeEnabled ? "dark" : "light");
        }
    }, [darkModeEnabled, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("chitNotificationsEnabled", notificationsEnabled.toString());
        }
    }, [notificationsEnabled, isInitialized]);

    const addGroup = (groupData: Omit<Group, "id">) => {
        const newGroup: Group = {
            ...groupData,
            id: crypto.randomUUID(),
        };
        setGroups((prev) => [...prev, newGroup]);
    };

    const updateGroup = (id: string, groupData: Partial<Group>) => {
        setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...groupData } : g)));
    };

    const deleteGroup = (id: string) => {
        if (confirm("Are you sure you want to delete this group?")) {
            setGroups((prev) => prev.filter((g) => g.id !== id));
            // Also remove any linkages associated with this group
            setLinkages((prev) => prev.filter((l) => l.groupId !== id));
            // Also remove any auctions associated with this group
            setAuctions((prev) => prev.filter((a) => a.groupId !== id));
            // Also remove any payments associated with this group's auctions
            setPayments((prev) => prev.filter((p) => !auctions.some(a => a.id === p.auctionId && a.groupId === id)));
        }
    };

    const addMember = (memberData: Omit<Member, "id" | "joinedDate">) => {
        const newMember: Member = {
            ...memberData,
            id: crypto.randomUUID(),
            joinedDate: new Date().toISOString().split('T')[0],
        };
        setMembers((prev) => [...prev, newMember]);
    };

    const updateMember = (id: string, memberData: Partial<Member>) => {
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...memberData } : m)));
    };

    const deleteMember = (id: string) => {
        if (confirm("Are you sure you want to delete this member?")) {
            setMembers((prev) => prev.filter((m) => m.id !== id));
            // Also remove from linkages
            setLinkages((prev) => prev.map(l => ({
                ...l,
                memberIds: l.memberIds.filter(mid => mid !== id)
            })));
            // Also remove any auctions won by this member
            setAuctions((prev) => prev.filter((a) => a.winnerMemberId !== id));
            // Also remove any payments associated with this member
            setPayments((prev) => prev.filter((p) => p.memberId !== id));
        }
    };

    const addOwner = (ownerData: Omit<Owner, "id">) => {
        const newOwner: Owner = { ...ownerData, id: crypto.randomUUID() };
        setOwners((prev) => [...prev, newOwner]);
    };

    const updateOwner = (id: string, ownerData: Partial<Owner>) => {
        setOwners((prev) => prev.map((o) => (o.id === id ? { ...o, ...ownerData } : o)));
    };

    const deleteOwner = (id: string) => {
        if (confirm("Are you sure you want to delete this owner?")) {
            setOwners((prev) => prev.filter((o) => o.id !== id));
        }
    };

    const linkMemberToGroup = (groupId: string, memberId: string) => {
        if (!groupId || !memberId) return;
        setLinkages((prev) => {
            const existingIndex = prev.findIndex(l => l.groupId === groupId);
            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                if (existing.memberIds.includes(memberId)) return prev;
                const updated = { ...existing, memberIds: [...existing.memberIds, memberId] };
                const next = [...prev];
                next[existingIndex] = updated;
                return next;
            }
            return [...prev, { groupId, memberIds: [memberId] }];
        });
    };

    const unlinkMemberFromGroup = (groupId: string, memberId: string) => {
        setLinkages((prev) => prev.map(l =>
            l.groupId === groupId ? { ...l, memberIds: l.memberIds.filter(mid => mid !== memberId) } : l
        ));
        // Also remove any payments associated with this member for this group's auctions
        setPayments((prev) => prev.filter(p => {
            const auction = auctions.find(a => a.id === p.auctionId);
            return !(auction && auction.groupId === groupId && p.memberId === memberId);
        }));
    };

    const getMembersInGroup = (groupId: string) => {
        const linkage = linkages.find(l => l.groupId === groupId);
        if (!linkage) return [];
        return members.filter(m => linkage.memberIds.includes(m.id));
    };

    const recordAuction = (auctionData: Omit<Auction, "id" | "date" | "dividendPerMember">) => {
        const group = groups.find(g => g.id === auctionData.groupId);
        if (!group) return;

        const dividendPerMember = auctionData.bidAmount / group.totalMembers;
        const amountToPay = group.installmentAmount - dividendPerMember;

        const auctionId = crypto.randomUUID();
        const newAuction: Auction = {
            ...auctionData,
            id: auctionId,
            date: new Date().toISOString().split('T')[0],
            dividendPerMember: dividendPerMember
        };

        setAuctions(prev => [...prev, newAuction]);

        // Create payment placeholders for all members in the group
        const groupMemberIds = linkages.find(l => l.groupId === group.id)?.memberIds || [];
        const newPayments: Payment[] = groupMemberIds.map(mid => ({
            id: crypto.randomUUID(),
            auctionId: auctionId,
            memberId: mid,
            amount: mid === auctionData.winnerMemberId ? group.liftedInstallmentAmount : amountToPay,
            status: "Pending"
        }));
        setPayments(prev => [...prev, ...newPayments]);
    };

    const getAuctionsByGroup = (groupId: string) => {
        return auctions.filter(a => a.groupId === groupId);
    };

    const togglePaymentStatus = (auctionId: string, memberId: string) => {
        setPayments(prev => prev.map(p => {
            if (p.auctionId === auctionId && p.memberId === memberId) {
                return {
                    ...p,
                    status: p.status === "Paid" ? "Pending" : "Paid",
                    date: p.status === "Pending" ? new Date().toISOString().split('T')[0] : undefined
                };
            }
            return p;
        }));
    };

    const getPaymentsByAuction = (auctionId: string) => {
        return payments.filter(p => p.auctionId === auctionId);
    };

    const login = (username: string, password?: string): "success" | "pending" | "invalid" => {
        // Special case for pre-configured Admin (if no accounts exist or for convenience)
        if (username.toLowerCase() === "vinay") {
            setCurrentUser({
                id: "admin-vinay",
                name: "VINAY",
                email: "vinay@vinnuchit.com",
                phone: "7032660489",
                role: "owner"
            });
            return "success";
        }

        // Check against registered accounts
        const account = authAccounts.find(
            (acc) => acc.username === username && acc.password === password
        );

        if (account) {
            if (!account.isApproved && account.role?.toLowerCase() !== 'owner') return "pending";

            // Find if this account already has a Member record (matched by phone)
            const existingMember = members.find(m => m.phone === account.phone);

            setCurrentUser({
                id: account.id,
                name: account.name,
                email: account.email,
                phone: account.phone,
                role: account.role,
                memberId: existingMember ? existingMember.id : (account.role === "member" ? account.id : undefined),
            });
            return "success";
        }

        // Fallback for members via phone (compatibility with existing data)
        const member = members.find(m => m.phone === username);
        if (member) {
            setCurrentUser({
                id: member.id,
                name: member.name,
                email: "member@vinnuchit.com",
                phone: member.phone,
                role: "member",
                memberId: member.id
            });
            return "success";
        }

        return "invalid";
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const signUp = (userData: Omit<AuthAccount, "id" | "role" | "isApproved">, requestedRole: "owner" | "member", secretCode?: string): boolean => {
        // Validate secret code for owner role
        if (requestedRole === "owner" && secretCode !== "7032660489") {
            return false;
        }

        const newAccount: AuthAccount = {
            ...userData,
            id: crypto.randomUUID(),
            role: requestedRole,
            isApproved: requestedRole === "owner", // Owners are auto-approved, members need approval
        };
        setAuthAccounts((prev) => [...prev, newAccount]);
        return true;
    };

    const approveAccount = (id: string) => {
        setAuthAccounts(prev => prev.map(acc =>
            acc.id === id ? { ...acc, isApproved: true } : acc
        ));
    };

    const deleteAuthAccount = (id: string) => {
        setAuthAccounts(prev => prev.filter(acc => acc.id !== id));
    };

    const resetPassword = (phone: string, newPassword: string): boolean => {
        const accountIndex = authAccounts.findIndex(acc => acc.phone === phone);
        if (accountIndex >= 0) {
            setAuthAccounts(prev => {
                const next = [...prev];
                next[accountIndex] = { ...next[accountIndex], password: newPassword };
                return next;
            });
            return true;
        }
        return false;
    };

    const isMemberInGroup = (groupId: string, memberId: string): boolean => {
        const linkage = linkages.find(l => l.groupId === groupId);
        if (!linkage) return false;

        // Bridging logic: A user might be represented by their Auth ID or their Member record ID
        // (usually different if an owner manually added them before they signed up)
        const account = authAccounts.find(acc => acc.id === memberId);
        const member = members.find(m => m.id === memberId || (account && m.phone === account.phone));

        const possibleIds = new Set([memberId]);
        if (account) possibleIds.add(account.id);
        if (member) possibleIds.add(member.id);

        // Convert to array and check if any ID is present in the linkage
        return Array.from(possibleIds).some(id => linkage.memberIds.includes(id));
    };

    // Add a helper to get the canonical member ID for a user
    const getCanonicalMemberId = (userId: string): string => {
        const account = authAccounts.find(acc => acc.id === userId);
        const member = members.find(m => m.id === userId || (account && m.phone === account.phone));
        return member ? member.id : userId;
    };

    const enrollMember = (groupId: string, memberId: string): string | null => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return "Scheme not found.";

        // Check if group is full
        const currentMembers = getMembersInGroup(groupId);
        if (currentMembers.length >= group.totalMembers) {
            return `Scheme is full. Limit is ${group.totalMembers} members.`;
        }

        // Ensure member exists
        const account = authAccounts.find(acc => acc.id === memberId);
        const existingMember = members.find(m => m.id === memberId || m.phone === account?.phone);

        let actualMemberId = memberId;

        if (!existingMember && account) {
            const newMember: Member = {
                id: memberId,
                name: account.name,
                phone: account.phone,
                address: "Added via Self-Enrollment",
                joinedDate: new Date().toISOString().split('T')[0]
            };
            setMembers(prev => [...prev, newMember]);
        } else if (existingMember) {
            actualMemberId = existingMember.id;
        }

        linkMemberToGroup(groupId, actualMemberId);

        // Add notification for registration (DWS - User)
        addNotification(
            memberId,
            "Scheme Enrollment Successful",
            `You have successfully enrolled into the scheme.`,
            "success"
        );

        // Notify all owners about the new enrollment
        const ownersList = authAccounts.filter(acc => acc.role === "owner");
        ownersList.forEach(owner => {
            addNotification(
                owner.id,
                "New Scheme Enrollment",
                `${account?.name || 'A user'} has enrolled into ${groups.find(g => g.id === groupId)?.name || 'a scheme'}.`,
                "info"
            );
        });

        return null; // Success
    };

    const addNotification = (userId: string, title: string, message: string, type: "info" | "success" | "warning") => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            title,
            message,
            date: new Date().toISOString(),
            read: false,
            type
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <ChitContext.Provider value={{
            groups,
            members,
            owners,
            linkages,
            auctions,
            payments,
            addGroup,
            updateGroup,
            deleteGroup,
            addMember,
            updateMember,
            deleteMember,
            addOwner,
            updateOwner,
            deleteOwner,
            linkMemberToGroup,
            unlinkMemberFromGroup,
            getMembersInGroup,
            recordAuction,
            getAuctionsByGroup,
            togglePaymentStatus,
            getPaymentsByAuction,
            currentUser,
            isInitialized,
            authAccounts,
            login,
            logout,
            signUp,
            approveAccount,
            deleteAuthAccount,
            resetPassword,
            enrollMember,
            isMemberInGroup,
            notifications,
            markNotificationAsRead,
            pageAnimation,
            setPageAnimation,
            darkModeEnabled,
            setDarkModeEnabled,
            notificationsEnabled,
            setNotificationsEnabled
        }}>
            {children}
        </ChitContext.Provider>
    );
}

export function useChitContext() {
    const context = useContext(ChitContext);
    if (context === undefined) {
        throw new Error("useChitContext must be used within a ChitProvider");
    }
    return context;
}
