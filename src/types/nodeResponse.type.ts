export interface CreateBattleResponse {
    digest: string;
    objectChanges: ObjectChange[];
    confirmedLocalExecution: boolean;
}

export type ObjectChange = MutatedObject | CreatedObject | DeletedObject;

export interface BaseObjectChange {
    type: 'mutated' | 'created' | 'deleted';
    sender: string;
    owner: {
        AddressOwner?: string;
        ObjectOwner?: string;
        Shared?: {
            initial_shared_version: string;
        };
        Immutable?: null;
    };
    objectType: string;
    objectId: string;
    version: string;
    digest: string;
}

export interface MutatedObject extends BaseObjectChange {
    type: 'mutated';
    previousVersion: string;
}

export interface CreatedObject extends BaseObjectChange {
    type: 'created';
}

export interface DeletedObject extends BaseObjectChange {
    type: 'deleted';
    previousVersion: string;
}

// Utility types để truy xuất thông tin từ response dễ dàng hơn