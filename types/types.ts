export type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'bigint'
    | 'symbol'
    | 'undefined'
    | 'null'
    | 'object'
    | 'array'
    | 'function'
    | 'date'
    | 'any'
    | 'unknown'
    | 'void'
    | 'never'
    | 'json'
    | (string & {});

export type RouteMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'GET_ID';

// Remove the Route type and update EditableData
export type EditableData = {
    name: string;
    routes: RouteMethods[]; // Changed from Route[] to RouteMethods[]
    props: Properties[];
    relations: Relation[];
};

export type ValidationRule =
    | { type: 'minLength'; value: number }
    | { type: 'maxLength'; value: number }
    | { type: 'pattern'; value: string }
    | { type: 'min'; value: number }
    | { type: 'max'; value: number }
    | { type: 'email' }
    | { type: 'url' }
    | { type: 'uuid' }
    | { type: 'enum'; values: string[] }
    | { type: 'startsWith'; value: string }
    | { type: 'endsWith'; value: string }
    | { type: 'custom'; validator: string };

export type Properties = {
    name: string;
    type: FieldType;
    nullable: boolean;
    validation?: ValidationRule[];
};

export type Relation = {
    relation: 'one-to-one' | 'one-to-many' | 'many-to-many';
    isParent: boolean;
    controller: string;
};

export const FieldTypes: FieldType[] = [
    'string',
    'number',
    'boolean',
    'bigint',
    'symbol',
    'undefined',
    'null',
    'object',
    'array',
    'function',
    'date',
    'any',
    'unknown',
    'void',
    'never',
    'json',
];

export const ValidationTypes = [
    'minLength',
    'maxLength',
    'pattern',
    'min',
    'max',
    'email',
    'url',
    'uuid',
    'enum',
    'startsWith',
    'endsWith',
    'custom',
];