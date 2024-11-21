import { DropdownMenu } from '@/components/dropdown-menu';
import { Icon } from '@/components/icon';
import { AccountRepo } from '@/repo/account-repo';
import { appBarCtxAtom } from '@/stores/common';
import { Account } from '@/types/account.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface AccountPageProps {}

const AccountPage: FC<AccountPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        setAppBarCtx({
            title: 'Accounts',
            icon: 'lucide:wallet',
        });
    }, []);

    useEffect(() => {
        (async () => {
            // setLoading(true);
            // const { data, error } = await AccountRepo.getAccounts();
            // setLoading(false);
            // if (error) {
            //     toast.error(error.message);
            //     return;
            // }
            // setAccounts(data);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
                    <Icon icon="lucide:wallet" className="text-3xl" />
                    <div className="flex flex-1 flex-col gap-0.5">
                        <p className="text-lg">Gopay</p>
                        <div className="flex items-center gap-2">
                            <p>Balance: </p>
                            <p className="font-bold text-success">Rp 10.000</p>
                        </div>
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

export default AccountPage;
