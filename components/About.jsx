import Image from "next/image";
import Title from "./ui/Title";

const About = () => {
  return (
    <div className="bg-secondary py-14">
      <div className="container mx-auto flex items-center text-white gap-20 justify-center flex-wrap-reverse">
        <div className="flex justify-center">
          <div className="relative sm:w-[445px] sm:h-[600px]  flex justify-center w-[300px] h-[450px]">
            <Image src="/images/about-img.png" alt="" layout="fill" />
          </div>
        </div>
        <div className="md:w-1/2 ">
          <Title addClass="text-[40px]">We Are BiteBox</Title>
          <p className="my-5 flex flex-col items-center">
            BiteBox is a modern and catchy name for an online food store. 
            It combines the words “bite” (a small portion of food) and “box” (a container or package), 
            giving the impression of convenient, ready-to-eat meals or snacks. The name suggests quick service, 
            simplicity, and a tech-driven brand — perfect for a digital platform that delivers delicious bites 
            straight to customers.
          </p>
          <button className="btn-primary">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default About;
