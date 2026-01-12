"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useChitContext, Member } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./MemberForm.module.css";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function MemberForm() {
    const router = useRouter();
    const params = useParams();
    const { members, addMember, updateMember } = useChitContext();
    const isEditing = !!params.id;

    const [formData, setFormData] = useState<Omit<Member, "id" | "joinedDate">>({
        name: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (isEditing && params.id) {
            const memberToEdit = members.find((m) => m.id === params.id);
            if (memberToEdit) {
                setFormData({
                    name: memberToEdit.name,
                    phone: memberToEdit.phone,
                    address: memberToEdit.address,
                });
            }
        }
    }, [isEditing, params.id, members]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && params.id) {
            updateMember(params.id as string, formData);
        } else {
            addMember(formData);
        }
        router.push("/members");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/members" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    <span>Back to Members</span>
                </Link>
                <h1 className={styles.title}>{isEditing ? "Edit Member" : "New Member"}</h1>
            </div>

            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Rahul Sharma"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number * (10 Digits)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                if (val.length <= 10) {
                                    setFormData(prev => ({ ...prev, phone: val }));
                                }
                            }}
                            required
                            maxLength={10}
                            pattern="[0-9]{10}"
                            placeholder="Enter 10 digit number"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address *</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 123, MG Road, Bangalore"
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitButton}>
                            <Save size={20} />
                            <span>{isEditing ? "Update Member" : "Add Member"}</span>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
