import React, { useState, useEffect } from "react";
import { fetchCategories, createCategory } from "../services/api";
import { Category } from "../types";
import { CategoryForm } from "../components/CategoryForm";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import { getCategoryEmoji } from "../constants/categoryEmojis";

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (data: { name: string; emoji?: string }) => {
        try {
            await createCategory(data);
            setIsModalOpen(false);
            loadCategories();
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    };

    const pageStyle: React.CSSProperties = {
        padding: "48px 64px",
        minHeight: "100vh",
        background: COLORS.secondary.s01,
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        justifyContent: "space-between",
        marginBottom: "32px",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "40px",
        fontWeight: 700,
        color: COLORS.secondary.s10,
        margin: 0,
        flexShrink: 0,
    };

    const loadingStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px",
        fontSize: "18px",
        color: COLORS.secondary.s08,
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "16px",
    };

    const cardStyle: React.CSSProperties = {
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    };

    const emojiStyle: React.CSSProperties = {
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        background: COLORS.secondary.s01,
        borderRadius: "12px",
    };

    const nameStyle: React.CSSProperties = {
        fontSize: "18px",
        fontWeight: 600,
        color: COLORS.secondary.s10,
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Categories</h1>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Add Category
                </Button>
            </div>

            <div>
                {loading ? (
                    <div style={loadingStyle}>Loading...</div>
                ) : (
                    <div style={gridStyle}>
                        {categories.map((category) => {
                            // Use database emoji if present, fallback to mapped emoji, then generic package
                            const displayEmoji = category.emoji || getCategoryEmoji(category.name) || "📦";

                            return (
                                <div key={category.id || category.name} style={cardStyle}>
                                    <div style={emojiStyle}>{displayEmoji}</div>
                                    <div style={nameStyle}>{category.name}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Category"
            >
                <CategoryForm
                    onSubmit={handleAddCategory}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CategoryPage;
