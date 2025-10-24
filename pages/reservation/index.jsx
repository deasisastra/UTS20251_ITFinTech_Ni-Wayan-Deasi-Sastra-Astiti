import React from "react";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

const Index = () => null;

export default Index;
