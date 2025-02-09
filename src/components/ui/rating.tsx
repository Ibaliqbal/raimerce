import { styleReactRating } from "@/utils/constant";
import { Rating as ReactRating, RatingProps } from "@smastrom/react-rating";

const Rating = ({ ...rest }: RatingProps) => {
  return (
    <ReactRating
      style={{
        marginBottom: ".5rem",
        marginTop: ".5rem",
      }}
      className="md:max-w-[120px] max-w-[100px]"
      itemStyles={styleReactRating}
      {...rest}
    />
  );
};

export default Rating;
