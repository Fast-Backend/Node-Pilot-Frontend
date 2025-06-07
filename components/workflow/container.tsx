import classes from './container.module.css';

interface ContainerProps {
  children?: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div
      className={`w-[250px] h-max ${classes.wrapper} ${classes.gradient} hover:scale-105 ease-in transition-all`}
    >
      <div className="bg-black w-full h-full rounded-[6px]">{children}</div>
    </div>
  );
};
export default Container;
// className="wrapper gradient"
