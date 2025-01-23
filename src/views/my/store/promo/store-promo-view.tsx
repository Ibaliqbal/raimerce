import CardPromo from "@/components/card/card-promo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { TPromo } from "@/lib/db/schema";

const StorePromoView = () => {
  const { isLoading, data } = useQuery<
    Array<
      Pick<
        TPromo,
        "amount" | "code" | "id" | "uses" | "productsAllowed" | "expiredAt"
      >
    >
  >({
    queryKey: ["store-promo-owner"],
    queryFn: async () =>
      (await instance.get("/users/login/store/promo")).data.data,
    staleTime: 60 * 60 * 1000, // Cache data for 1 hour
  });
  return (
    <section className="col-span-2 flex flex-col gap-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Promo</h1>
        <Button asChild variant="primary">
          <Link href={"/my/store/promo/new"}>Create new promo</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <CardPromo.Skeleton key={i} />
            ))
          : data?.map((promo) => <CardPromo key={promo.id} {...promo} />)}
      </div>
    </section>
  );
};

export default StorePromoView;
