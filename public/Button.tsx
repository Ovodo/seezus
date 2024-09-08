const Button = ({
  Title,
  style,
  click,
}: {
  Title: string;
  style: string;
  click?: () => void;
}) => {
  return (
    <button
      onClick={click}
      className={`h-[83px] active:scale-90 z-50 ${style} font-extrabold shadow-[-2px_2px_2px] hover:shadow-secondary_dark hover:-translate-y-2 duration-200 shadow-orange-400/25 hover:from-orange-400 text-[42px] rounded-[40px] bg-gradient-to-r w-max text-white from-secondary_light to-secondary_dark flex items-center justify-center`}
    >
      {Title}
    </button>
  );
};

export default Button;
