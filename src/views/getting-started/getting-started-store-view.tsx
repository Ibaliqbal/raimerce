import FormGettingStartedStore from "@/layouts/form/form-getting-started-store";

const GettingStartedStoreView = () => {
  return (
    <main className="flex flex-col gap-4 wrapper-page pb-10">
      <h1 className="text-2xl font-semibold leading-relaxed">
        Wujudkan mimpi menjadi pengusaha sukses ! Hadirkan produk unikmu dan
        raih kesuksesan bersama kami!
      </h1>
      <FormGettingStartedStore />
    </main>
  );
};

export default GettingStartedStoreView;
