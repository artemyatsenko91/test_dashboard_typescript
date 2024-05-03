export interface IDataResponse {
    tableHeaders: {
        name: string;
    }[];
    tableInfo: ITableInfo[];
}

export interface ITableInfo {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    country: string;
    status: string;
}
