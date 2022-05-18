// import { push } from "connected-react-router";
import React from "react";
import { useSelector } from "react-redux";
// import ConfigureWindow from "./ConfigureWindow";
import config from "../../config";

const SidebarHeader = () => {
  const teamInfo = useSelector((state) => state.teamInfo);
  return (
    <div>
      <a href={config.subdir}>
        <div className="sidebar-header">
          {/* <div className="team-info" onClick={this.toggleConfigureWindow.bind(this)}> */}
          <div className="team-info">
            <span className="team-name">{teamInfo.name} </span>
            <p className="configure-toggler"></p>
          </div>
        </div>
      </a>
      {/* {this.state.showConfigureWindow && (
      <ConfigureWindow
        toggleConfigureWindow={this.toggleConfigureWindow.bind(this)}
      />
    )} */}
    </div>
  );
};
// class SidebarHeader extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showConfigureWindow: null,
//     };
//   }
//   toggleConfigureWindow() {
//     this.setState({
//       showConfigureWindow: !this.state.showConfigureWindow,
//     });
//   }
//   render() {
//     return (
//       <div>
//         <a href={config.subdir}>
//           <div className="sidebar-header">
//             {/* <div className="team-info" onClick={this.toggleConfigureWindow.bind(this)}> */}
//             <div className="team-info">
//               <span className="team-name">{this.props.teamInfo.name} </span>
//               <p className="configure-toggler"></p>
//             </div>
//           </div>
//         </a>
//         {/* {this.state.showConfigureWindow && (
//           <ConfigureWindow
//             toggleConfigureWindow={this.toggleConfigureWindow.bind(this)}
//           />
//         )} */}
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     teamInfo: state.teamInfo,
//     router: state.router,
//   };
// };

// export default connect(mapStateToProps)(SidebarHeader);

export default SidebarHeader;
