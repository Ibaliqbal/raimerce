import FormNews from "@/layouts/form/form-news";
import React from "react";

const StoreCreateNewsView = () => {
  return (
    <section className="col-span-2 flex flex-col gap-4">
      <h1 className="text-2xl">What news do you want to tell ? 🧐</h1>
      <FormNews />
    </section>
  );
};

export default StoreCreateNewsView;
