const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 대한민국 전국 주요 지역별 실시간 부동산 데이터 (파주 운정 및 전국 확대)
const regionalData = [
  {
    id: 'gyeonggi-paju',
    name: '경기 파주 운정신도시',
    province: '경기도',
    category: '비규제지역',
    avgPricePerPyeong: 2200,
    avgApartmentPrice: 6.8,
    jeonseRatio: 65.4,
    sentimentIndex: 106.8,
    priceChange1Yr: 5.4,
    tradeVolumeChange: 19.2,
    landRating: 'A',
    buildingRating: 'A',
    topIssues: ['GTX-A 운정역 개통 및 역세권 개발', '지하철 3호선 운정 연장', '운정 테크노밸리 산단'],
    propertyTypes: {
      apartment: { price: '6.8억', rentalYield: '3.8%', landRatio: '상' },
      building: { price: '28억', rentalYield: '4.9%', capRate: '4.6%' },
      land: { price: '평당 2,500만', developmentPotential: '상' },
      villa: { price: '2.8억', rentalYield: '5.2%', moaTown: '해당' }
    },
    scores: { transport: 94, school: 92, commerce: 90, development: 97, liquidity: 92 }
  },
  {
    id: 'seoul-gangnam',
    name: '서울 강남구',
    province: '서울특별시',
    category: '투기과열지구',
    avgPricePerPyeong: 8800,
    avgApartmentPrice: 26.5,
    jeonseRatio: 48.2,
    sentimentIndex: 112.4,
    priceChange1Yr: 7.2,
    tradeVolumeChange: 14.5,
    landRating: 'A+',
    buildingRating: 'A+',
    topIssues: ['영동대로 복합환승센터', '압구정·대치 재건축 규제완화', 'GBD 테크 기업 수요'],
    propertyTypes: {
      apartment: { price: '26.5억', rentalYield: '2.1%', landRatio: '고' },
      building: { price: '120억', rentalYield: '3.4%', capRate: '3.2%' },
      land: { price: '평당 1.5억', developmentPotential: '최상' },
      villa: { price: '8.5억', rentalYield: '3.8%', moaTown: '진행중' }
    },
    scores: { transport: 98, school: 99, commerce: 97, development: 95, liquidity: 98 }
  },
  {
    id: 'seoul-yongsan',
    name: '서울 용산구',
    province: '서울특별시',
    category: '투기과열지구',
    avgPricePerPyeong: 7600,
    avgApartmentPrice: 22.8,
    jeonseRatio: 51.0,
    sentimentIndex: 108.9,
    priceChange1Yr: 8.5,
    tradeVolumeChange: 18.2,
    landRating: 'A+',
    buildingRating: 'A+',
    topIssues: ['용산정비창 국제업무지구 개발', '용산 국가공원 조성', '한남뉴타운 재개발'],
    propertyTypes: {
      apartment: { price: '22.8억', rentalYield: '2.3%', landRatio: '고' },
      building: { price: '95억', rentalYield: '3.6%', capRate: '3.4%' },
      land: { price: '평당 1.2억', developmentPotential: '최상' },
      villa: { price: '9.2억', rentalYield: '3.5%', moaTown: '유력' }
    },
    scores: { transport: 96, school: 88, commerce: 95, development: 99, liquidity: 95 }
  },
  {
    id: 'seoul-seongdong',
    name: '서울 성동구 (성수·옥수)',
    province: '서울특별시',
    category: '조정대상지역',
    avgPricePerPyeong: 6300,
    avgApartmentPrice: 18.9,
    jeonseRatio: 53.5,
    sentimentIndex: 105.1,
    priceChange1Yr: 9.1,
    tradeVolumeChange: 21.0,
    landRating: 'A+',
    buildingRating: 'A',
    topIssues: ['성수동 글로벌 IT/패션 클러스터', '삼표레미콘 부지 첨단개발', '성수전략정비구역'],
    propertyTypes: {
      apartment: { price: '18.9억', rentalYield: '2.5%', landRatio: '중상' },
      building: { price: '80억', rentalYield: '3.9%', capRate: '3.7%' },
      land: { price: '평당 1.1억', developmentPotential: '상' },
      villa: { price: '7.8억', rentalYield: '4.0%', moaTown: '추진중' }
    },
    scores: { transport: 93, school: 86, commerce: 98, development: 96, liquidity: 94 }
  },
  {
    id: 'gyeonggi-bundang',
    name: '경기 성남 분당·판교',
    province: '경기도',
    category: '1기신도시 특별법 대상',
    avgPricePerPyeong: 5100,
    avgApartmentPrice: 15.2,
    jeonseRatio: 56.4,
    sentimentIndex: 104.5,
    priceChange1Yr: 6.3,
    tradeVolumeChange: 15.8,
    landRating: 'A+',
    buildingRating: 'A',
    topIssues: ['노후계획도시 재건축 선도지구 지정', '판교 제2·제3 테크노밸리', 'GTX-A 개통 효과'],
    propertyTypes: {
      apartment: { price: '15.2억', rentalYield: '2.7%', landRatio: '상' },
      building: { price: '65억', rentalYield: '4.1%', capRate: '3.9%' },
      land: { price: '평당 6,800만', developmentPotential: '상' },
      villa: { price: '6.0억', rentalYield: '4.2%', moaTown: '해당없음' }
    },
    scores: { transport: 95, school: 96, commerce: 92, development: 94, liquidity: 93 }
  },
  {
    id: 'gyeonggi-dongtan',
    name: '경기 화성 동탄신도시',
    province: '경기도',
    category: '비규제지역',
    avgPricePerPyeong: 2900,
    avgApartmentPrice: 9.5,
    jeonseRatio: 62.1,
    sentimentIndex: 102.3,
    priceChange1Yr: 4.9,
    tradeVolumeChange: 16.4,
    landRating: 'A',
    buildingRating: 'A',
    topIssues: ['GTX-A 동탄역 개통', '동탄 도시철도 트램 건설', '용인 삼성 반도체 메가클러스터'],
    propertyTypes: {
      apartment: { price: '9.5억', rentalYield: '3.4%', landRatio: '중상' },
      building: { price: '38억', rentalYield: '4.7%', capRate: '4.4%' },
      land: { price: '평당 3,100만', developmentPotential: '상' },
      villa: { price: '3.5억', rentalYield: '5.1%', moaTown: '해당없음' }
    },
    scores: { transport: 93, school: 91, commerce: 91, development: 96, liquidity: 91 }
  },
  {
    id: 'daejeon-yuseong',
    name: '대전 유성구 (도안·노은)',
    province: '대전광역시',
    category: '비규제지역',
    avgPricePerPyeong: 2100,
    avgApartmentPrice: 6.9,
    jeonseRatio: 66.8,
    sentimentIndex: 97.2,
    priceChange1Yr: 3.1,
    tradeVolumeChange: 8.5,
    landRating: 'A',
    buildingRating: 'A',
    topIssues: ['대덕연구개발특구 첨단 R&D', '유성 나노·반도체 국가산업단지', '도안신도시 2·3단계'],
    propertyTypes: {
      apartment: { price: '6.9억', rentalYield: '3.7%', landRatio: '중상' },
      building: { price: '30억', rentalYield: '5.0%', capRate: '4.7%' },
      land: { price: '평당 2,400만', developmentPotential: '상' },
      villa: { price: '2.7억', rentalYield: '5.4%', moaTown: '해당없음' }
    },
    scores: { transport: 88, school: 94, commerce: 89, development: 93, liquidity: 87 }
  },
  {
    id: 'busan-haeundae',
    name: '부산 해운대구 (우동·중동)',
    province: '부산광역시',
    category: '비규제지역',
    avgPricePerPyeong: 3400,
    avgApartmentPrice: 10.4,
    jeonseRatio: 55.8,
    sentimentIndex: 94.2,
    priceChange1Yr: 3.2,
    tradeVolumeChange: 7.1,
    landRating: 'A',
    buildingRating: 'A',
    topIssues: ['센텀2지구 도시첨단산업단지', '해운대 재건축 정비사업', '오시리아 관광단지'],
    propertyTypes: {
      apartment: { price: '10.4억', rentalYield: '3.1%', landRatio: '상' },
      building: { price: '48억', rentalYield: '4.6%', capRate: '4.3%' },
      land: { price: '평당 4,500만', developmentPotential: '상' },
      villa: { price: '3.8억', rentalYield: '4.9%', moaTown: '진행중' }
    },
    scores: { transport: 88, school: 92, commerce: 95, development: 89, liquidity: 88 }
  }
];

const realTimeNews = [
  {
    id: 1,
    title: "경기 파주 운정신도시 GTX-A 역세권 아파트 실거래가 신고가 갱신… 수도권 북부 핵심 부상",
    time: "2026-07-24 21:50",
    tag: "GTX/교통",
    summary: "운정역 역세권 아파트 매수세가 확산되며 평당가 2,200만 원 선을 돌파했습니다."
  },
  {
    id: 2,
    title: "한국은행 기준금리 2.75% 동결… 부동산 시장 지역별 차별화 심화",
    time: "2026-07-24 18:30",
    tag: "금융/금리",
    summary: "금리 인하 기조 속에 수도권 주요 상급지와 지방 간의 매매가 양극화 현상이 지속되고 있습니다."
  }
];

// API 엔드포인트
app.get('/api/regions', (req, res) => {
  res.json({ success: true, count: regionalData.length, data: regionalData });
});

app.get('/api/news', (req, res) => {
  res.json({ success: true, data: realTimeNews });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 대한민국 부동산 전국 분석 프로그램 서버 구동 완료!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
