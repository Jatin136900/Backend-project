import { FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-amber-700 text-white px-6 py-6 text-center  shadow-md mt-8 w-full z-50">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-sm md:text-base">
        <p>&copy; 2025 | All Rights Reserved</p>
        <p>
          Made with{" "}
          <FaHeart className="inline-block text-red-900 mx-1" /> by{" "}
          <a
            href="https://github.com/Jatin136900"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Jatin Verma
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
