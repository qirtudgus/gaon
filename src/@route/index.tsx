import { FC } from "react";

import { Route, Routes } from "react-router-dom";
import { HookForm } from "../@containers/HookForm";
import { InfinityScroll } from "../@containers/InfinityScroll";
import App from "../App";

const RootRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/infinityscroll" element={<InfinityScroll />} />
      <Route path="/hookform" element={<HookForm />} />
    </Routes>
  );
};

export { RootRouter };
