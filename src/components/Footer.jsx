import { ArrowUp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-4 px-4 mt-12 pt-2 flex justify-center items-center relative">
      <p className="text-sm text-foreground/80 text-center w-full transition-colors">
        &copy; {new Date().getFullYear()} All rights reserved by{" "}
        <strong>
          <span className="transition-colors hover:text-primary">
            Shubhanan Sharma
          </span>
        </strong>
      </p>
      <a
        href="#home"
        className="hidden md:flex group absolute right-8 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
      >
        <ArrowUp size={20} />
      </a>
    </footer>
  );
};
