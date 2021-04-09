import { Query, QueryDocumentSnapshot, DocumentData, DocumentSnapshot } from '@firebase/firestore-types';
export interface PaginationOptions {
    limit?: number;
}
declare const usePagination: <T extends DocumentData>(firestoreQuery: Query, options: PaginationOptions) => {
    docs: QueryDocumentSnapshot<DocumentData>[];
    items: (T & Pick<DocumentSnapshot<DocumentData>, "id">)[];
    isLoading: boolean;
    isStart: boolean;
    isEnd: boolean;
    getPrev: () => void;
    getNext: () => void;
};
export { usePagination };
