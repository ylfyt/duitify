import { ModalWithResult } from '@/components/modal';
import { openModal } from '@/stores/modal';

interface IStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}

function encryt(key: string, value: string) {
    return `${key}:${value}`;
}

const resolvers: Record<number, ((arg: string) => void)[]> = {};

function showModal(id: number) {
    return new Promise<string>((resolve) => {
        const resultId = openModal(ModalWithResult, {
            onClose: (modalId) => {
                console.log(modalId);
                resolve('hello');
                resolvers[id]?.forEach((resolver) => resolver('hello'));
            },
        });
        if (resultId !== -1) return;
        if (!resolvers[id]) resolvers[id] = [];
        resolvers[id].push(resolve);
    });
}

class CustomStorage implements IStorage {
    private secretKey?: string;

    async getItem(key: string): Promise<string | null> {
        if (this.secretKey) {
            console.log('secret key already set');
            return localStorage.getItem(key);
        }

        console.log('trying to get secretKey');
        const res = await showModal(999999999999);
        this.secretKey = res;
        console.log('got secretKey', this.secretKey);
        return localStorage.getItem(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        console.log('setItem', key, value);
        // value = encryt(this.secretKey, value);
        localStorage.setItem(key, value);
    }

    async removeItem(key: string): Promise<void> {
        console.log('removeItem', key);
        localStorage.removeItem(key);
    }
}

export const storage = new CustomStorage();
