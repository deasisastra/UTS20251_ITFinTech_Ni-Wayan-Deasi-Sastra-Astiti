import React from "react";
import Title from "../ui/Title";
import CustomerItem from "./CustomerItem";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Customers = () => {
  function NextBtn({ onClick }) {
    return (
      <button
        className="absolute -bottom-12 left-1/2 bg-primary flex items-center justify-center w-10 h-10 rounded-full text-white"
        onClick={onClick}
      >
        <IoIosArrowForward />
      </button>
    );
  }

  function PrevBtn({ onClick }) {
    return (
      <button
        className="absolute -bottom-12 right-1/2 bg-primary flex items-center justify-center w-10 h-10 rounded-full text-white mr-2"
        onClick={onClick}
      >
        <IoIosArrowBack />
      </button>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto mb-20 mt-12">
      <Title addClass="text-[40px] text-center">What Our Customer Says</Title>
      <Slider {...settings}>
        <CustomerItem
          imgSrc="/images/client1.jpg"
          name="Laura"
          testimonial={
            "I absolutely love BiteBox! The food always arrives fresh and perfectly packed. The flavors are amazing you can really taste the quality ingredients. It's now my go to place whenever I'm craving something delicious but don't have time to cook!"
          }
        />
        <CustomerItem
          imgSrc="/images/client2.jpg"
          name="Nanda"
          testimonial={
            "BiteBox never disappoints! The delivery is quick, the portions are generous, and everything tastes homemade. I've tried several dishes, and every single one exceeded my expectations. Highly recommended for anyone who loves good food!"
          }
        />
        <CustomerItem imgSrc="/images/client1.jpg" name="Laura" />
        <CustomerItem imgSrc="/images/client2.jpg" name="Nanda" />
      </Slider>
    </div>
  );
};

export default Customers;
