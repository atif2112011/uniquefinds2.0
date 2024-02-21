import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBids,
  GetProductById,
  GetProducts,
} from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "../../components/Divider";
import moment from "moment";
import BidModel from "./BidModel";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectdImage] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });

        setProduct({ ...response.data, bids: bidsResponse.data });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    product && (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Images */}
          <div className="flex flex-col gap-8">
            <img
              src={product.images[selectedImage]}
              alt=""
              className="w-full h-96 object-cover rounded-md shadow-md"
            />

            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-green-700"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectdImage(index)}
                  src={image}
                  alt=""
                />
              ))}
            </div>

            <div className="text-gray-600">
              <h1 className="text-xl font-semibold">Added On</h1>
              <span>
                {moment(product.createdAt).format("DD-MM-YYYY hh:mm A")}
              </span>
            </div>
          </div>

          {/*Details*/}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900 mb-2">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-Semibold text-orange-900">
                Product Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Price</span>
                <span>$ {product.price}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Year of Purchase</span>
                <span>
                  {moment().subtract(product.age, "years").format("YYYY")}
                </span>
              </div>
            </div>

            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Seller Details
              </h1>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">Name</span>
                <span>{product.seller.name}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">Email</span>
                <span>{product.seller.email}</span>
              </div>
            </div>

            {/* Bids */}
            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={product.seller._id === user._id}
                  className={`${
                    product.seller._id === user._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  New Bid
                </Button>
              </div>

              {product.showBidsOnProductPage &&
                product.bids.map((bid, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 p-4 rounded mt-4 shadow-md"
                  >
                    <div className="flex justify-between text-gray-600">
                      <span className="font-semibold">Name:</span>
                      <span>{bid.buyer.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <BidModel
          product={product}
          reloadData={getData}
          showBidModal={showAddNewBid}
          setShowBidModal={setShowAddNewBid}
        />
      </div>
    )
  );
}

export default ProductInfo;
