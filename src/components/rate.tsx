import { IoIosStarOutline, IoIosStarHalf, IoIosStar } from "react-icons/io";

const Rate: React.FC<RateProps> = ({ rates }) => {
  const genStars = (x: number, init: number[] = [], count = 5): number[] => {
    if (count <= 0) return init;
    return genStars(x - 20, [...init, Math.min(20, x)], count - 1);
  };

  return (
    <div className="inline-flex items-center">
      {genStars(rates).map((x, i) => {
        if (x >= 20) return <IoIosStar key={i} />;
        if (x >= 10) return <IoIosStarHalf key={i} />;
        return <IoIosStarOutline key={i} />;
      })}
      <span className="text-base ml-2">{rates / 10}</span>
    </div>
  );
};

interface RateProps {
  rates: number;
}

export default Rate;
