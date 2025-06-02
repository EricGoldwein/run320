declare module 'papaparse' {
    export interface ParseResult<T> {
        data: T[];
        errors: ParseError[];
        meta: ParseMeta;
    }

    export interface ParseError {
        type: string;
        code: string;
        message: string;
        row: number;
    }

    export interface ParseMeta {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
    }

    export interface ParseConfig {
        delimiter?: string;
        header?: boolean;
        dynamicTyping?: boolean;
        preview?: number;
        encoding?: string;
        worker?: boolean;
        comments?: boolean | string;
        step?: (results: ParseResult<any>, parser: Parser) => void;
        complete?: (results: ParseResult<any>, file?: File) => void;
        error?: (error: ParseError, file?: File) => void;
        download?: boolean;
        skipEmptyLines?: boolean;
        chunk?: (results: ParseResult<any>, parser: Parser) => void;
        fastMode?: boolean;
        beforeFirstChunk?: (chunk: string) => string | void;
        transform?: (value: string) => string;
        transformHeader?: (header: string) => string;
    }

    export interface Parser {
        abort(): void;
        stream(input: string): void;
    }

    export function parse<T = any>(input: string | File, config?: ParseConfig): ParseResult<T>;
    export function unparse(data: any[], config?: ParseConfig): string;
    export function parseFiles(files: File[], config?: ParseConfig): void;
    export function parseStream(input: string, config?: ParseConfig): Parser;
} 