// ! 이중 스크롤을 막는 방법은 css의 overscroll-none 이었다.
// ! 이외에 touch-callout 등 모바일을 위한 css도 있다.

import { FC, HTMLAttributes } from "react";
import "./App.css";
import { FramerBottomSheet } from "./@components/FramerBottomSheet6";

function App() {
  return (
    <div className="App">
      <div className="    bg-gradient-to-t bg-slate-500 h-[130vh]">배경</div>
      <FramerBottomSheet
        initialPosition="top"
        style={{ backgroundColor: "#FAFAFA" }}
        snapPoint={{ top: { height: 400 }, bottom: { height: 100 } }}
        header={true}
        bottomScrollLock
        headerElement={<div className="h-10 bg-white">헤더</div>}
      >
        <BoxList />
      </FramerBottomSheet>
    </div>
  );
}

export default App;

const BoxList = () => {
  return (
    <>
      <div className="text-20  text-center">
        <div className="bg-blue-500 h-[200px]">1번</div>
        <div className="bg-green-500 h-[200px]">2번</div>
        <div className="bg-yellow-500 h-[200px]">3번</div>
        <div className="bg-red-500 h-[200px]">4번</div>
        <div className="bg-purple-500 h-[200px]">5번</div>

        <div className="flex overflow-x-auto w-full h-[200px] whitespace-nowrap">
          <div className="bg-blue-500 h-[200px] w-[500px] flex-shrink-0">
            가로1번
          </div>
          <div className="bg-green-500 h-[200px] w-[500px] flex-shrink-0 ">
            가로2번
          </div>
          <div className="bg-yellow-500 h-[200px] w-[500px] flex-shrink-0">
            가로3번
          </div>
          <div className="bg-red-500 h-[200px] w-[500px] flex-shrink-0">
            가로4번
          </div>
          <div className="bg-purple-500 h-[200px] w-[500px] flex-shrink-0">
            가로5번
          </div>
        </div>
      </div>
    </>
  );
};

export interface RecentFuneralHomeCardProps
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
  url: string;
}

export interface FuneralHomeCardProps {
  title: string;
  rate: number;
  review: number;
  address: string;
  keywords: string[];
  price: number;
  url: string;
  x: string;
  y: string;
  className?: string;
}

export const FuneralHomeCard: FC<FuneralHomeCardProps> = ({
  title,
  rate,
  review,
  address,
  keywords,
  price,
  url,
  className,
}) => {
  return (
    <Card
      className={`flex min-w-[278px] shrink-0 flex-col gap-[10px] ${className}`}
    >
      {/* 이미지 */}
      <img
        src={url}
        alt="funeralHome"
        className="h-[198px] w-full rounded-xl object-cover"
      ></img>

      <div className="px-[10px]">
        {/* 이름, 별점 */}
        <div className="mb-[5px] flex items-start justify-between">
          <p className="text-18 font-bold">{title}</p>
          <div className="flex items-center"></div>
        </div>
        {/* 주소 */}
        <Address address={address} className="text-12" />
      </div>
      {/* 태그 */}
      {keywords && (
        <div className="flex flex-wrap gap-[6px] px-[10px]">
          {keywords.map((item) => {
            return <Keyword key={item}>{item}</Keyword>;
          })}
        </div>
      )}

      {/* 가격 */}
      <div className="relative  flex items-start justify-end p-[10px]">
        <span className="relative top-1 align-top text-12 text-point-pink">
          최저가
        </span>
        <span className="ml-[5px] text-20 font-bold">
          {price ? `${(price ?? 0).toLocaleString()}원` : "가격 미등록"}
          <span className="align-top text-12">{` ~`}</span>
        </span>
      </div>
    </Card>
  );
};

interface AddressProps extends HTMLAttributes<HTMLDivElement> {
  address?: string;
  distance?: number;
}

const Address: FC<AddressProps> = ({
  address,
  distance,
  className,
  ...props
}) => {
  return (
    <div className={`flex items-center  break-keep ${className}`} {...props}>
      <span>{address}</span>
      {distance && <span className="font-medium">{`${distance}`}</span>}
    </div>
  );
};

export const funeralHomeMocking = [
  {
    title: "포포스",
    rate: 2,
    review: 1102,
    address: "서울 광진구 가로수길",
    keywords: [
      "굿나잇버디",
      "굿나잇",
      "버디",
      "버디버디",
      "네이트온싸이월드네이트온싸이월드",
    ],
    price: 213126,
    url: "https://i.namu.wiki/i/09TmbjtlbcUOXvzGJWkkjnObVKGOTh7jME7eqse_69NMQKJwYoUGnS7fIgr0dHGf_4A_DptAG3Q2lUhFlP6GPg.webp",
    x: "126.956648620283",
    y: "37.4805340354467",
  },
  {
    title: "아구몬",
    rate: 3,
    review: 1102,
    address: "서울 광진구 가로수길",
    keywords: ["굿나잇버디", "굿나잇", "버디"],
    price: 214556,
    url: "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png",
    x: "126.94",
    y: "37.47",
  },
  {
    title: "파파존스1",
    rate: 5,
    review: 0,
    address: "서울 광진구 가로수길",
    keywords: [],
    price: 2134556,
    url: "https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/interior3ds/167400552441937308.png?gif=1&w=480&h=320&c=c&q=80&webp=1",
    x: "126.95",
    y: "37.48",
  },
  {
    title: "파파존스2",
    rate: 5,
    review: 0,
    address: "서울 광진구 가로수길",
    keywords: [],
    price: 21356,
    url: "https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/interior3ds/167400552441937308.png?gif=1&w=480&h=320&c=c&q=80&webp=1",
    x: "128.7260144",
    y: "35.718096",
  },
  {
    title: "파파존스3",
    rate: 5,
    review: 0,
    address: "서울 광진구 가로수길",
    keywords: [],
    price: 213556,
    url: "https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/interior3ds/167400552441937308.png?gif=1&w=480&h=320&c=c&q=80&webp=1",
    x: "129.040706",
    y: "35.4533003",
  },
];
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card: FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={` whitespace-pre-line rounded-[20px] bg-white p-[10px] tracking-[-0.3px] shadow-[0_4px_8px_0_rgba(0,0,0,0.05)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
const Keyword: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={`rounded-full bg-key-6 px-2 py-[2px] text-center text-10 tracking-[-0.3px] text-key-1 ${className}`}
    >
      <span className=" mr-[2px] text-key-2">#</span>
      {children}
    </div>
  );
};
