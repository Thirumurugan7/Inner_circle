import React,{useState} from 'react'
import add from '../assets/images/add.svg'
import minus from "../assets/images/minus.svg";
import { qas } from '../constant';
const FAQ = () => {
      const [openIndex, setOpenIndex] = useState(null);

      const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
      };
    const qas = [
      {
        id: 0,
        question: "What is Inner Circle?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 1,
        question: "How do I join Inner Circle?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 2,
        question: "What is an SBT, and why does it matter?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 3,
        question: "What are the perks of being an Inner Circle member?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 4,
        question: "How does the point system work?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 5,
        question: "What makes Inner Circle different from other communities?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 6,
        question: "Where do Inner Circle members interact?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
      {
        id: 7,
        question: "What if I have more questions?",
        answer:
          "Inner Circle is an exclusive, trust-based community designed for those who want to grow, collaborate, and lead. It’s not just a network—it’s a shared journey of impact and transformation.",
      },
    ];
  return (
    <div className="px-[14px]">
      <h1 className="text-primary font-bold text-[45.2px] leading-[42.15px] tracking-[0] sm:text-[52.14px] sm:leading-[48.63px] lg:text-[89px] lg:leading-[83px] text-center thunder-bold uppercase">
        Inside the Circle
      </h1>

      <div className="pt-[5px] sm:pt-[7px] lg:pt-[40px]">
        {qas.map((qa, index) => (
          <div
            key={qa.id}
            className="border-b-[1px] border-[#ABABAB66] py-[13px] sm:py-[15px] lg:py-[20px] cursor-pointer"
          >
            <div
              className="flex gap-[7.62px] sm:gap-[15px] md:gap-[20px] lg:gap-[25px] items-center"
              onClick={() => toggleFAQ(index)}
            >
              <img
                src={openIndex === index ? minus : add}
                alt="toggle-icon"
                className="w-[8.13px] h-[8.13px] sm:w-[9.37px] sm:h-[9.37px]  lg:w-[16px] lg:h-[16px] transition-transform duration-300"
              />
              <div>
                <h1 className="text-primary font-normal text-[10.16px] leading-[13px] tracking-[0.1px]  sm:text-[11.72px] sm:leading-[15px]  lg:text-[20px] lg:leading-[25.6px] sm:tracking-[0.2px] font-dmSans">
                  {qa.question}
                </h1>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-[500px] opacity-100 pt-[10px] lg:mt-[15px]"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#8E8E8E] font-dmSans font-normal text-[9.14px] sm:text-[10.55px] sm:leading-[15px] sm:tracking-[0.12px]   leading-[13px] tracking-[0.1px] lg:text-[18px] lg:leading-[25.6px] lg:tracking-[0.2px]">
                    {qa.answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer with smooth height transition */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ
