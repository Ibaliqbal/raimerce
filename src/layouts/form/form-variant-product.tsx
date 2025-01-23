import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VariantSchemaT } from "@/types/product";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import MediaPreview from "@/components/media-preview";

function ErrorMessage({ error }: { error: string }) {
  return error && <p className="text-sm text-red-600">{error}</p>;
}

type Props = {
  handleAdd: (data: VariantSchemaT) => void;
  disabledUploadBtn: boolean;
};

const FormVariantProduct = ({ handleAdd, disabledUploadBtn }: Props) => {
  const [variants, setVariants] = useState<VariantSchemaT>({
    name_variant: "",
    price: 0,
    stock: 0,
    medias: [],
  });

  const [errors, setErrors] = useState<{
    name_variant: string;
    price: string;
    stock: string;
  }>({
    name_variant: "",
    price: "",
    stock: "",
  });

  const isFormValid = () => {
    return (
      variants.name_variant !== "" &&
      variants.price > 0 &&
      variants.stock > 0 &&
      Object.values(errors).every((error) => error === "")
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name_variant" className="text-base">
          Variant Name
        </Label>
        <Input
          className="text-base py-7 border border-slate-700"
          placeholder="Enter your product name..."
          id="name_variant"
          name="name_variant"
          value={variants.name_variant}
          onChange={(e) =>
            setVariants(
              (prev) =>
                ({
                  ...prev,
                  [e.target.name]: e.target.value as string,
                } as VariantSchemaT)
            )
          }
        />
        <ErrorMessage error={errors.name_variant} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-base" htmlFor="price">
            Price
          </Label>
          <Input
            className="text-base py-7 border border-slate-700"
            placeholder="Enter your product name..."
            id="price"
            name="price"
            value={variants.price === 0 ? "" : variants.price}
            onChange={(e) => {
              setErrors((prev) => ({
                ...prev,
                [e.target.name]: "",
              }));
              if (isNaN(Number(e.target.value))) {
                setErrors((prev) => ({
                  ...prev,
                  [e.target.name]: "Price must be a number",
                }));
              } else {
                setVariants(
                  (prev) =>
                    ({
                      ...prev,
                      [e.target.name]: Number(e.target.value) as number,
                    } as VariantSchemaT)
                );
              }
            }}
          />
          <ErrorMessage error={errors.price} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-base" htmlFor="stock">
            Stock
          </Label>
          <Input
            className="text-base py-7 border border-slate-700"
            placeholder="Enter your product name..."
            id="stock"
            name="stock"
            value={variants.stock === 0 ? "" : variants.stock}
            onChange={(e) => {
              setErrors((prev) => ({
                ...prev,
                [e.target.name]: "",
              }));
              if (isNaN(Number(e.target.value))) {
                setErrors((prev) => ({
                  ...prev,
                  [e.target.name]: "Stock must be a number",
                }));
              } else {
                setVariants(
                  (prev) =>
                    ({
                      ...prev,
                      [e.target.name]: Number(e.target.value) as number,
                    } as VariantSchemaT)
                );
              }
            }}
          />
          <ErrorMessage error={errors.stock} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-base">Upload your products photo</h3>
        <UploadButton
          endpoint="mediaPost"
          className="self-start"
          disabled={disabledUploadBtn}
          onClientUploadComplete={(res) => {
            if (variants.medias.length > 0) {
              setVariants((prev) => ({
                ...prev,
                medias: [
                  ...prev.medias,
                  ...res.map((data) => ({
                    keyFile: data.key,
                    name: data.name,
                    url: data.url,
                    type:
                      data.type.split("/")[0] === "image"
                        ? "image"
                        : data.key.split(".")[1],
                  })),
                ],
              }));
            } else {
              setVariants((prev) => ({
                ...prev,
                medias: [
                  ...res.map((data) => ({
                    keyFile: data.key,
                    name: data.name,
                    url: data.url,
                    type:
                      data.type.split("/")[0] === "image"
                        ? "image"
                        : data.key.split(".")[1],
                  })),
                ],
              }));
            }
          }}
          onBeforeUploadBegin={(files) => {
            // Add timestamp to filename before upload
            return files.map((f) => {
              const timestamp = new Date().getTime();
              return new File([f], `${timestamp}-${f.name}`, { type: f.type });
            });
          }}
        />
        {variants.medias.length > 0 ? (
          <div className="grid grid-cols-4 gap-4 mb-10">
            {variants.medias.map((media) => (
              <MediaPreview
                key={media.keyFile}
                type={media.type as "image" | "video"}
                src={media.url}
                alt={media.name}
                keyFile={media.keyFile}
                handleDlete={() => {
                  setVariants((prev) => ({
                    ...prev,
                    medias: prev.medias.filter(
                      (m) => m.keyFile !== media.keyFile
                    ),
                  }));
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
      <Button
        type="button"
        className="self-end "
        variant="primary"
        size="lg"
        disabled={!isFormValid() || variants.medias.length <= 0}
        onClick={(e) => {
          e.preventDefault();
          if (isFormValid()) {
            setVariants({
              name_variant: "",
              price: 0,
              stock: 0,
              medias: [],
            });
            handleAdd(variants);
          }
        }}
      >
        Add
      </Button>
    </section>
  );
};

export default FormVariantProduct;
