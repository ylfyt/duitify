import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { Category } from '@/types/category.type';
import { FC } from 'react';
import { showConfirm } from '@/stores/confirm';
import { showLoading } from '@/stores/common';
import { toast } from 'react-toastify';
import { CategoryRepo } from '@/repo/category-repo';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LOGO_BASE } from '@/constants/logo';

interface CategoryCardProps {
    category: Category;
    categoryType: 'expense' | 'income';
    onDeleted: (id: string) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, categoryType, onDeleted }) => {
    const navigate = useNavigate();

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
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 text-sm shadow-md hover:cursor-pointer">
            <img
                onClick={() => navigate(`/accounts/transaction?category=${category.id}`)}
                src={`${CATEGORY_LOGO_BASE}/${category.logo}`}
                className="size-9 xs:size-12"
            ></img>
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm xs:text-base">{category.name}</p>
            </div>
            <DropdownMenu
                options={[
                    {
                        icon: 'lucide:pencil',
                        label: 'Edit',
                        onClick: () => navigate(`/category/${category.id}?type=${categoryType}`),
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
                <div className="size-9 xs:size-12"></div>
            </Skeleton>
            <div className="flex flex-1 flex-col gap-0.5">
                <Skeleton>
                    <p className="text-sm xs:text-base">Transportation</p>
                </Skeleton>
            </div>
            <Skeleton>
                <DropdownMenu options={[]} />
            </Skeleton>
        </div>
    );
};
