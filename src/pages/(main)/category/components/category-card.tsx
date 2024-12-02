import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { openModal } from '@/stores/modal';
import { Category } from '@/types/category.type';
import { FC } from 'react';
import { ModalCategoryCreate } from './modal-category-create';
import { showConfirm } from '@/stores/confirm';
import { showLoading } from '@/stores/common';
import { toast } from 'react-toastify';
import { ENV } from '@/constants/env';
import { CategoryRepo } from '@/repo/category-repo';

interface CategoryCardProps {
    category: Category;
    categoryType: 'expense' | 'income';
    onUpdated: (category: Category) => void;
    onDeleted: (id: string) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, categoryType, onUpdated, onDeleted }) => {
    const handleDelete = async () => {
        const confirmed = await showConfirm({
            title: 'Delete category',
            body: 'Are you sure you want to delete this category?',
        });
        if (!confirmed) return;

        showLoading(true);
        const res = await CategoryRepo.deleteCategory(category.id);
        showLoading(false);

        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        onDeleted(category.id);
    };

    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 text-sm shadow-md">
            <img src={ENV.BASE_URL + category.logo} className="size-12"></img>
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-lg">{category.name}</p>
            </div>
            <DropdownMenu
                options={[
                    {
                        icon: 'lucide:pencil',
                        label: 'Edit',
                        onClick: () => openModal(ModalCategoryCreate, { category, onSuccess: onUpdated, categoryType }),
                    },
                    {
                        icon: 'lucide:trash',
                        label: 'Delete',
                        onClick: handleDelete,
                    },
                ]}
            />
        </div>
    );
};

interface CategoryCardSkeletonProps {}

export const CategoryCardSkeleton: FC<CategoryCardSkeletonProps> = () => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 text-sm shadow-md">
            <Skeleton>
                <div className="size-12"></div>
            </Skeleton>
            <div className="flex flex-1 flex-col gap-0.5">
                <Skeleton>
                    <p className="text-lg">Transportation</p>
                </Skeleton>
            </div>
            <Skeleton>
                <DropdownMenu options={[]} />
            </Skeleton>
        </div>
    );
};
