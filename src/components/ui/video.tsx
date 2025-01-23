import React, { ComponentPropsWithRef } from "react";

const Video = ({ src, ...rest }: ComponentPropsWithRef<"video">) => {
  return <video src={src} {...rest}></video>;
};

export default Video;
