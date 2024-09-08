import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import OutsideClick from "react-outside-click-handler";

const choiceData = [
  { id: 1, label: "Rock", imgSrc: "/images/rock.jpg", alt: "rock" },
  { id: 2, label: "Scissors", imgSrc: "/images/scissors.jpg", alt: "scissors" },
  { id: 3, label: "Paper", imgSrc: "/images/paper.jpeg", alt: "paper" },
];

export const Choose = ({
  choices,
  setChoices,
}: {
  choices: number[];
  setChoices: any;
}) => {
  const choose = (id: number) => setChoices([id]);

  return (
    <div className='gap-9 relative flex items-center h-full pb-4 justify-center'>
      <AnimatePresence mode='sync'>
        {choiceData.map(({ id, label, imgSrc, alt }) =>
          choices.includes(id) ? (
            <motion.div
              onClick={() => choose(id)}
              key={id}
              initial={{ x: id === 1 ? 300 : id === 3 ? -300 : 0 }}
              animate={{ x: 0 }}
              exit={{ x: id === 1 ? 300 : id === 3 ? -300 : 0, opacity: 0 }}
              transition={{ duration: 1 }}
              className='flex flex-col items-center'
            >
              <p className='text-secondary mb-2 text-base font-medium'>
                {label}
              </p>
              <img
                src={imgSrc}
                className='w-[150px] rounded-sm border-2 hover:translate-y-3 duration-200 cursor-pointer border-purple-500 h-[150px]'
                alt={alt}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      <p className='absolute bottom-2 left-3'>
        {choices.length == 1
          ? " Click outside this box to reset or click confirm"
          : "Choose your item"}
      </p>
    </div>
  );
};
