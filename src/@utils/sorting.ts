function getChosung(char: any) {
  const code = char.charCodeAt(0) - 44032;
  const chosungIndex = Math.floor(code / (21 * 28));
  const chosungList = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  return chosungList[chosungIndex];
}

function groupByFirstCharacter(data: any) {
  const result: any = {};

  data.value.forEach((item: any) => {
    const firstCharacter = getChosung(item.titleKor[0]);
    console.log('firstCharacter');
    console.log(item.titleKor[0], firstCharacter);

    if (!result[firstCharacter]) {
      result[firstCharacter] = [];
    }

    result[firstCharacter].push(item);
  });

  return result;
}

export { groupByFirstCharacter };

const json = {
  value: [
    {
      id: 1,
      titleKor: '나이키',
      titleEng: 'Nike',
    },
    {
      id: 5,
      titleKor: '에리즈',
      titleEng: 'Aries',
    },
    {
      id: 6,
      titleKor: '발리',
      titleEng: 'BALLY',
    },
    {
      id: 7,
      titleKor: '캠퍼',
      titleEng: 'CAMPER',
    },
    {
      id: 8,
      titleKor: '가니',
      titleEng: 'GANNI',
    },
    {
      id: 9,
      titleKor: '헌터',
      titleEng: 'HUNTER',
      logo: 'test_logo.jpg',
      banner: '',
    },
    {
      id: 10,
      titleKor: '아이스버그',
      titleEng: 'ICEBERG',
    },
    {
      id: 11,
      titleKor: '자크뮈스',
      titleEng: 'JACQUEMUS',
    },
    {
      id: 12,
      titleKor: '키이스',
      titleEng: 'keith',
    },
    {
      id: 13,
      titleKor: '라르다니',
      titleEng: 'LARDINI',
    },
    {
      id: 14,
      titleKor: '마르니',
      titleEng: 'MARNI',
    },
    {
      id: 15,
      titleKor: '니모',
      titleEng: 'NEMO',
    },
    {
      id: 16,
      titleKor: '오클리',
      titleEng: 'OAKLEY',
    },
    {
      id: 17,
      titleKor: '레인스',
      titleEng: 'RAINS',
    },
    {
      id: 18,
      titleKor: '사카이',
      titleEng: 'SACAI',
    },
    {
      id: 19,
      titleKor: '텐씨',
      titleEng: 'Ten c',
    },
    {
      id: 20,
      titleKor: '어그',
      titleEng: 'UGG',
    },
    {
      id: 21,
      titleKor: '바르고',
      titleEng: 'VARGO',
    },
    {
      id: 22,
      titleKor: '울파워',
      titleEng: 'WoolPower',
    },
    {
      id: 23,
      titleKor: '와이쓰리',
      titleEng: 'Y-3',
    },
    {
      id: 24,
      titleKor: '잠스트',
      titleEng: 'ZAMST',
    },
    {
      id: 25,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 26,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 27,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 28,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 29,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 30,
      titleKor: '은하수',
      titleEng: 'milky_way',
    },
    {
      id: 31,
      titleKor: '가니',
      titleEng: 'GANNI',
    },
  ],
};
