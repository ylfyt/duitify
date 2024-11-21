export type LabelValue<T = number> = {
    label: string;
    value: T;
};

export type Entity<T = number> = {
    id: T;
    name: string;
};

export type FetchAtom<T> = {
    loading: boolean;
    fetched: boolean;
    data: T;
};
