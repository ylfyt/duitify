import { LoadingButton } from '@/components/loading-button';
import { Modal } from '@/components/modal';
import { ENV } from '@/constants/env';
import { CATEGORY_LOGOS } from '@/constants/logo';
import { QueryResultOne } from '@/repo/base-repo';
import { ExpenseCategoryRepo } from '@/repo/expense-category-repo';
import { IncomeCategoryRepo } from '@/repo/income-category-repo';
import { closeModal } from '@/stores/modal';
import { Category } from '@/types/category.type';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalCategoryCreateProps {
    category?: Category;
    onSuccess: (category: Category) => void;
    categoryType: 'expense' | 'income';
}

export const ModalCategoryCreate: FC<ModalCategoryCreateProps> = ({ onSuccess, category, categoryType }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(category?.name ?? '');
    const [selectedLogo, setSelectedLogo] = useState(category?.logo ? CATEGORY_LOGOS.indexOf(category.logo) : 0);

    const disabled = useMemo(() => !name, [name]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Category>;
        if (!category) {
            switch (categoryType) {
                case 'expense':
                    res = await ExpenseCategoryRepo.createCategory({ name, logo: CATEGORY_LOGOS[selectedLogo] });
                    break;
                case 'income':
                    res = await IncomeCategoryRepo.createCategory({ name, logo: CATEGORY_LOGOS[selectedLogo] });
                    break;
            }
        } else {
            switch (categoryType) {
                case 'expense':
                    res = await ExpenseCategoryRepo.updateCategory(category.id, {
                        name,
                        logo: CATEGORY_LOGOS[selectedLogo],
                    });
                    break;
                case 'income':
                    res = await IncomeCategoryRepo.updateCategory(category.id, {
                        name,
                        logo: CATEGORY_LOGOS[selectedLogo],
                    });
                    break;
            }
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
        toast.success(`Category ${category ? 'updated' : 'created'} successfully`);
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
                        {CATEGORY_LOGOS.map((el, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedLogo(idx)}
                                type="button"
                                className={
                                    'flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 ' +
                                    (idx === selectedLogo ? 'outline-primary' : 'outline-transparent')
                                }
                            >
                                <img className="size-12 rounded-lg" key={idx} src={ENV.BASE_URL + el} alt="" />
                            </button>
                        ))}
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
