const SmallButton = ({
  Title,
  style,
  click,
  a,
}: {
  Title: string;
  style: string;
  click?: () => void;
  a?: string;
}) => {
  if (!a) {
    return (
      <button
        onClick={click}
        className={`h-[50px] active:scale-90 z-50 ${style} font-extrabold shadow-[-2px_2px_2px] hover:shadow-secondary_dark hover:-translate-y-2 duration-200 shadow-orange-400/25 from-orange-400 rounded-[40px] bg-gradient-to-r w-max text-white hover:from-purple-400 to-secondary_dark flex items-center justify-center`}
      >
        {Title}
      </button>
    );
  } else if (a) {
    return (
      <a
        href={a}
        className={`h-[50px] active:scale-90 z-50 ${style} font-extrabold shadow-[-2px_2px_2px] hover:shadow-secondary_dark hover:-translate-y-2 duration-200 shadow-orange-400/25 from-orange-400 rounded-[40px] bg-gradient-to-r w-max text-white hover:from-purple-400 to-secondary_dark flex items-center justify-center`}
      >
        {Title}
      </a>
    );
  }
};

export default SmallButton;
