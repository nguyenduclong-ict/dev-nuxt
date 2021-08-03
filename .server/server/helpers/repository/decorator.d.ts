export interface EntityMeta {
}
export interface FieldOptions {
    type?: 'json' | 'tinymce' | 'filepicker';
}
export declare function Meta(meta: EntityMeta): (constructor: any) => void;
export declare function FieldOption(options: FieldOptions): (target: any, key: string) => void;
