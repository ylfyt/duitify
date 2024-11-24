import { DropdownMenu } from '@/components/dropdown-menu';
import { QueryResultMany } from '@/repo/base-repo';
import { ExpenseCategoryRepo } from '@/repo/expense-category-repo';
import { appBarCtxAtom } from '@/stores/common';
import { Category } from '@/types/category.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CATEGORIES = ['Expense', 'Income', 'Transfer'];

interface CategoryPageProps {}

const CategoryPage: FC<CategoryPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const [selected, setSelected] = useState(0);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        setAppBarCtx({
            title: 'Categories',
            actions: [
                <button onClick={() => {}} className="dai-btn dai-btn-success dai-btn-sm">
                    Create
                </button>,
            ],
        });
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            let res: QueryResultMany<Category>;
            if (selected === 0) res = await ExpenseCategoryRepo.getCategories();
            else if (selected === 1) res = await ExpenseCategoryRepo.getCategories();
            else res = await ExpenseCategoryRepo.getCategories();
            setLoading(false);

            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setCategories(res.data ?? []);
        })();
    }, [selected]);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div role="tablist" className="dai-tabs-boxed dai-tabs bg-base-100">
                {CATEGORIES.map((el, idx) => (
                    <button
                        key={idx}
                        role="tab"
                        onClick={() => setSelected(idx)}
                        className={'dai-tab ' + (idx === selected ? 'dai-tab-active' : '')}
                    >
                        {el}
                    </button>
                ))}
            </div>
            <div>
                <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
                    <img className="size-12"></img>
                    <div className="flex flex-1 flex-col gap-0.5">
                        <p className="text-lg">Food</p>
                    </div>
                    <DropdownMenu
                        options={[
                            {
                                icon: 'lucide:pencil',
                                label: 'Edit',
                                onClick: () => {},
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
