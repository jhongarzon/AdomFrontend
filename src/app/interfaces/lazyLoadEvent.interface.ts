import { FilterMetadata } from './filterMetadata.interface';
import { SortMeta } from './sortMeta.interface';

export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {[s: string]: FilterMetadata;};
}