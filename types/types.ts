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
export type WorkflowProps = {
    name: string;
    routes: RouteMethods[]; // Changed from Route[] to RouteMethods[]
    props: Properties[];
    relations: Relation[];
};

export type WorkflowsProps = {
    id: string;
    name: string;
    workflows: WorkflowProps[]
    cors?: CorsOptionsCustom;
}

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

export type RelationTypes = 'one-to-one' | 'one-to-many' | 'many-to-many' | "";

export type Relation = {
    relation: RelationTypes
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

type StaticOrigin = boolean | string | RegExp | (string | RegExp)[];

type CorsHttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD'
    | 'CONNECT'
    | 'TRACE';

type CorsAllowedHeader =
    | 'Accept'
    | 'Authorization'
    | 'Content-Type'
    | 'Origin'
    | 'X-Requested-With'
    | 'Access-Control-Allow-Origin'
    | 'Access-Control-Allow-Headers'
    | 'Cache-Control'
    | 'Pragma'

type CorsExposedHeader =
    | 'Content-Length'
    | 'X-Knowledge-Base-Version'
    | 'X-Request-ID'
    | 'X-RateLimit-Limit'
    | 'X-RateLimit-Remaining'
    | 'X-RateLimit-Reset'
    | 'Authorization'
    | string; // fallback for custom headers

export type CorsOptionsCustom = {
    origin?: StaticOrigin;
    methods?: CorsHttpMethod | CorsHttpMethod[];
    allowedHeaders?: CorsAllowedHeader | CorsAllowedHeader[];
    exposedHeaders?: CorsExposedHeader | CorsExposedHeader[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
};

export type Relations = "one-to-one" | "one-to-many" | "many-to-many";