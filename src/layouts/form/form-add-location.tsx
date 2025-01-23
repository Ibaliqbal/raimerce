import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addLocationSchema, AddLocationT } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import SubmitButton from "./submit-button";
import { SelectGroup } from "@radix-ui/react-select";
import { useRouter } from "next/router";
import instance from "@/lib/axios/instance";
import { toast } from "sonner";
import { fetchCities, fetchDistricts, fetchProvincies } from "@/utils/api";

type OptionGeographics = {
  id: string;
  name: string;
};

const FormAddLocation = () => {
  const [geographic, setGeographic] = useState<{
    provincies: Array<OptionGeographics>;
    cities: Array<OptionGeographics>;
    district: Array<OptionGeographics>;
  }>({
    cities: [],
    district: [],
    provincies: [],
  });

  const form = useForm<AddLocationT>({
    resolver: zodResolver(addLocationSchema),
  });

  const router = useRouter();
  const city = useWatch({ control: form.control, name: "city" });
  const province = useWatch({ control: form.control, name: "province" });

  useEffect(() => {
    const loadProvincies = async () => {
      try {
        const result = await fetchProvincies();
        setGeographic((prev) => ({ ...prev, provincies: result }));
      } catch (err) {
        toast.error("Failed to load provinces");
      }
    };
    loadProvincies();
  }, []);

  useEffect(() => {
    if (province) {
      const loadCities = async () => {
        try {
          const result = await fetchCities(province);
          setGeographic((prev) => ({ ...prev, cities: result }));
        } catch (err) {
          toast.error("Failed to load cities");
        }
      };
      loadCities();
    }
  }, [province]);

  useEffect(() => {
    if (city) {
      const loadDistricts = async () => {
        try {
          const result = await fetchDistricts(city);
          setGeographic((prev) => ({ ...prev, district: result }));
        } catch (err) {
          toast.error("Failed to load districts");
        }
      };
      loadDistricts();
    }
  }, [city]);

  const handleSubmit = async (data: AddLocationT) => {
    try {
      const res = await instance.put("/users/login?_type=update_address", {
        moreSpesific: data.moreSpesific,
        province: geographic.provincies.find(
          (prov) => prov.id === data.province
        )?.name,
        city: geographic.cities.find((city) => city.id === data.city)?.name,
        district: geographic.district.find((dist) => dist.id === data.district)
          ?.name,
      } as AddLocationT);
      if (res.data.statusCode !== 200) throw new Error(res.data.message);
      router.reload();
    } catch (error) {
      toast.error("Failed to update address");
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1>Tambahkan alamat spesifik kamu !!</h1>
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Provinsi</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih salah satu provinsi yang kamu tempati..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[70]">
                  {geographic.provincies.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription>
                Silahkan pilih provinsi yang kamu tempati.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Kota</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih salah satu kota yang kamu tempati..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[70]">
                  {geographic.cities.length > 0 ? (
                    geographic.cities.map((data) => (
                      <SelectItem key={data.id} value={data.id}>
                        {data.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectGroup>
                      <SelectLabel>
                        Silahkan pilih provinsi mu terlebih dahulu
                      </SelectLabel>
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription>
                Silahkan pilih kota yang kamu tempati.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Kecamatan</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih salah satu kecamatan yang kamu tempati..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-[70]">
                  {geographic.district.length > 0 ? (
                    geographic.district.map((data) => (
                      <SelectItem key={data.id} value={data.id}>
                        {data.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectGroup>
                      <SelectLabel>
                        Silahkan pilih kota mu terlebih dahulu
                      </SelectLabel>
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription>
                Silahkan pilih kecamatan yang kamu tempati.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moreSpesific"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Specific location</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  className="resize-none h-64 p-3"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Berikan alamat rumah mu lebih spesifik
              </FormDescription>
            </FormItem>
          )}
        />
        <SubmitButton
          disabled={form.formState.isSubmitting}
          textBtn={form.formState.isSubmitting ? "Loading..." : "Submit"}
        />
      </form>
    </Form>
  );
};

export default FormAddLocation;
