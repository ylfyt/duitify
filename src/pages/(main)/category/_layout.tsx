import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import CategoryPage from './category-page';
import CategoryCreatePage from './category-create-page';

interface LayoutCategoryProps {}

export const LayoutCategory: FC<LayoutCategoryProps> = () => {
    return (
        <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/new" element={<CategoryCreatePage />} />
            <Route path="/:id" element={<CategoryCreatePage />} />
        </Routes>
    );
};
