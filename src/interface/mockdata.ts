export interface MockData {
    productId: string;
    productName: string;
    price: number;
    boughtDate: string;
}

export interface GetMockDataResponse {
    datas: MockData[];
    isEnd: boolean;
}
