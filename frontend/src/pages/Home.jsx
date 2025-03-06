import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import DescriptionIC from "../components/DescriptionIC";
import CommunityDes from "../components/CommunityDes";
import DollarInner from "../components/DollarInner";
import Path from "../components/Path";
import Banner from "../components/Banner";
import Features from "../components/Features";
import Quote from "../components/Quote";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import ActivityCarousel from "../components/ActivityCarousel";
import borderleftne from "../assets/images/borderleftne.png";
import borderrightne from "../assets/images/borderrightne.png";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const Home = () => {
  return (
    <>
      <div id="top" className="relative">
        {/* Border Images for Home Page Except Footer */}
        <motion.img
          src={borderleftne}
          alt="Left Border"
          className="fixed left-0 top-0 h-full z-10 hidden sm:block sm:w-[40px] lg:w-auto"
          style={{ objectFit: "cover" }}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        />
        <motion.img
          src={borderrightne}
          alt="Right Border"
          className="fixed right-0 top-0 h-full z-10 hidden sm:block sm:w-[40px] lg:w-auto sm:mr-2 lg:mr-5"
          style={{ objectFit: "cover" }}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        />

        <div className="sm:px-[40px] lg:px-[57px]">
          <motion.div variants={slideUp} initial="hidden" animate="visible">
            <Hero />
          </motion.div>

          <motion.div
            className="sm:px-[1rem]"
            
          >
            <ActivityCarousel />
          </motion.div>

          <motion.div
            id="about"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <DescriptionIC />
          </motion.div>

          <motion.div
            id="community"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CommunityDes />
          </motion.div>

          <motion.div
            id="value"
            className="px-[5px] lg:px-[30px]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <DollarInner />
          </motion.div>

          <motion.div
            id="path"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Path />
          </motion.div>

          <motion.div
            className="sm:px-[20px]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Banner />
          </motion.div>

          <motion.div
            id="values"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Features />
          </motion.div>

          <motion.div
            id="research"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Quote />
          </motion.div>

          <motion.div
            id="faq"
            className="px-[20px] lg:px-[35px]"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FAQ />
          </motion.div>
        </div>

        {/* Footer without Border Images */}
        <motion.div
          className="relative z-20"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
