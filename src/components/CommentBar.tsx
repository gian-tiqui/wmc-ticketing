import { InputText } from "primereact/inputtext";

const CommentBar = () => {
  return (
    <div className="h-20 ">
      <InputText
        className="w-full rounded-full opacity-100 bg-slate-800 text-slate-100"
        value={
          "Make each of the comment hoverable and not the whole comment of the user"
        }
      />
    </div>
  );
};

export default CommentBar;
