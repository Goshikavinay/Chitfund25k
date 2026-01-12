"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useChitContext, Group } from "@/context/ChitContext";
import Card from "@/components/Card";
import styles from "./GroupForm.module.css";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function GroupForm() {
    const router = useRouter();
    const params = useParams();
    const { groups, addGroup, updateGroup } = useChitContext();
    const isEditing = !!params.id;

    const [formData, setFormData] = useState<Omit<Group, "id">>({
        name: "",
        totalMembers: 20,
        chitAmount: 100000,
        installmentAmount: 5000,
        frequency: "Monthly",
        startDate: new Date().toISOString().split("T")[0],
        liftedInstallmentAmount: 5000,
    });

    useEffect(() => {
        if (isEditing && params.id) {
            const groupToEdit = groups.find((g) => g.id === params.id);
            if (groupToEdit) {
                const { id, ...data } = groupToEdit;
                setFormData(data);
            }
        }
    }, [isEditing, params.id, groups]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && params.id) {
            updateGroup(params.id as string, formData);
        } else {
            addGroup(formData);
        }
        router.push("/groups");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "totalMembers" || name === "chitAmount" || name === "installmentAmount" || name === "liftedInstallmentAmount"
                ? Number(value)
                : value,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/groups" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    <span>Back to Groups</span>
                </Link>
                <h1 className={styles.title}>{isEditing ? "Edit Scheme" : "New Scheme"}</h1>
            </div>

            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Scheme Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Gold Monthly 1 Lakh"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="chitAmount">Total Chit Amount (₹)</label>
                            <input
                                type="number"
                                id="chitAmount"
                                name="chitAmount"
                                value={formData.chitAmount}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="totalMembers">Total Members</label>
                            <input
                                type="number"
                                id="totalMembers"
                                name="totalMembers"
                                value={formData.totalMembers}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="installmentAmount">Monthly Installment (₹)</label>
                            <input
                                type="number"
                                id="installmentAmount"
                                name="installmentAmount"
                                value={formData.installmentAmount}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="liftedInstallmentAmount">Lifted Installment (If Winner) (₹)</label>
                            <input
                                type="number"
                                id="liftedInstallmentAmount"
                                name="liftedInstallmentAmount"
                                value={formData.liftedInstallmentAmount}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="frequency">Frequency</label>
                            <select
                                id="frequency"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Daily">Daily</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitButton}>
                            <Save size={20} />
                            <span>{isEditing ? "Update Scheme" : "Create Scheme"}</span>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
