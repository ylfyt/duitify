import { Settings } from '@/types/settings.type';
import { BaseRepo, QueryResultOne } from './base-repo';

export class SettingRepo extends BaseRepo {
    public static async getSetting(userId: string): Promise<QueryResultOne<Settings>> {
        return this.db.from('settings').select().eq('user_id', userId).single();
    }

    public static async update<T extends Exclude<keyof Settings, 'id' | 'user_id'>>(
        id: string,
        field: T,
        value: Settings[T],
    ) {
        return this.db
            .from('settings')
            .update({ [field]: value })
            .eq('id', id);
    }
}
