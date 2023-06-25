import { useFieldArray, useForm } from "react-hook-form";

import WaveButton from "./WavaButton";

const HookForm = () => {
  const { register, handleSubmit, control } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "test", // unique name for your Field Array
    },
  );

  const onSubmit = (data: any) => {
    console.log(fields);
    console.log(data);
  };

  const arr = {
    name: "",
    address: "",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>훅폼</h1>
      {/* <h1 onClick={() => append(arr)}>추가</h1> */}
      {/* <BasicInput {...register("name")} /> */}

      {/* {fields.map((field, index) => (
   
        <div className="flex">
          <BasicInput {...register(`test.${index}.name`)} />
          <BasicInput {...register(`test.${index}.address`)} />
          <BasicInput {...register(`test.${index}.address`)} />
          <BasicInput {...register(`test.${index}.address`)} />
          <BasicInput {...register(`test.${index}.address`)} />
          <BasicInput {...register(`test.${index}.address`)} />
        </div>
      ))} */}
      {/* <button type="submit">제출</button> */}
      {/* 
      <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full h-[300px]">
        <div className="bg-red-500"></div>
        <div className="bg-yellow-500"></div>
      </div> */}

      <div className="container">
        <header className="item">HEADER</header>
        <main className="item">MAIN</main>
        <aside className="item">ASIDE</aside>
        <footer className="item">FOOTER</footer>
      </div>
      <button
        className="middle none center w-full rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        // data-ripple-light="true"
      >
        Button
      </button>
      <WaveButton>버튼</WaveButton>
    </form>
  );
};

export { HookForm };
