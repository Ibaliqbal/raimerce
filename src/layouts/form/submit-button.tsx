import { Button } from "@/components/ui/button";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  textBtn: string;
} & ComponentPropsWithoutRef<"button">;

const SubmitButton = ({ textBtn, ...rest }: Props) => {
  return (
    <Button type="submit" variant="primary" size="lg" {...rest}>
      {textBtn}
    </Button>
  );
};

export default SubmitButton;
