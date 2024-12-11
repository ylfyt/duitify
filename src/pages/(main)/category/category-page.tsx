import { appBarCtxAtom } from '@/stores/common';
import { openModal } from '@/stores/modal';
import { CategoryType } from '@/types/category.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ModalCategoryCreate } from './components/modal-category-create';
import { CategoryCard, CategoryCardSkeleton } from './components/category-card';
import { useCategoryAtom } from '@/stores/category';

interface CategoryPageProps {}

const CategoryPage: FC<CategoryPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const { data: globalCategories, loading, refresh, fetched, setData: setCategories } = useCategoryAtom();

    const [selected, setSelected] = useState<CategoryType>('expense');

    const categories = useMemo(
        () => globalCategories.filter((el) => el.type === selected),
        [globalCategories, selected],
    );

    useEffect(() => {
        setAppBarCtx({
            title: 'Categories',
            actions: [
                <button
                    onClick={() =>
                        openModal(ModalCategoryCreate, {
                            onSuccess: (category) => setCategories((prev) => [category, ...prev]),
                            categoryType: selected,
                        })
                    }
                    className="dai-btn dai-btn-success dai-btn-xs xs:dai-btn-sm"
                >
                    Create
                </button>,
            ],
        });
    }, [selected]);

    useEffect(() => {
        if (fetched) return;
        (async () => {
            const msg = await refresh();
            if (!msg) return;
            toast.error(msg);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 p-2">
            <div role="tablist" className="dai-tabs-boxed dai-tabs bg-base-100">
                {(['expense', 'income'] as CategoryType[]).map((el, idx) => (
                    <button
                        key={idx}
                        role="tab"
                        onClick={() => setSelected(el)}
                        className={'dai-tab capitalize ' + (el === selected ? 'dai-tab-active' : '')}
                    >
                        {el}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-2">
                {loading ? (
                    Array.from({ length: 14 }).map((_, idx) => <CategoryCardSkeleton key={idx} />)
                ) : categories.length === 0 ? (
                    <p className="text-center">No categories found</p>
                ) : (
                    categories.map((el, idx) => (
                        <CategoryCard
                            key={idx}
                            category={el}
                            categoryType={selected}
                            onDeleted={(id) => setCategories((prev) => prev.filter((el) => el.id !== id))}
                            onUpdated={(category) => {
                                setCategories((prev) => prev.map((el) => (el.id === category.id ? category : el)));
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
