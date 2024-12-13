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
          className="w-full object-fill h-[200px]"
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
          <div className="md:w-[50%] sm:w-[100%] flex md:justify-center sm:justify-end items-center">
            <Button
              className="bg-[#fff] md:py-0 sm:py-2 py-3 md:px-2 sm:px-5  border border-gray-500 rounded-[5px] text-black text-[16.58px] font-normal normal-case md:h-[40px] "
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
