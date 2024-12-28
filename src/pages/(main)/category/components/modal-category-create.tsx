import { LoadingButton } from '@/components/loading-button';
import { Modal } from '@/components/modal';
import { CATEGORY_LOGO_BASE } from '@/constants/logo';
import { QueryResultOne } from '@/repo/base-repo';
import { CategoryRepo } from '@/repo/category-repo';
import { sessionAtom } from '@/stores/auth';
import { useCategoryImageAtom } from '@/stores/category-image';
import { closeModal } from '@/stores/modal';
import { Category } from '@/types/category.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalCategoryCreateProps {
    category?: Category;
    onSuccess: (category: Category) => void;
    categoryType: 'expense' | 'income';
}

export const ModalCategoryCreate: FC<ModalCategoryCreateProps> = ({ onSuccess, category, categoryType }) => {
    const [session] = useAtom(sessionAtom);

    const { data: categoryImages, refresh, fetched, loading: loadingCategoryImages } = useCategoryImageAtom();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(category?.name ?? '');
    const [selectedLogo, setSelectedLogo] = useState(0);

    const disabled = useMemo(() => !name, [name]);

    useEffect(() => {
        if (fetched) return;

        (async () => {
            const msg = await refresh();
            if (msg) return toast.error(msg);
        })();
    }, []);

    useEffect(() => {
        if (!fetched) return;

        setSelectedLogo(category?.logo ? categoryImages.indexOf(category.logo) : 0);
    }, [fetched, categoryImages, category]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Category>;
        if (!category) {
            res = await CategoryRepo.createCategory({
                name,
                logo: categoryImages[selectedLogo],
                type: categoryType,
                user_id: session!.user.id,
            });
        } else {
            res = await CategoryRepo.updateCategory(category.id, {
                name,
                logo: categoryImages[selectedLogo],
                type: categoryType,
            });
        }
        setLoading(false);

        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        if (!res.data) {
            toast.error('Something went wrong');
            return;
        }
        onSuccess(res.data);
        closeModal();
    };

    return (
        <Modal title={category ? 'Update Category' : 'Create Category'} className="w-[90vw] max-w-[30rem]">
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
                    <div className="flex items-center gap-3 overflow-x-scroll px-2 py-2">
                        {loadingCategoryImages ? (
                            Array.from({ length: 10 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 outline-transparent"
                                >
                                    <img className="dai-skeleton size-12 rounded-lg" alt="" />
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
                    <LoadingButton disabled={disabled} loading={loading} type="submit" className="dai-btn-primary">
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Modal>
    );
};
