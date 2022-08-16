import React from "react";
import Icon from '@ant-design/icons';
import "./Spinner.css"


const LoadingSvg = () => (
  <svg width="68" height="76" viewBox="0 0 68 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M33.5194 25.2652C35.2687 25.2652 36.7417 24.3522 36.9335 23.1783L38.6675 3.53698C38.6675 1.59203 36.3774 0 33.5194 0C30.646 0 28.3711 1.59203 28.3711 3.53698L30.1204 23.1783C30.3047 24.3522 31.7699 25.2652 33.5194 25.2652Z" fill="#f04d46"/>
<path d="M22.8805 31.4112C23.7473 29.8767 23.6974 28.1735 22.7615 27.4139L6.57268 16.0933C4.88872 15.1112 2.36816 16.2813 0.925855 18.7594C-0.512734 21.2338 -0.221218 24.0112 1.42833 24.9741L19.351 33.2833C20.4981 33.7129 21.998 32.915 22.8805 31.3959" fill="#f04d46"/>
<path d="M44.1557 31.395C45.0723 32.9142 46.5723 33.7121 47.6887 33.3055L65.6114 24.9732C67.2763 23.9912 67.5257 21.2406 66.1178 18.7663C64.6792 16.2881 62.1435 15.1257 60.4633 16.0886L44.2706 27.3977C43.3729 28.1688 43.3078 29.8797 44.1746 31.4104" fill="#f04d46"/>
<path d="M33.5194 49.7996C35.2687 49.7996 36.7417 50.7126 36.9335 51.8865L38.6675 71.5278C38.6675 73.4727 36.3774 75.0494 33.5194 75.0494C30.646 75.0494 28.3711 73.4727 28.3711 71.5278L30.1204 51.8865C30.3047 50.7126 31.7699 49.7996 33.5194 49.7996Z" fill="#f04d46"/>
<path d="M44.1557 43.6709C45.0723 42.1479 46.5723 41.3347 47.6887 41.7758L65.6114 50.0927C67.2763 51.0556 67.5257 53.8292 66.1178 56.3073C64.6792 58.7663 62.1435 59.9364 60.4633 58.9735L44.2706 47.649C43.3729 46.8856 43.3078 45.1824 44.1746 43.6709" fill="#f04d46"/>
<path d="M22.8805 43.654C23.7473 45.1846 23.6974 46.8841 22.7615 47.6513L6.57268 58.9566C4.88872 59.9387 2.36816 58.7648 0.925855 56.3058C-0.512734 53.8314 -0.221218 51.054 1.42833 50.0911L19.351 41.7743C20.4981 41.3369 21.998 42.1425 22.8805 43.654Z" fill="#f04d46"/>
</svg>

);
// const antIcon = <Icon component={HeartSvg} className="spinImg" spin />;


const Spinner = function () {
  return <div data-testid='spinner' className="spin" >
    {/* <Spin indicator={antIcon} /> */}
    <Icon component={LoadingSvg} className="spinImg" spin />
    </div>;
};
export default Spinner;


