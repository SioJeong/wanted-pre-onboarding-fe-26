import { useState, useRef, useEffect, useCallback } from 'react';
import { getMockData } from './mockdata';
import Loading from './Loading';
import { GetMockDataResponse, MockData } from './interface/mockdata';

const App = () => {
    const [data, setData] = useState<MockData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const targetRef = useRef<HTMLDivElement | null>(null);

    // 상품들의 가격 합계를 계산하는 함수
    const calculateTotalPrice = (data: MockData[]): number => {
        return data.reduce((acc, item) => acc + item.price, 0);
    };

    const fetchMoreData = useCallback(async () => {
        if (isEnd) return;
        setIsLoading(true);
        const { datas, isEnd: end }: GetMockDataResponse = await getMockData(pageNum);
        setData((prevData) => [...prevData, ...datas]);
        setIsEnd(end);
        setIsLoading(false);
    }, [pageNum, isEnd]);

    useEffect(() => {
        fetchMoreData();
    }, [pageNum, fetchMoreData]);

    useEffect(() => {
        if (isEnd || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPageNum((prevPageNum) => prevPageNum + 1);
                }
            },
            { threshold: 1 }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, [isEnd, isLoading]);

    if (isLoading && pageNum === 0) return <Loading />;

    return (
        <div>
            <h1>무한 스크롤</h1>
            <div>
                {data.map((item, index) => (
                    <div key={item?.productId} className="item">
                        <h3>{index + 1}</h3>
                        <h3>{item?.productName}</h3>
                        <p>구매 금액: ${item.price}</p>
                        <p>구매 일자: {new Date(item.boughtDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            {/* 가격 합계 표시 */}
            <h2>총 금액: ${calculateTotalPrice(data).toFixed(2)}</h2>

            {/* 로딩 표시 */}
            {isLoading && <Loading />}

            {/* 스크롤링 대상 요소 */}
            <div ref={targetRef} className="observer-target" style={{ height: '1px' }} />
        </div>
    );
};

export default App;
