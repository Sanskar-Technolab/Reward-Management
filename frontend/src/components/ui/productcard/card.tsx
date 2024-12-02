import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import RewardImage from '../../../assets/images/reward_management/Frame.png';

export function ProductCard({ productImage, productName, rewardPoints, onClick }) {
  return (
    <Card className="w-100 mt-5 bg-[#D9D9D9]">
      <CardHeader shadow={false} floated={false}>
        <img
          src={productImage}
          alt="card-image"
          className="w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography
          variant="small"
          className="text-defaultsize text-black p-0 mt-0"
        >
          {productName}
        </Typography>
        <div className="flex justify-between">
          <div className="mb-2">
            <Typography className="text-defaultsize text-defaulttextcolor">
              Points
            </Typography>
            <Typography
              color="blue-gray"
              className="text-defaultsize text-black flex items-center"
            >
              <img
                src={RewardImage}
                className="mr-2 h-5 w-5"
                alt="reward-icon"
              />
              <p>{rewardPoints}</p>
            </Typography>
          </div>
          <div>
            <Button
              className="bg-[#fff] border border-gray-500 rounded-[5px] text-black text-[16.58px] font-normal normal-case"
              onClick={onClick} // Call the passed onClick function here
            >
              Redeem
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ProductCard;
