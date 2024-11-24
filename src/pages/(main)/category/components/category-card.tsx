import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { openModal } from '@/stores/modal';
import { Category } from '@/types/category.type';
import { FC } from 'react';
import { ModalCategoryCreate } from './modal-category-create';
import { showConfirm } from '@/stores/confirm';
import { showLoading } from '@/stores/common';
import { QueryResultEmpty } from '@/repo/base-repo';
import { ExpenseCategoryRepo } from '@/repo/expense-category-repo';
import { toast } from 'react-toastify';
import { IncomeCategoryRepo } from '@/repo/income-category-repo';
import { ENV } from '@/constants/env';

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
        let res: QueryResultEmpty;
        switch (categoryType) {
            case 'expense':
                res = await ExpenseCategoryRepo.deleteCategory(category.id);
                break;
            case 'income':
                res = await IncomeCategoryRepo.deleteCategory(category.id);
                break;
        }
        showLoading(false);

        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        onDeleted(category.id);
    };

    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
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
        <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
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
