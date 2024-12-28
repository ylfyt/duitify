import { LoadingButton } from '@/components/loading-button';
import { CATEGORY_LOGO_BASE } from '@/constants/logo';
import { QueryResultOne } from '@/repo/base-repo';
import { CategoryRepo } from '@/repo/category-repo';
import { sessionAtom } from '@/stores/auth';
import { useCategoryAtom } from '@/stores/category';
import { useCategoryImageAtom } from '@/stores/category-image';
import { appBarCtxAtom, showLoading } from '@/stores/common';
import { Category } from '@/types/category.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CategoryCreatePageProps {}

const CategoryCreatePage: FC<CategoryCreatePageProps> = () => {
    const [session] = useAtom(sessionAtom);
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { id } = useParams<{ id: string }>();

    const [category, setCategory] = useState<Category>();

    const { setData: setCategories } = useCategoryAtom();
    const { data: categoryImages, refresh, fetched, loading: loadingCategoryImages } = useCategoryImageAtom();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(category?.name ?? '');
    const [selectedLogo, setSelectedLogo] = useState(0);

    const disabled = useMemo(() => !name, [name]);

    useEffect(() => {
        setAppBarCtx({
            title: id ? 'Update Category' : 'Create ' + (params.get('type') === 'income' ? 'Income' : 'Expense'),
            back: true,
        });
    }, [params]);

    useEffect(() => {
        if (fetched) return;

        (async () => {
            const msg = await refresh();
            if (msg) return toast.error(msg);
        })();
    }, []);

    useEffect(() => {
        if (!id) return;

        (async () => {
            showLoading(true);
            const { data, error } = await CategoryRepo.getCategory(id);
            showLoading(false);
            if (data) return setCategory(data);

            toast.error(!data || !error ? 'Category not found' : error.message);
            navigate('/category', { replace: true });
        })();
    }, []);

    useEffect(() => {
        if (!category) return;
        setName(category.name);
    }, [category]);

    useEffect(() => {
        if (!fetched) return;

        setSelectedLogo(category?.logo ? categoryImages.indexOf(category.logo) : 0);
    }, [fetched, categoryImages, category]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Category>;
        if (!id || !category) {
            res = await CategoryRepo.createCategory({
                name,
                logo: categoryImages[selectedLogo],
                type: params.get('type') === 'income' ? 'income' : 'expense',
                user_id: session!.user.id,
            });
        } else {
            res = await CategoryRepo.updateCategory(id, {
                name,
                logo: categoryImages[selectedLogo],
                type: category.type,
            });
        }
        setLoading(false);

        if (res.error || !res.data) {
            toast.error(!res.data || !res.error ? 'Something went wrong' : res.error.message);
            return;
        }
        setCategories((prev) => (id ? prev.map((el) => (el.id === id ? res.data! : el)) : [res.data!, ...prev]));
        history.back();
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-2">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                className="grid grid-cols-1 gap-2"
            >
                <label className="dai-form-control w-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Name</span>
                    </div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Category Name"
                        className="dai-input dai-input-bordered"
                    />
                </label>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Logo</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {loadingCategoryImages ? (
                            Array.from({ length: 10 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 outline-transparent"
                                >
                                    <div className="dai-skeleton size-12 rounded-lg" />
                                </button>
                            ))
                        ) : categoryImages.length === 0 ? (
                            <div></div>
                        ) : (
                            categoryImages.map((el, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedLogo(idx)}
                                    type="button"
                                    className={
                                        'flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 ' +
                                        (idx === selectedLogo ? 'outline-primary' : 'outline-transparent')
                                    }
                                >
                                    <img
                                        className="size-12 rounded-lg"
                                        key={idx}
                                        src={`${CATEGORY_LOGO_BASE}/${el}`}
                                        alt=""
                                    />
                                </button>
                            ))
                        )}
                    </div>
                </label>
                <div className="flex justify-end pt-2">
                    <LoadingButton
                        size="sm"
                        disabled={disabled}
                        loading={loading}
                        type="submit"
                        className="dai-btn-primary"
                    >
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
};

export default CategoryCreatePage;
