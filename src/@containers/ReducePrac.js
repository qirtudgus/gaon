const arr = [
  { name: "박성현", age: "28", weapon: "사이구" },
  { name: "박소연", age: "27", weapon: "개미바" },
  { name: "조만억", age: "28", weapon: "기타" },
];

//나이 총합 구하기

const result = arr.reduce((acc, cur) => {
  return acc + Number(cur["age"]);
}, 0);

console.log(result);

//박씨인사람들의 무기만 들어있는 배열





